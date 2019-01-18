const { readFile } = require('fs');
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

app.use(readbody);
app.use(logRequest);
app.use(serveFile);
app.use(notFound);

module.exports = app;