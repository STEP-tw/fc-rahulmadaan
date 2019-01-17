const { readFile } = require('fs');
const ENCODING = "utf8";

const app = (req, res) => {
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

module.exports = app;
