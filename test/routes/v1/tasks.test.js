const db = require('../../../src/db');
const request = require('supertest');
const app = require('../../../src/app');
const model_tasks = require('../../../src/models/v1/tasks');

afterAll(() => db.close());

const route = '/v1/tasks';

let demoTask = {
    'exerciseText': 'demoText',
    'rightAnswer': 'demoAnswer',
    'totalPoints': 1,
    'average': 1,
    'categoryIDs': [1,2,3]
};

describe(`GET ${route}`, () => {
    test('right attributes', async () => {
        const tmp1 = await model_tasks.create(demoTask);
        const tmp2 = await model_tasks.create(demoTask);

        await request(app)
            .get(route)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeInstanceOf(Array);
                response.body.forEach( task => {
                    expect(task).toEqual({
                        id: expect.any(Number),
                        exerciseText: expect.any(String),
                        rightAnswer: expect.any(String),
                        totalPoints: expect.any(Number),
                        average: expect.any(Number),
                        categoryIDs: expect.arrayContaining([expect.any(Number)])
                    });
                });
            });

        tmp1.destroy();
        tmp2.destroy();
    });
});

describe(`GET ${route}/:id`, () => {
    test('passed ID is valid', async () => {
        const tmp = await model_tasks.create(demoTask);
        expect.assertions(2);
        await request(app)
            .get(route + '/' + tmp.id)
            .then(res => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toEqual(
                    {
                        id: expect.any(Number),
                        exerciseText: expect.any(String),
                        rightAnswer: expect.any(String),
                        totalPoints: expect.any(Number),
                        average: expect.any(Number),
                        categoryIDs: expect.arrayContaining([expect.any(Number)])
                    }
                );
            });
        tmp.destroy();
    });

    test('passed ID is not valid', async () => {
        const wrongID = 'hi';
        expect.assertions(2);
        await request(app)
            .get(route + '/' + wrongID)
            .then(res => {
                expect(res.statusCode).toBe(400);
                expect(res.body).toEqual(
                    {
                        code: expect.any(Number),
                        message: expect.any(String)
                    }
                );
            });
    });

    test('passed ID is empty', async () => {
        let emptyID;
        expect.assertions(2);
        await request(app)
            .get(route + '/' + emptyID)
            .then(res => {
                expect(res.statusCode).toBe(400);
                expect(res.body).toEqual(
                    {
                        code: expect.any(Number),
                        message: expect.any(String)
                    }
                );
            });
    });

    test('passed ID is null', async () => {
        const nullID = null;
        expect.assertions(2);
        await request(app)
            .get(route + '/' + nullID)
            .then(res => {
                expect(res.statusCode).toBe(400);
                expect(res.body).toEqual(
                    {
                        code: expect.any(Number),
                        message: expect.any(String)
                    }
                );
            });
    });

    test('passed ID not found', async () => {
        const nowhereID = 0;
        expect.assertions(2);
        await request(app)
            .get(route + '/' + nowhereID)
            .then(res => {
                expect(res.statusCode).toBe(404);
                expect(res.body).toEqual(
                    {
                        code: expect.any(Number),
                        message: expect.any(String)
                    }
                );
            });
    });
});