const { readFile } = require('fs');
const createApp = require("../public/framework.js");
const app = createApp();
const ENCODING = "utf8";



// const html = {
//   home: ()=>{}
// };

const html = {
  homepage: (req, res, fileName) => readFile(fileName, (err, contents) => {
    send(res, contents);
  })
};

const send = (res, contents, statusCode = 200) => {
  res.write(contents);
  res.statusCode = statusCode;
  res.end();
}
const readbody = (req, res, jumpToNext) => {
  // const contents = "";
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

const serveFile = (req, res) => {
  try {
    if (req.url === "/") {
      readFile('./index.html', ENCODING, (err, data) => {
        res.write(data);
      });
      return;
    }
    readFile(`.${req.url}`, ENCODING, (err, data) => {
      res.write(data);
      res.statusCode = 200;
      res.end();
    });
  }
  catch (err) {
    console.log(err);
  }
};
// Export a function that can act as a handler

app.use(readbody);
app.use(serveFile);
app.use(notFound);

const getURL = function(req,res){
  if(req.url == "/"){
    
  }
}

module.exports = app;
