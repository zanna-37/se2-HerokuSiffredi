const db = require('../../../src/db');
const request = require('supertest');
const app = require('../../../src/app');

afterAll(() => db.close());

const route = '/v1/users';

describe('GET /v1/users', () => {
    test('Test if it retrieves all the right attributes', () => {
        return request(app)
            .get(route)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeInstanceOf(Array);
                response.body.forEach(function (user) {
                    expect(user).toHaveProperty('id');
                    expect(user).toHaveProperty('name');
                    expect(user).toHaveProperty('surname');
                    expect(user).toHaveProperty('student_number');
                    expect(user).toHaveProperty('average');
                });
            });
    });
});

describe('POST /v1/users', () => {
    // Functions that send a post request
    const expectPostError = body => {
        return request(app)
            .post(route)
            .send(body)
            .then(res => {
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty('code');
                expect(res.body).toHaveProperty('message');
            });
    };

    const exceptPostOK = body => {
        return request(app)
            .post(route)
            .send(body)
            .then(res => {
                expect(res.status).toBe(201);
                expect(res.body).toHaveProperty('id');
            });
    };

    // json for a successful post
    const rightBody = {
        name: 'Miriam',
        surname: 'Punzi',
        student_number: 186574
    };

    // Tests right body
    test('Test right body', () => exceptPostOK(rightBody));

    // Test wrong body
    test('Test empty body', () => expectPostError(null));
    test('Test body without json', () => expectPostError({}));

    // Test body missing parameters
    test('Test name undefined', () => expectPostError({...rightBody, name: undefined}));
    test('Test surname undefined', () => expectPostError({...rightBody, surname: undefined}));
    test('Test student number undefined', () => expectPostError({...rightBody, student_number: undefined}));

    // Test body with invalid parameters
    test('Test body with average in json', () => expectPostError({...rightBody, average: 18}));
    test('Test body with strange parameters', () => expectPostError({...rightBody, birth: '08/04/1997'}));

    // Test body missing values of parameters
    test('Test name null', () => expectPostError({...rightBody, name: null}));
    test('Test surname null', () => expectPostError({...rightBody, surname: null}));
    test('Test student number null', () => expectPostError({...rightBody, student_number: null}));

    // Test body with invalid values
    test('Test name is not string', () => expectPostError({...rightBody, name: 1}));
    test('Test surname is not string', () => expectPostError({...rightBody, surname: 1}));
    test('Test student number is not number', () => expectPostError({...rightBody, student_number: 'hello'}));
    test('Test student number < 0', () => expectPostError({...rightBody, student_number: -12}));
    test('Test student number = 0', () => expectPostError({...rightBody, student_number: 0}));
});