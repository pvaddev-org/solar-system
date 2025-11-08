let mongoose = require("mongoose");
let app = require("./app");
let chai = require("chai");
let chaiHttp = require("chai-http");


// Assertion 
chai.should();
chai.use(chaiHttp); 


before(async function () {
  // increase timeout for slower DB startup
  this.timeout(10000);

  // connect to test DB (you can use your existing URI or a test-specific one)
  const uri = "mongodb+srv://superuser:SuperPassword@supercluster.d83jj.mongodb.net/superData";

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB for tests");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB", err);
    throw err;
  }
});

after(async () => {
  await mongoose.connection.close();
  console.log("🔌 MongoDB connection closed after tests");
});
// ------------------------------------------

describe('Planets API Suite', () => {

    describe('Fetching Planet Details', () => {
        it('it should fetch a planet named Mercury', (done) => {
            let payload = {
                id: 1
            }
            console.log('Testing planet:', payload.id);
          chai.request(app)
              .post('/planet')
              .send(payload)
              .end((err, res) => {
                    if (err) {
                        console.error('Request error:', err);
                    } else {
                        console.log('Full response for Mercury:', res.body);
                    }

                    // Check the response is actually an object
                    if (!res.body || typeof res.body !== 'object') {
                        return done(new Error('Response body is invalid or empty'));
                    }
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(1);
                    res.body.should.have.property('name').eql('Mercury');
                done();
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
                    if (err) {
                        console.error('Request error:', err);
                    } else {
                        console.log('Full response for Mercury:', res.body);
                    }

                    // Check the response is actually an object
                    if (!res.body || typeof res.body !== 'object') {
                        return done(new Error('Response body is invalid or empty'));
                    }
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(2);
                    res.body.should.have.property('name').eql('Venus');
                done();
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
                    if (err) {
                        console.error('Request error:', err);
                    } else {
                        console.log('Full response for Mercury:', res.body);
                    }

                    // Check the response is actually an object
                    if (!res.body || typeof res.body !== 'object') {
                        return done(new Error('Response body is invalid or empty'));
                    }
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(3);
                    res.body.should.have.property('name').eql('Earth');
                done();
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
                    if (err) {
                        console.error('Request error:', err);
                    } else {
                        console.log('Full response for Mercury:', res.body);
                    }

                    // Check the response is actually an object
                    if (!res.body || typeof res.body !== 'object') {
                        return done(new Error('Response body is invalid or empty'));
                    }
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(4);
                    res.body.should.have.property('name').eql('Mars');
                done();
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
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(5);
                    res.body.should.have.property('name').eql('Jupiter');
                done();
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
                    if (err) {
                        console.error('Request error:', err);
                    } else {
                        console.log('Full response for Mercury:', res.body);
                    }

                    // Check the response is actually an object
                    if (!res.body || typeof res.body !== 'object') {
                        return done(new Error('Response body is invalid or empty'));
                    }
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(6);
                    res.body.should.have.property('name').eql('Saturn');
                done();
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
                    if (err) {
                        console.error('Request error:', err);
                    } else {
                        console.log('Full response for Mercury:', res.body);
                    }

                    // Check the response is actually an object
                    if (!res.body || typeof res.body !== 'object') {
                        return done(new Error('Response body is invalid or empty'));
                    }
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(7);
                    res.body.should.have.property('name').eql('Uranus');
                done();
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
                    if (err) {
                        console.error('Request error:', err);
                    } else {
                        console.log('Full response for Mercury:', res.body);
                    }

                    // Check the response is actually an object
                    if (!res.body || typeof res.body !== 'object') {
                        return done(new Error('Response body is invalid or empty'));
                    }
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(8);
                    res.body.should.have.property('name').eql('Neptune');
                done();
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
                    res.should.have.status(200);
                done();
              });
        });
    });

    describe('it should fetch Live Status', () => {
        it('it checks Liveness endpoint', (done) => {
          chai.request(app)
              .get('/live')
              .end((err, res) => {
                    console.log("Responce for /live", res.body);
                    res.should.have.status(200);
                    res.body.should.have.property('status').eql('live');
                done();
              });
        });
    });

    describe('it should fetch Ready Status', () => {
        it('it checks Readiness endpoint', (done) => {
          chai.request(app)
              .get('/ready')
              .end((err, res) => {
                console.log("Responce for /ready", res.body);
                    res.should.have.status(200);
                    res.body.should.have.property('status').eql('ready');
                done();
              });
        });
    });
});