const fs = require("fs");
const CountriesWithMoreTimezones = require("./variables.js").CountriesWithMoreTimezones;

let newCsv = 'f,t,c,p,d';

fs.readFileSync('IPv4-to-city.csv', 'utf-8').split(/\r?\n/).forEach(function(line) {
  CountriesWithMoreTimezones.forEach(function(countryCode) {    
    if (line.includes(`,${countryCode},`)) {
      const lineArray = line.split(',');
      newCsv += `\n${lineArray[0]},${lineArray[1]},${lineArray[3]},${lineArray[4]},${lineArray[5]}`;
    }
  })
});

fs.writeFile("IPv4-to-some-cities.csv", newCsv, (err) => {
  if (err) {
    throw err;
  }
});