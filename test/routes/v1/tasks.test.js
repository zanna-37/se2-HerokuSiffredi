const db = require('../../../src/db');
const request = require('supertest');
const app = require('../../../src/app');

afterAll(() => db.close());

const route = '/v1/tasks';

describe(`GET ${route}`, () => {
    test('check attributes', () => {
        return request(app)
            .get(route)
            .then(response => {
                expect(response.statusCode).toBe(200);
                response.body.forEach((task) => {
                    expect(task).toEqual(
                        {
                            id: expect.any(Number),
                            exerciseText: expect.any(String),
                            rightAnswer: expect.any(String),
                            totalPoints: expect.any(Number),
                            average: expect.any(Number),
                            categoryIDs: expect.any(Array(expect.any(Number)))
                        });
                });
            });
    });
});