let mongoose = require("mongoose");
let app = require("./app");
let chai = require("chai");
let chaiHttp = require("chai-http");


// Assertion 
chai.should();
chai.use(chaiHttp); 

let isConnected = false;

before(async function () {

  this.timeout(20000);
  if (isConnected) {
    console.log("MongoDB already connected, skipping reconnection");
    return;
  }
  const uri = process.env.MONGO_URI;

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true; 
    console.log("Connected to MongoDB for tests");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err;
  }
});

after(async () => {
  if (isConnected) {
    await mongoose.connection.close();
    console.log("MongoDB connection closed after tests");
    isConnected = false;
  } else {
    console.log("No MongoDB connection to close");
  }
});
// ------------------------------------------

describe('Planets API Suite', () => {

    describe('Fetching Planet Details', () => {
        it('it should fetch a planet named Mercury', (done) => {
            let payload = {
                id: 1
            }
          chai.request(app)
              .post('/planet')
              .send(payload)
              .end((err, res) => {
                try {
                    if (err) {
                    console.error('Request error:', err);
                    return done(err);
                    }
                    console.log('Testing planet:',res.body.name);
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(1);
                    res.body.should.have.property('name').eql('Mercury');
                done();
               } catch (e) {
                 done(e);
                }
              });
        });

        it('it should fetch a planet named Venus', (done) => {
            let payload = {
                id: 2
            }
          chai.request(app)
              .post('/planet')
              .send(payload)
              .end((err, res) => {
                try {
                    if (err) {
                    console.error('Request error:', err);
                    return done(err);
                    }
                    console.log('Testing planet:',res.body.name);
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(2);
                    res.body.should.have.property('name').eql('Venus');
                done();
              } catch (e) {
                done(e);
              }  
              });
        });

        it('it should fetch a planet named Earth', (done) => {
            let payload = {
                id: 3
            }
          chai.request(app)
              .post('/planet')
              .send(payload)
              .end((err, res) => {
                try {
                    if (err) {
                    console.error('Request error:', err);
                    return done(err);
                    }
                    console.log('Testing planet:',res.body.name);
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(3);
                    res.body.should.have.property('name').eql('Earth');
                done();
              }  catch (e) {
                done(e);
              }
              });
        });
        it('it should fetch a planet named Mars', (done) => {
            let payload = {
                id: 4
            }
          chai.request(app)
              .post('/planet')
              .send(payload)
              .end((err, res) => {
                try {
                    if (err) {
                    console.error('Request error:', err);
                    return done(err);
                    }
                    console.log('Testing planet:',res.body.name);
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(4);
                    res.body.should.have.property('name').eql('Mars');
                done();
                } catch (e) {
                  done(e);
                }
              });
        });

        it('it should fetch a planet named Jupiter', (done) => {
            let payload = {
                id: 5
            }
          chai.request(app)
              .post('/planet')
              .send(payload)
              .end((err, res) => {
              try {
                    if (err) {
                    console.error('Request error:', err);
                    return done(err);
                    }
                    console.log('Testing planet:',res.body.name);
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(5);
                    res.body.should.have.property('name').eql('Jupiter');
                done();
                } catch (e) {
                  done(e);
                }
              });
        });

        it('it should fetch a planet named Saturn', (done) => {
            let payload = {
                id: 6
            }
          chai.request(app)
              .post('/planet')
              .send(payload)
              .end((err, res) => {
                try {
                    if (err) {
                    console.error('Request error:', err);
                    return done(err);
                    }
                    console.log('Testing planet:',res.body.name);
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(6);
                    res.body.should.have.property('name').eql('Saturn');
                done();
                } catch (e) {
                  done(e);
                }
              });
        });

        it('it should fetch a planet named Uranus', (done) => {
            let payload = {
                id: 7
            }
          chai.request(app)
              .post('/planet')
              .send(payload)
              .end((err, res) => {
                try {
                    if (err) {
                    console.error('Request error:', err);
                    return done(err);
                    }
                    console.log('Testing planet:',res.body.name);
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(7);
                    res.body.should.have.property('name').eql('Uranus');
                done();
                } catch (e) {
                  done(e);
                }
              });
        });

        it('it should fetch a planet named Neptune', (done) => {
            let payload = {
                id: 8
            }
          chai.request(app)
              .post('/planet')
              .send(payload)
              .end((err, res) => {
                try {
                    if (err) {
                    console.error('Request error:', err);
                    return done(err);
                    }
                    console.log('Testing planet:',res.body.name);
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(8);
                    res.body.should.have.property('name').eql('Neptune');
                done();
                } catch (e) {
                  done(e);
                }
              });
        });
    });        
});

//Use below test case to achieve coverage
describe('Testing Other Endpoints', () => {

    describe('it should fetch OS Details', () => {
        it('it should fetch OS details', (done) => {
          chai.request(app)
              .get('/os')
              .end((err, res) => {
                try {
                    console.log("Responce for /os", res.body);
                    res.should.have.status(200);
                done();
                } catch (e) {
                  done(e);
                }
              });
        });
    });

    describe('it should fetch Live Status', () => {
        it('it checks Liveness endpoint', (done) => {
          chai.request(app)
              .get('/live')
              .end((err, res) => {
                try {
                    console.log("Responce for /live", res.body);
                    res.should.have.status(200);
                    res.body.should.have.property('status').eql('live');
                done();
                } catch (e) {
                  done(e);
                }
              });
        });
    });

    describe('it should fetch Ready Status', () => {
        it('it checks Readiness endpoint', (done) => {
          chai.request(app)
              .get('/ready')
              .end((err, res) => {
                try {
                console.log("Responce for /ready", res.body);
                    res.should.have.status(200);
                    res.body.should.have.property('status').eql('ready');
                done();
                } catch (e) {
                  done(e);
                }
              });
        });
    });
});