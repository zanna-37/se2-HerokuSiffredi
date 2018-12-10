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
        const tmp = await postOk(demoTask);
        model_tasks.destroy({
            where: {
                id: tmp
            }
        });

    });

    test('exerciseText is undefined', async () => postError({...demoTask, exerciseText: undefined}));
    test('rightAnswer is undefined', async () => postError({...demoTask, rightAnswer: undefined}));
    test('totalPoints is undefined', async () => postError({...demoTask, totalPoints: undefined}));
    test('categoryIDs is undefined', async () => postError({...demoTask, categoryIDs: undefined}));

    test('exerciseText is null', async () => postError({...demoTask, exerciseText: null}));
    test('rightAnswer is null', async () => postError({...demoTask, rightAnswer: null}));
    test('totalPoints is null', async () => postError({...demoTask, totalPoints: null}));
    test('categoryIDs is null', async () => postError({...demoTask, categoryIDs: null}));

    test('exceeding parameters', async () => postError({...demoTask, oneMore: true}));

    test('exerciseText value is not valid', async () => postError({...demoTask, exerciseText: 10}));
    test('rightAnswer value is not valid', async () => postError({...demoTask, rightAnswer: 10}));
    test('totalPoints value is not valid', async () => postError({...demoTask, totalPoints: 'wrong'}));
    test('categoryIDs is not an array', async () => postError({...demoTask, categoryIDs: 10}));
    test('zero-length categoryIDs', async () => postError({...demoTask, categoryIDs: []}));
    test('categoryIDs has some values which are not numbers', async () => postError({
        ...demoTask,
        categoryIDs: [1, 'wrong', 3]
    }));
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

