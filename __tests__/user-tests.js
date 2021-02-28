const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const { expect } = chai;
const app = require('../app'); // the express server
const mongoose = require('mongoose')

chai.use(chaiHttp);

let token;

describe ('/users tests', () => {

    // SETUP
    const signup = '/users/signup';
    const login = '/users/login';

    const user = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
    };
    const preSave = {
        username: 'testusername',
        password: faker.internet.password(),
    };

    beforeAll(async () => {
        const result = await chai
            .request(app)
            .post(signup)
            .send(preSave);
        expect(result.status).to.equal(200);
        token = result.body.token;
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    // TEST /users/signup
    describe('signup', () => {
        it('should register a new user if username is unique', async () => {
            try {
                const result = await chai
                    .request(app)
                    .post(signup)
                    .send(user);
                expect(result.status).to.equal(200);
                expect(result.body).not.to.be.empty;
                expect(result.body).to.have.property('token');
            } catch (error) {
                console.log(error);
            }
        });

        it('should return 400 if user already exists', async () => {
            try {
                await chai
                    .request(app)
                    .post(signup)
                    .send(preSave);
            } catch (error) {
                expect(error.status).to.equal(400);
                expect(error.response.json).to.equal({msg: "Username in use"});
            }
        });
    });


    // TEST /users/login
    describe('login', () => {
        it('should return error 400 if user email and password empty', async () => {
            let user = {};
            try {
                await chai
                    .request(app)
                    .post(login)
                    .send(user);
            } catch (error) {
                expect(error.status).to.be.equal(400);
            }
        });

        it('should return 200 and token', async () => {
            try {
                const result = await chai
                    .request(app)
                    .post(login)
                    .send(preSave);

                expect(result.status).to.be.equal(200);
                expect(result.body).not.to.be.empty;
                expect(result.body).to.have.property('token');
            } catch (error) {
                throw new Error(error);
            }
        });
    });

})