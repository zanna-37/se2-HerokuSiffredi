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
