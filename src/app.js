const { readFile } = require('fs');


const app = (req, res) => {
  try {

    if (req.url === "/") {
      readFile('./index.html', 'utf8', (err, data) => {
        res.write(data);
      });
      return;
    }
    readFile(`.${req.url}`, "utf8", (err, data) => {
      res.write(data);
      res.end();
    });
  }
  catch (err) {
    console.log(err);
  }

};
// Export a function that can act as a handler

module.exports = app;
