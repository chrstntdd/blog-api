const chai = require('chai');
const chaiHttp = require('chai-http');

const {app,runServer,closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Blog posts', () => {
  
  before(function () {
    return runServer();
  });

  after(function () {
    return closeServer();
  });

  it('should return blog posts on GET', () => {
    return chai.request(app)
      .get('/blog-posts')
      .then(function (res) {
        res.should.be.json;
        res.should.have.status(200);
        res.body.should.be.an('array');

        res.body.length.should.be.at.least(1);
        const requiredFields = ['title', 'content', 'author'];
        res.body.map(item => {
          item.should.be.an('object');
          item.should.include.key(requiredFields);
        });
      });
  });

  it('should delete a blog post on DELETE', () => {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res){
        return chai.request(app)
          .delete(`/blog-posts/${res.body[0].id}`)
      })
      .then(function(res){
        res.should.have.status(204);
      });
  });

  it('should create a new blog post on POST', () => {
    const newBlogPost = {
      title: 'hipsum',
      content: 'foo bar baz',
      author: 'Ben Bailey'
    };

    chai.request(app)
      .post('/blog-posts')
      .send(newBlogPost)
      .end(function(res){
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.an('object');
        res.should.have.keys('title','content','author');
      });
  });

   it('should update blog posts on PUT', function(done) {
    //  doesnt require return statements???

    chai.request(app)
      .get('/blog-posts')
      .end(function( res) {
        const updatedPost =  {
          title: '10 Reasons Why TDD Saved the iPhone',
          content: 'lorem',
          author: 'Steve Jobs'
        };
        chai.request(app)
          .put(`/blog-posts/${res.body[0].id}`)
          .send(updatedPost)
          .end(function(err, res) {
            res.should.have.status(204);
            res.should.be.json;
          });
      })
      done();
  });

});