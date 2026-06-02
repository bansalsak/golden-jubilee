const express = require('express');
const cors = require('cors');

const { findMatches } = require('./search');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/', (_, res) => {
  res.send('Golden Jubilee Face Search API');
});

app.post('/search', (req, res) => {
  const { descriptor } = req.body;

  if (!descriptor) {
    return res.status(400).json({
      error: 'Missing descriptor'
    });
  }

  try {
    const matches = findMatches(descriptor, 0.45);

    res.json(matches.slice(0, 100));
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Search failed'
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});