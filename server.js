require('dotenv').config();
const express = require('express');
const fetchService = require('./services/fetchService');

const app = express();
const PORT = process.env.VERCEL_PORT || 3000;

// Fetch and compare articles every 5 seconds
setInterval(async () => {
  const newArticles = await fetchService.fetchAndCompare();
  if (newArticles.length > 0) {
    console.log(`Found ${newArticles.length} new articles.`);
  }
}, 5000);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running`);
});
