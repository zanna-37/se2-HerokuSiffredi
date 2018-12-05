const db = require('../../../src/db');
const request = require('supertest');
const app = require('../../../src/app');
const model_task_categories = require('../../../src/models/v1/task-categories');

afterAll(() => db.close());

const route = '/v1/task-categories';

describe(`GET ${route}`, () => {
    test('plain', async () => {
        const element1 = await model_task_categories.create({'name': 'test_get_1'}).then((new_task_category) => new_task_category);
        const element2 = await model_task_categories.create({'name': 'test_get_2'}).then((new_task_category) => new_task_category);

        await request(app).get(route).then(response => {
            expect(response.statusCode).toBe(200);
            response.body.forEach(function (task_category) {
                expect(task_category).toEqual(
                    {
                        id: expect.any(Number),
                        name: expect.any(String)
                    }
                );
            });
        });

        element1.destroy();
        element2.destroy();
    });
});

describe(`GET ${route}/:id`, () => {
    const expectGetIdOk = id => {
        expect.assertions(2);
        return request(app)
            .get(route + '/' + id)
            .then(res => {
                expect.assertions(2);
                expect(res.statusCode).toBe(200);
                expect(res.body).toEqual(
                    {
                        id: expect.any(Number),
                        name: expect.any(String)
                    }
                );
            });
    };

    const expectGetIdError = id => {
        expect.assertions(2);
        return request(app)
            .get(route + '/' + id)
            .then(res => {
                expect.assertions(2);
                expect(res.statusCode).toBe(400);
                expect(res.body).toEqual(
                    {
                        code: expect.any(Number),
                        message: expect.any(String)
                    }
                );
            });
    };

    const expectGetIdNotFound = id => {
        expect.assertions(2);
        return request(app)
            .get(route + '/' + id)
            .then(res => {
                expect(res.statusCode).toBe(404);
                expect(res.body).toEqual(
                    {
                        code: expect.any(Number),
                        message: expect.any(String)
                    }
                );
            });
    };

    test('valid id', async () => {
        const element1 = await model_task_categories.create({'name': 'test_getId_1'}).then((new_task_category) => new_task_category);
        await expectGetIdOk(element1.id);
        element1.destroy();
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
        return expectGetIdNotFound('-1');
    });
});

describe(`POST ${route}`, () => {
    const correct_body = {
        name: 'test_post_1'
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
                expect(res.body).toEqual(
                    {
                        code: expect.any(Number),
                        message: expect.any(String)
                    }
                );
            });
    };

    const expectPostOk = async body => {
        expect.assertions(2);
        return await request(app)
            .post(route)
            .send(body)
            .then(async res => {
                await expect(res.statusCode).toBe(201);
                await expect(res.body).toEqual({id: expect.any(Number)});
                return res.body.id;
            });
    };

    test('correct parameter', async () => {
        const id_to_delete = await expectPostOk(correct_body);
        model_task_categories.destroy({
            where: {
                id: id_to_delete
            }
        });
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
