const removeIpPort = (ipWithPort: string) => ipWithPort.split(":")[0];
export const fromIpToNumber = (ip: string) => Number(removeIpPort(ip).split('.').map((d) => d.padStart(3, '0')).join(''));