const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

let index = [];

try {
  index = require('./search-index.json');
  console.log('Loaded faces:', index.length);
} catch {
  console.log('search-index.json not ready yet');
}

function distance(a, b) {
  let sum = 0;

  for (let i = 0; i < 128; i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }

  return Math.sqrt(sum);
}

app.post('/search', (req, res) => {
  const descriptor = req.body.descriptor;

  if (!descriptor) {
    return res.status(400).json({ error: 'missing descriptor' });
  }

  const matches = [];

  for (const face of index) {
    const dist = distance(descriptor, face.descriptor);

    if (dist < 0.45) {
      matches.push({
        photo: face.photo,
        fileId: face.fileId,
        score: 1 - dist
      });
    }
  }

  const unique = {};

  for (const match of matches) {
    if (
      !unique[match.photo] ||
      unique[match.photo].score < match.score
    ) {
      unique[match.photo] = match;
    }
  }

  res.json(
    Object.values(unique)
      .sort((a, b) => b.score - a.score)
      .slice(0, 100)
  );
});

app.get('/', (_, res) => {
  res.send('Golden Jubilee Face Search API');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server started');
});