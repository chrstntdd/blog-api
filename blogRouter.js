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

router.put('/:id', jsonParser, (req,res) => {
  requiredFields = ['title', 'content', 'author', 'id'];
  checkFields(requiredFields, req);
  if (req.params.id !== req.body.id){
    const message = `The request path id: ${req.params.id} must match the request body id: ${req.body.id}`;
    console.error(message);
    return res.status(400).send(message);
  }
  const updatedPost = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  });
  console.log(`Finished updating blog post ${req.params.id}.`);
  res.status(204).json(updatedPost);
});

module.exports = router;