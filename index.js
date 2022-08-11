"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimezoneFromIp = exports.getTimezoneFromCity = exports.getTimezoneFromCountry = exports.getUtcOffsetForLocation = exports.getNormalizedUtcOffset = void 0;
const cityTimeZones = require("city-timezones");
const moment = require("moment-timezone");
const countryTimeZones = require("countries-and-timezones");
const IpToCountry = require("./IPv4-to-country.json");
const IpToCities = require("./IPv4-to-some-cities.json");
const utils_1 = require("./utils");
const variables_js_1 = require("./variables.js");
const countriesWithMoreTimezones = variables_js_1.CountriesWithMoreTimezones;
const ipToCountry = IpToCountry;
const ipToCities = IpToCities;
/**
 * Returns the UTC offset for the given timezone
 * @param timezone Example: America/New_York
 */
function getNormalizedUtcOffset(timezone) {
    const momentTimezone = moment.tz(timezone);
    if (!momentTimezone) {
        return null;
    }
    let offset = momentTimezone.utcOffset();
    if (momentTimezone.isDST()) {
        // utcOffset will return the offset normalized by DST. If the location
        // is in daylight saving time now, it will be adjusted for that. This is
        // a NAIVE attempt to normalize that by going back 1 hour
        offset -= 60;
    }
    return offset / 60;
}
exports.getNormalizedUtcOffset = getNormalizedUtcOffset;
/**
 * Returns the offset range for the given city or region
 * @param location
 */
function getUtcOffsetForLocation(location) {
    const timezones = cityTimeZones.findFromCityStateProvince(location);
    if (timezones && timezones.length) {
        // timezones will contain an array of all timezones for all cities inside
        // the given location. For example, if location is a country, this will contain
        // all timezones of all cities inside the country.
        // YOU SHOULD CACHE THE RESULT OF THIS FUNCTION.
        const offsetSet = new Set();
        for (let timezone of timezones) {
            const offset = getNormalizedUtcOffset(timezone.timezone);
            if (offset !== null) {
                offsetSet.add(offset);
            }
        }
        return [...offsetSet].sort((a, b) => a - b);
    }
    return null;
}
exports.getUtcOffsetForLocation = getUtcOffsetForLocation;
function getTimezoneFromCountry(country) {
    const { timezones } = countryTimeZones.getCountry(country);
    const momentTimezone = moment.tz(timezones[0]);
    const offset = momentTimezone.utcOffset(); // in minutes
    const offsetInQuarters = Math.floor(offset / 15); // in quarters
    return offsetInQuarters;
}
exports.getTimezoneFromCountry = getTimezoneFromCountry;
function getTimezoneFromCity(city) {
    const cityData = cityTimeZones.findFromCityStateProvince(city);
    const momentTimezone = moment.tz(cityData[0].timezone);
    const offset = momentTimezone.utcOffset(); // in minutes
    const offsetInQuarters = Math.floor(offset / 15); // in quarters
    return offsetInQuarters;
}
exports.getTimezoneFromCity = getTimezoneFromCity;
function getTimezoneFromIp(ip) {
    const ipNumber = (0, utils_1.fromIpToNumber)(ip);
    for (const element of ipToCountry) {
        let from = (0, utils_1.fromIpToNumber)(element.f);
        let to = (0, utils_1.fromIpToNumber)(element.t);
        if (ipNumber >= from && ipNumber <= to) {
            if (countriesWithMoreTimezones.includes(element.c)) {
                ipToCities.forEach(city => {
                    from = (0, utils_1.fromIpToNumber)(city.f);
                    to = (0, utils_1.fromIpToNumber)(city.t);
                    if (ipNumber >= from && ipNumber <= to) {
                        const offsetInQuarters = getTimezoneFromCity(city.c);
                        console.log(`Ip: ${ip} is in ${element.c} with offset ${offsetInQuarters} (quarter hours)`);
                        return offsetInQuarters;
                    }
                });
            }
            else {
                const offsetInQuarters = getTimezoneFromCountry(element.c);
                console.log(`Ip: ${ip} is in ${element.c} with offset ${offsetInQuarters} (quarter hours)`);
                return offsetInQuarters;
            }
        }
    }
}
exports.getTimezoneFromIp = getTimezoneFromIp;
const commonIp = "151.42.104.84:64173"; // Italia
const ipFromCountryWithMultipleTimezones = "2.255.191.16:64173"; // France
getTimezoneFromIp(commonIp);
getTimezoneFromIp(ipFromCountryWithMultipleTimezones);
//# sourceMappingURL=index.js.map