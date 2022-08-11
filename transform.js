// require csvtojson module
const CSVToJSON = require("csvtojson");
const fs = require("fs");

CSVToJSON({ delimiter: ";" })
  .fromFile("IPv4-to-country.csv")
  .then((d) => {
    // write JSON array to file
    fs.writeFile("IPv4-to-country.json", JSON.stringify(d), (err) => {
      if (err) {
        throw err;
      }
    });
  })
  .catch((err) => {
    // log error if any
    console.log(err);
  });

CSVToJSON({ delimiter: "," })
  .fromFile("IPv4-to-some-cities.csv")
  .then((d) => {
    // write JSON array to file
    fs.writeFile("IPv4-to-some-cities.json", JSON.stringify(d), (err) => {
      if (err) {
        throw err;
      }
    });
  })
  .catch((err) => {
    // log error if any
    console.log(err);
  });
