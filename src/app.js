const { readFile, appendFile } = require('fs');
const createApp = require("../public/framework.js");
const app = createApp();
const ENCODING = "utf8";

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
}

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

const serveFile = (req, res, next) => {
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

const guestBook = function (req, res) {
  readFile(`.${req.url}`, "utf8", (err, contents) => {
    let userComments = readArgs(req.body);
    userComments.dateTime = new Date();
    appendFile('./comments.json', JSON.stringify(userComments));
    send(res, contents);
  });
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