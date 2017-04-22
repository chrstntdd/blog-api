const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { BlogPosts } = require('./models');

BlogPosts.create('Foo', 'Whatever', 'Kenny Rodgers', '4/21/1963');
BlogPosts.create('Bar', 'Lorem', 'Dick Fittsmore', '8/29/2015');
BlogPosts.create('Yup', 'Ipsum', 'Moe Lester', '3/15/2001');

checkFields = (requiredFields, req) => {
  requiredFields.map(field => {
    if (!(field in req.body)){
      const message = `Missing ${field} in the request body.`;
      console.error(message);
      return res.status(400).send(message);
    }
  });
}

router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
  // check if required fields are filled out
  let requiredFields = ['title', 'content', 'author'];
  checkFields(requiredFields, req);
  let post = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
  res.status(201).json(post);
});

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post ${req.params.id}.`);
  res.status(204).end();
});

module.exports = router;