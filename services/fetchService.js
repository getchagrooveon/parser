const axios = require('axios');
const fs = require('fs');
const path = require('path');
const emailService = require('./emailService');

const articlesFilePath = path.join(__dirname, '../data/articles.json');

if (!fs.existsSync(articlesFilePath)) {
  fs.writeFileSync(articlesFilePath, JSON.stringify([]));
}

const fetchAndCompare = async () => {
  try {
    const response = await axios.get(process.env.VERCEL_NEWS_API_URL);

    const articles = response?.data?.data?.catalogs[0]?.articles;

    if (!articles || !Array.isArray(articles)) {
      console.error('Error: Articles data is either undefined or not an array.');
      return [];
    }

    const existingArticles = JSON.parse(fs.readFileSync(articlesFilePath, 'utf8'));

    const newArticles = [];

    for (const article of articles) {
      const exists = existingArticles.some(a => a.url === article.url);
      if (!exists) {
        newArticles.push({
          title: article.title,
          id: article.id,
          code: article.code,
          releaseDate: article.releaseDate,
        });
      }
    }

    if (newArticles.length > 0) {
      const updatedArticles = [...existingArticles, ...newArticles];
      fs.writeFileSync(articlesFilePath, JSON.stringify(updatedArticles, null, 2));

      await emailService.sendEmail(newArticles);
    }

    return newArticles;
  } catch (err) {
    console.error('Error fetching or comparing articles:', err.message || err);
    return [];
  }
};

module.exports = {fetchAndCompare};
