const descriptors = require('./descriptors.json');
const photoMap = require('./photo-map.json');

function distance(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return Math.sqrt(sum);
}

function findMatches(selfieDescriptor, threshold = 0.45) {
  const matches = [];

  for (const item of descriptors) {
    const dist = distance(selfieDescriptor, item.descriptor);

    if (dist < threshold) {
      matches.push({
        photo: item.photo,
        driveId: photoMap[item.photo],
        distance: dist
      });
    }
  }

  matches.sort((a, b) => a.distance - b.distance);

  return matches;
}

module.exports = { findMatches };