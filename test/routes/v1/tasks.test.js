const db = require('../../../src/db');
const request = require('supertest');
const app = require('../../../src/app');
const model_tasks = require('../../../src/models/v1/tasks');

afterAll(() => db.close());

const route = '/v1/tasks';

const demoTask = {
    exerciseText: 'demoText',
    rightAnswer: 'demoAnswer',
    totalPoints: 1,
    average: 1,
    categoryIDs: [1, 2, 3]
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
                response.body.forEach(task => {
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

describe(`POST ${route}`, () => {
    const newTask = {...demoTask, average: undefined};

    const postOk = body => {
        expect.assertions(2);
        return request(app)
            .post(route)
            .send(body)
            .then(res => {
                expect(res.statusCode).toBe(201);
                expect(res.body).toEqual({id: expect.any(Number)});
                return res.body.id;
            });
    };

    const postError = body => {
        expect.assertions(2);
        return request(app)
            .post(route)
            .send(body)
            .then(res => {
                expect(res.status).toBe(400);
                expect(res.body).toEqual(
                    {
                        code: expect.any(Number),
                        message: expect.any(String)
                    }
                );
            });
    };

    test('valid parameters', async () => {
        const tmp = await postOk(newTask);
        model_tasks.destroy({
            where: {
                id: tmp
            }
        });

    });

    test('exerciseText is undefined', async () => postError({...newTask, exerciseText: undefined}));
    test('rightAnswer is undefined', async () => postError({...newTask, rightAnswer: undefined}));
    test('totalPoints is undefined', async () => postError({...newTask, totalPoints: undefined}));
    test('categoryIDs is undefined', async () => postError({...newTask, categoryIDs: undefined}));

    test('exerciseText is null', async () => postError({...newTask, exerciseText: null}));
    test('rightAnswer is null', async () => postError({...newTask, rightAnswer: null}));
    test('totalPoints is null', async () => postError({...newTask, totalPoints: null}));
    test('categoryIDs is null', async () => postError({...newTask, categoryIDs: null}));

    test('setting average on creation', async () => postError({...newTask, average: 10}));
    test('exceeding parameters', async () => postError({...newTask, oneMore: true}));

    test('exerciseText value is not valid', async () => postError({...newTask, exerciseText: 10}));
    test('rightAnswer value is not valid', async () => postError({...newTask, rightAnswer: 10}));
    test('totalPoints value is not valid', async () => postError({...newTask, totalPoints: 'wrong'}));
    test('categoryIDs is not an array', async () => postError({...newTask, categoryIDs: 10}));
    test('zero-length categoryIDs', async () => postError({...newTask, categoryIDs: []}));
    test('categoryIDs has some values which are not numbers', async () => postError({...newTask, categoryIDs: [1,'wrong',3]}));
});

describe(`POST ${route}/:id`, () => {
    test('Method not allowed', async () => {
        const randID = Math.round(Math.random() * 100);
        expect.assertions(2);
        await request(app)
            .post(route + '/' + randID)
            .then(res => {
                expect(res.status).toBe(405);
                expect(res.body).toEqual(
                    {
                        code: expect.any(Number),
                        message: expect.any(String)
                    }
                );
            });
    });
});