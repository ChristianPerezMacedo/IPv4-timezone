"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromIpToNumber = void 0;
const removeIpPort = (ipWithPort) => ipWithPort.split(":")[0];
const fromIpToNumber = (ip) => Number(removeIpPort(ip).split('.').map((d) => d.padStart(3, '0')).join(''));
exports.fromIpToNumber = fromIpToNumber;
//# sourceMappingURL=utils.js.map