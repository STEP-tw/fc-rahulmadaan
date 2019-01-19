const { readFile, appendFile } = require('fs');
const createApp = require("../public/framework.js");
const app = createApp();

const ENCODING = "utf8";
const SPACE = " ";
const NEWLINE = "\n";

const send = (res, contents, statusCode = 200) => {
  res.write(contents);
  res.statusCode = statusCode;
  res.end();
};

const logRequest = function (req, res, next) {
  console.log(req.url);
  console.log(req.method);
  console.log(req.body);
  next();
};

const readbody = (req, res, jumpToNext) => {
  let contents = "";
  req.on("data", chunk => contents += chunk);
  req.on("end", () => {
    req.body = contents;
    jumpToNext();
  });
};

const notFound = (req, res, jumpToNext) => {
  send(res, 'Not Found', 404);
  jumpToNext();
};

const handleRequest = function (url, encoding, res, next) {
  readFile(url, encoding, (err, contents) => {
    if (err) {
      send(res, "404 Page Not Found", 404);
      return;
    }
    send(res, contents.toString());
  });
};

const serveFile = (req, res) => {
  try {
    if (req.url === "/") {
      handleRequest("./index.html", ENCODING, res);
      return;
    }
    handleRequest(`.${req.url}`, ENCODING, res);
  }
  catch (err) {
    console.log(err);
    res.end();
  }
};

const updateAndReadComments = function (file, data, res) {
  let contents = "";
  appendFile(file, JSON.stringify(data) + NEWLINE, (err) => {
    if (err) throw err;
    readFile(file, "utf8", (err, content) => {
      contents += getGuestBookData(content);
      send(res, contents);
    });
  });
};

const guestBook = function (req, res) {
  readFile(`.${req.url}`, "utf8", (err, contents) => {
    res.write(contents);
    let userComments = readArgs(req.body);
    userComments.dateTime = new Date().toLocaleString();
    updateAndReadComments("./comments.json", userComments, res);
  });
};

const decodeElements = function (comment) {
  comment.name = decodeURIComponent(comment.name).replace(/\+/g, SPACE);
  comment.comment = decodeURIComponent(comment.comment).replace(/\+/g, SPACE);
  return comment;
};

const jsonToHTML = function (elements) {
  let output = "";
  let delimiter = "";
  let parameters = ["dateTime", "name", "comment"]
  parameters.map(parameter => {
    output = output + delimiter + elements[parameter];
    delimiter = " : ";
  })
  return output;
};

const getGuestBookData = function (comments) {
  let list = comments.split("\n");
  list.pop(); // unnecessary line
  let output = '';
  list.map((comment) => {
    decodedComments = decodeElements(JSON.parse(comment));
    output = output + jsonToHTML(decodedComments);
    output = output + "<br>" + NEWLINE;
  });
  return output;
};


const readArgs = text => {
  let args = {};
  const splitKeyValue = pair => pair.split('=');
  const assignKeyValueToArgs = ([key, value]) => args[key] = value;
  text.split('&').map(splitKeyValue).forEach(assignKeyValueToArgs);
  return args;
};

app.use(readbody);
app.use(logRequest);
app.post("/guestBook.html", guestBook);
app.use(serveFile);
app.use(notFound);

module.exports = app;
