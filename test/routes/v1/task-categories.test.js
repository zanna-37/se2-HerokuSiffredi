const db = require('../../../src/db');
const request = require('supertest');
const app = require('../../../src/app');

afterAll(() => db.close());

const route = '/v1/task-categories';

describe(`GET ${route}`, () => {
    test('plain', async () => {
        await request(app).get(route).then(response => {
            expect(response.statusCode).toBe(200);
            response.body.forEach(function (task_category) {
                expect(task_category).toHaveProperty('id');
                expect(task_category).toHaveProperty('name');
            });
        });
    });
});

describe(`GET ${route}/:id`, () => {

    const expectGetIdOk = id => {
        expect.assertions(2);
        return request(app)
            .get(route + '/' + id)
            .then(res => {
                expect.assertions(3);
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('id');
                expect(res.body).toHaveProperty('name');
            });
    };

    const expectGetIdError = id => {
        expect.assertions(2);
        return request(app)
            .get(route + '/' + id)
            .then(res => {
                expect.assertions(3);
                expect(res.statusCode).toBe(400);
                expect(res.body).toHaveProperty('code');
                expect(res.body).toHaveProperty('message');
            });
    };

    const expectGetIdNotFuond = id => {
        expect.assertions(2);
        return request(app)
            .get(route + '/' + id)
            .then(res => {
                expect.assertions(3);
                expect(res.statusCode).toBe(404);
                expect(res.body).toHaveProperty('code');
                expect(res.body).toHaveProperty('message');
            });
    };

    test('valid id', () => {
        return expectGetIdOk('1');
    });

    test('invalid id', () => {
        return expectGetIdError('ae1');
    });
    test('empty id', () => {
        return expectGetIdError();
    });
    test('null id', () => {
        return expectGetIdError(null);
    });

    test('id not present', () => {
        return expectGetIdNotFuond('-1');
    });
});

describe(`POST ${route}`, () => {
    const correct_body = {
        name: 'testCategory'
    };
    const wrong_body_empty = {};
    const wrong_body_undefined = undefined;
    const wrong_body_param_null = {
        name: null
    };

    const expectPostError = body => {
        expect.assertions(2);
        return request(app)
            .post(route)
            .send(body)
            .then(res => {
                expect(res.status).toBe(400);
                expect(res.body).toEqual(expect.objectContaining(
                    {
                        code: expect.any(Number),
                        message: expect.any(String)
                    }
                ));
            });
    };

    const expectPostOk = body => {
        expect.assertions(2);
        return request(app)
            .post(route)
            .send(body)
            .then(res => {
                expect(res.statusCode).toBe(201);
                expect(res.body).toEqual(expect.objectContaining({id: expect.any(Number)}));
            });
    };

    test('correct parameter', () => {
        return expectPostOk(correct_body);
    });

    test('no body', () => {
        return expectPostError();
    });
    test('empty body', () => {
        return expectPostError(wrong_body_empty);
    });
    test('undefined body', () => {
        return expectPostError(wrong_body_undefined);
    });
    test('name=null', () => {
        return expectPostError(wrong_body_param_null);
    });
});
