import * as cityTimeZones from "city-timezones";
import * as moment from "moment-timezone";
import * as countryTimeZones from "countries-and-timezones";

import * as IpToCountry from "./IPv4-to-country.json";
import * as IpToCities from "./IPv4-to-some-cities.json";
import { fromIpToNumber } from "./utils";

import { CountriesWithMoreTimezones  } from "./variables.js";

const countriesWithMoreTimezones: string[] = CountriesWithMoreTimezones;
const ipToCountry: Array<{ f: string; t: string, c: string }> = IpToCountry as any;
const ipToCities: Array<{ 
  f: string; 
  t: string, 
  c: string; // country
  p: string; // province
  d: string; // city
}> = IpToCities as any;

export function getTimezoneFromCountry(country: string) {
  const { timezones } = countryTimeZones.getCountry(country);
  const momentTimezone = moment.tz(timezones[0]);
  const offset = momentTimezone.utcOffset(); // in minutes
  const offsetInQuarters = Math.floor(offset / 15); // in quarters
  return offsetInQuarters;
}

export function getTimezoneFromCity(city: string) {
  const cityData = cityTimeZones.findFromCityStateProvince(city);
  const momentTimezone = moment.tz(cityData[0].timezone);
  const offset = momentTimezone.utcOffset(); // in minutes
  const offsetInQuarters = Math.floor(offset / 15); // in quarters
  return offsetInQuarters;
}


export function getTimezoneFromIp(ip: string) {
  const ipNumber = fromIpToNumber(ip);
  
  for (const element of ipToCountry) {
    let from  = fromIpToNumber(element.f);
    let to = fromIpToNumber(element.t);
    if (ipNumber >= from && ipNumber <= to) {
      if (countriesWithMoreTimezones.includes(element.c)) {
        
        ipToCities.forEach(city => {
          from = fromIpToNumber(city.f);
          to = fromIpToNumber(city.t);
          if (ipNumber >= from && ipNumber <= to) {
            const offsetInQuarters = getTimezoneFromCity(city.c);
            console.log(`Ip: ${ip} is in ${element.c} with offset ${offsetInQuarters} (quarter hours)`);
            return offsetInQuarters;
          }
        });
        
      } else {
        const offsetInQuarters = getTimezoneFromCountry(element.c);
        console.log(`Ip: ${ip} is in ${element.c} with offset ${offsetInQuarters} (quarter hours)`);
        return offsetInQuarters;
      }
    }
  }
}

const commonIp = "151.42.104.84:64173"; // Italia
const ipFromCountryWithMultipleTimezones = "2.255.191.16:64173"; // France

getTimezoneFromIp(commonIp);
getTimezoneFromIp(ipFromCountryWithMultipleTimezones);