describe(`PUT ${route}/:id`, () => {
    const putIdError = (body, id) => {
        expect.assertions(2);
        return request(app)
            .put(route + '/' + id)
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

    test('update successful', async () => {
        const tmp = await model_tasks.create(demoTask);
        const tmp1 = {...(tmp.dataValues), exerciseText: 'new text'};
        expect.assertions(2);
        await request(app)
            .put(route + '/' + tmp.id)
            .send(tmp1)
            .then(res => {
                expect(res.statusCode).toBe(204);
                expect(res.body).toEqual({});
            });
        await model_tasks.destroy({
            where: {
                id: tmp1.id
            }
        });
    });

    // missing parameters
    test('ID is undefined', async () => {
        const tmp = await model_tasks.create(demoTask);
        const tmp1 = {...(tmp.dataValues), id: undefined};
        await putIdError(tmp1, tmp.id);
        await model_tasks.destroy({
            where: {
                id: tmp.id
            }
        });
    });
    test('exerciseText is undefined', async () => {
        const tmp = await model_tasks.create(demoTask);
        const tmp1 = {...(tmp.dataValues), exerciseText: undefined};
        await putIdError(tmp1, tmp.id);
        await model_tasks.destroy({
            where: {
                id: tmp1.id
            }
        });
    });
    test('rightAnswer is undefined', async () => {
        const tmp = await model_tasks.create(demoTask);
        const tmp1 = {...(tmp.dataValues), rightAnswer: undefined};
        await putIdError(tmp1, tmp.id);
        await model_tasks.destroy({
            where: {
                id: tmp1.id
            }
        });
    });
    test('totalPoints is undefined', async () => {
        const tmp = await model_tasks.create(demoTask);
        const tmp1 = {...(tmp.dataValues), totalPoints: undefined};
        await putIdError(tmp1, tmp.id);
        await model_tasks.destroy({
            where: {
                id: tmp1.id
            }
        });
    });
    test('categoryIDs is undefined', async () => {
        const tmp = await model_tasks.create(demoTask);
        const tmp1 = {...(tmp.dataValues), categoryIDs: undefined};
        await putIdError(tmp1, tmp.id);
        await model_tasks.destroy({
            where: {
                id: tmp1.id
            }
        });
    });

    test('exceeding parameter', async () => {
        const tmp = await model_tasks.create(demoTask);
        const tmp1 = {...(tmp.dataValues), oneMore: true};
        await putIdError(tmp1, tmp.id);
        await model_tasks.destroy({
            where: {
                id: tmp1.id
            }
        });
    });

    // null parameters
    test('ID is null', async () => {
        const tmp = await model_tasks.create(demoTask);
        const tmp1 = {...(tmp.dataValues), id: null};
        await putIdError(tmp1, tmp.id);
        await model_tasks.destroy({
            where: {
                id: tmp.id
            }
        });
    });
    test('exerciseText is null', async () => {
        const tmp = await model_tasks.create(demoTask);
        const tmp1 = {...(tmp.dataValues), exerciseText: null};
        await putIdError(tmp1, tmp.id);
        await model_tasks.destroy({
            where: {
                id: tmp1.id
            }
        });
    });
    test('rightAnswer is null', async () => {
        const tmp = await model_tasks.create(demoTask);
        const tmp1 = {...(tmp.dataValues), rightAnswer: null};
        await putIdError(tmp1, tmp.id);
        await model_tasks.destroy({
            where: {
                id: tmp1.id
            }
        });
    });
    test('totalPoints is null', async () => {
        const tmp = await model_tasks.create(demoTask);
        const tmp1 = {...(tmp.dataValues), totalPoints: null};
        await putIdError(tmp1, tmp.id);
        await model_tasks.destroy({
            where: {
                id: tmp1.id
            }
        });
    });
    test('categoryIDs is null', async () => {
        const tmp = await model_tasks.create(demoTask);
        const tmp1 = {...(tmp.dataValues), categoryIDs: null};
        await putIdError(tmp1, tmp.id);
        await model_tasks.destroy({
            where: {
                id: tmp1.id
            }
        });
    });

    // wrong type parameters
    test('ID is not an integer', async () => {
        const tmp = await model_tasks.create(demoTask);
        const tmp1 = {...(tmp.dataValues), id: 'wrong'};
        await putIdError(tmp1, tmp.id);
        await model_tasks.destroy({
            where: {
                id: tmp.id
            }
        });
    });
    test('exerciseText is not a string', async () => {
        const tmp = await model_tasks.create(demoTask);
        const tmp1 = {...(tmp.dataValues), exerciseText: 10};
        await putIdError(tmp1, tmp.id);
        await model_tasks.destroy({
            where: {
                id: tmp1.id
            }
        });
    });
    test('rightAnswer is not a string', async () => {
        const tmp = await model_tasks.create(demoTask);
        const tmp1 = {...(tmp.dataValues), rightAnswer: 10};
        await putIdError(tmp1, tmp.id);
        await model_tasks.destroy({
            where: {
                id: tmp1.id
            }
        });
    });
    test('totalPoints is not a number', async () => {
        const tmp = await model_tasks.create(demoTask);
        const tmp1 = {...(tmp.dataValues), totalPoints: 'wrong'};
        await putIdError(tmp1, tmp.id);
        await model_tasks.destroy({
            where: {
                id: tmp1.id
            }
        });
    });
    test('categoryIDs is not an array', async () => {
        const tmp = await model_tasks.create(demoTask);
        const tmp1 = {...(tmp.dataValues), categoryIDs: 'wrong'};
        await putIdError(tmp1, tmp.id);
        await model_tasks.destroy({
            where: {
                id: tmp1.id
            }
        });
    });
    test('categoryIDs is empty', async () => {
        const tmp = await model_tasks.create(demoTask);
        const tmp1 = {...(tmp.dataValues), categoryIDs: []};
        await putIdError(tmp1, tmp.id);
        await model_tasks.destroy({
            where: {
                id: tmp1.id
            }
        });
    });
    test('categoryIDs has some values that are not integers', async () => {
        const tmp = await model_tasks.create(demoTask);
        const tmp1 = {...(tmp.dataValues), categoryIDs: [1,2,'wrong',4]};
        await putIdError(tmp1, tmp.id);
        await model_tasks.destroy({
            where: {
                id: tmp1.id
            }
        });
    });

    test('url ID and the one in parameters are different', async () => {
        const tmp = await model_tasks.create(demoTask);
        const tmp1 = {...(tmp.dataValues), exerciseText: 'new exerciseText'};
        await putIdError(tmp1, -1);
        await model_tasks.destroy({
            where: {
                id: tmp1.id
            }
        });
    });

    test('not valid url ID', async () => {
        const tmp = await model_tasks.create(demoTask);
        const tmp1 = {...(tmp.dataValues), exerciseText: 'new text'};
        await putIdError(tmp1, 'wrong');
        await model_tasks.destroy({
            where: {
                id: tmp1.id
            }
        });
    });

    test('ID not found', async () => {
        expect.assertions(2);
        await request(app)
            .put(route + '/' + 0)
            .send({...demoTask, id: 0})
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