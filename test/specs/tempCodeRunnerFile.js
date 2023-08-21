function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomIpAddressInRange(min, max) {
    const parts = [
        getRandomInt(min[0], max[0]),
        getRandomInt(min[1], max[1]),
        getRandomInt(min[2], max[2]),
        getRandomInt(min[3], max[3])
    ];

    return parts.join('.');
}

function generateRandomIpAddressesInRange(min, max, count) {
    const ipAddresses = [];

    while (ipAddresses.length < count) {
        const ipAddress = generateRandomIpAddressInRange(min, max);
        ipAddresses.push(ipAddress);
    }

    return ipAddresses;
}

module.exports = function generateRandomIpListsWithinRange(minIpParts, maxIpParts, listCount, ipCountPerList) {
    const listOfLists = [];

    for (let i = 0; i < listCount; i++) {
        const randomIpAddresses = generateRandomIpAddressesInRange(minIpParts, maxIpParts, ipCountPerList);
        listOfLists.push(randomIpAddresses);
    }

    return listOfLists;
};

const minIpParts = [153, 4, 0, 0];
const maxIpParts = [153, 104, 255, 255];
const listCount = 10; // Number of lists
const ipCountPerList = 10; // Number of IP addresses in each list

const randomListOfLists = generateRandomIpListsWithinRange(minIpParts, maxIpParts, listCount, ipCountPerList);

console.log('Generated random list of lists of IP addresses:');
console.log(randomListOfLists);