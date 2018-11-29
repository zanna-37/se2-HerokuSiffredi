const db = require('../../../src/db');
const request = require('supertest');
const app = require('../../../src/app');

afterAll(() => db.close());

describe('v1_get', () => {
    test('response to have id and name', async () => {
        await request(app).get('/v1/task-categories').then(response => {
            expect(response.statusCode).toBe(200);
            response.body.forEach(function (task_category) {
                expect(task_category).toHaveProperty('id');
                expect(task_category).toHaveProperty('name');
            });
        });
    });
});

describe('v1_post', () => {
    test('empty body', async () => {
        expect.assertions(3);
        await request(app).post('/v1/task-categories').then(response => {
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('code');
            expect(response.body).toHaveProperty('message');
        });
    });

    test('wrong parameters', async () => {
        expect.assertions(3);
        await request(app).post('/v1/task-categories').send({foo: 'bla bla bla'}).then(response => {
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('code');
            expect(response.body).toHaveProperty('message');
        });
    });

    test('right parameter', async () => {
        expect.assertions(2);
        await request(app).post('/v1/task-categories').send({name: 'testCategory'}).then(response => {
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('id');
        });
    });
});
