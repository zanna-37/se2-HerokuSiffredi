const db = require('../../../src/db');
const request = require('supertest');
const app = require('../../../src/app');

afterAll(() =>
    db.close()
);

const rightBody = {
    name: 'Miriam',
    surname: 'Punzi',
    student_number: 186574
};

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
                });
            });
    });

    test('Test if it retrieves the right type of attributes', () => {
        return request(app)
            .get(route)
            .then(response => {
                response.body.forEach(function (user) {
                    expect(typeof user.id).toBe('number');
                    expect(typeof user.name).toBe('string');
                    expect(typeof user.surname).toBe('string');
                    expect(typeof user.student_number).toBe('number');
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

    // Tests right body
    test('Test right body', () => exceptPostOK(rightBody));

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

describe('GET /v1/users/{id}', () => {
    let idTempUser;

    request(app)
        .post(route)
        .send({...rightBody})
        .then(result => {
            idTempUser = result.body.id;
            return idTempUser;
        });

    test('Test if it retrieves the right attributes', () => {
        return request(app)
            .get(route + '/' + idTempUser)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeInstanceOf(Object);
                expect(response.body).toHaveProperty('id');
                expect(response.body).toHaveProperty('name');
                expect(response.body).toHaveProperty('surname');
                expect(response.body).toHaveProperty('student_number');
            });
    });

    test('Test if it retrieves the right type of attributes', () => {
        return request(app)
            .get(route + '/' + idTempUser)
            .then(response => {
                expect(typeof response.body.id).toBe('number');
                expect(typeof response.body.name).toBe('string');
                expect(typeof response.body.surname).toBe('string');
                expect(typeof response.body.student_number).toBe('number');
            });
    });

    test('Test an invalid id', () => {
        return request(app)
            .get(route + '/' + -1)
            .then(response => {
                expect(response.statusCode).toBe(404);
                expect(response.body).toHaveProperty('code');
                expect(response.body).toHaveProperty('message');
            });
    });
});

describe('PUT /v1/users/{id}', () => {
    // temporary user for testing
    let idTempUser;

    // creation of a temporary user
    request(app)
        .post(route)
        .send({...rightBody})
        .then(result => {
            idTempUser = result.body.id;
            return idTempUser;
        });

    const expectPutBadRequest = body => {
        return request(app)
            .put(route + '/' + idTempUser)
            .send(body)
            .then(res => {
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty('code');
                expect(res.body).toHaveProperty('message');
            });
    };

    const expectPutNotFound = body => {
        return request(app)
            .put(route + '/-1')
            .send(body)
            .then(res => {
                expect(res.status).toBe(404);
                expect(res.body).toHaveProperty('code');
                expect(res.body).toHaveProperty('message');
            });
    };

    const exceptPutOK = body => {
        return request(app)
            .put(route + '/' + idTempUser)
            .send(body)
            .then(res => {
                expect(res.status).toBe(204);
            });
    };

    // Tests right body
    test('Test right body', () => exceptPutOK({...rightBody, id: idTempUser}));

    // Test body missing parameters
    test('Test id undefined', () => expectPutBadRequest(rightBody));
    test('Test name undefined', () => expectPutBadRequest({...rightBody, name: undefined, id: idTempUser}));
    test('Test surname undefined', () => expectPutBadRequest({...rightBody, surname: undefined, id: idTempUser}));
    test('Test student number undefined', () => expectPutBadRequest({
        ...rightBody,
        student_number: undefined,
        id: idTempUser
    }));

    // Test body with invalid parameters
    test('Test body with average in json', () => expectPutBadRequest({...rightBody, average: 18, id: idTempUser}));
    test('Test body with strange parameters', () => expectPutBadRequest({
        ...rightBody,
        birth: '08/04/1997',
        id: idTempUser
    }));

    // Test body missing values of parameters
    test('Test id null', () => expectPutBadRequest({...rightBody, id: null}));
    test('Test name null', () => expectPutBadRequest({...rightBody, name: null, id: idTempUser}));
    test('Test surname null', () => expectPutBadRequest({...rightBody, surname: null, id: idTempUser}));
    test('Test student number null', () => expectPutBadRequest({...rightBody, student_number: null, id: idTempUser}));

    // Test body with invalid values
    test('Test id is not number', () => expectPutBadRequest({...rightBody, id: 'hello'}));
    test('Test name is not string', () => expectPutBadRequest({...rightBody, name: 1, id: idTempUser}));
    test('Test surname is not string', () => expectPutBadRequest({...rightBody, surname: 1, id: idTempUser}));
    test('Test student number is not number', () => expectPutBadRequest({
        ...rightBody,
        student_number: 'hello',
        id: idTempUser
    }));
    test('Test student number < 0', () => expectPutBadRequest({...rightBody, student_number: -12, id: idTempUser}));
    test('Test student number = 0', () => expectPutBadRequest({...rightBody, student_number: 0, id: idTempUser}));

    // Test id in body different from id in route
    test('Test id is different from id in route', () => expectPutBadRequest({...rightBody, id: -1}));

    // Test an id not in db
    test('Test id not in db', () => expectPutNotFound({...rightBody, id: -1}));
});

describe('DELETE /v1/users/{id}', () => {
    // temporary user for testing
    let idTempUser;

    // creation of a temporary user
    request(app)
        .post(route)
        .send({...rightBody})
        .then(result => {
            idTempUser = result.body.id;
            return idTempUser;
        });

    const expectDeleteBadRequest = body => {
        return request(app)
            .delete(route + '/' + idTempUser)
            .send(body)
            .then(res => {
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty('code');
                expect(res.body).toHaveProperty('message');
            });
    };

    const expectDeleteNotFound = body => {
        return request(app)
            .delete(route + '/' + idTempUser)
            .send(body)
            .then(res => {
                expect(res.status).toBe(404);
                expect(res.body).toHaveProperty('code');
                expect(res.body).toHaveProperty('message');
            });
    };

    const expectDeleteOK = body => {
        return request(app)
            .delete(route + '/' + idTempUser)
            .send(body)
            .then(res => {
                expect(res.status).toBe(204);
                expect(res.body).toHaveProperty('code');
                expect(res.body).toHaveProperty('message');
            });
    };

    test('Test id in body different from id in route', () => expectDeleteBadRequest({id: -1}));
    test('Test id in db', () => expectDeleteOK({id: idTempUser}));
    test('Test id NOT in db', () => expectDeleteNotFound({id: idTempUser}));
});
