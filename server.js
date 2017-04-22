const express = require('express');

const app = express();

const blogRouter = require('./blogRouter');

// route for blog posts
app.use('/blog-posts', blogRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});