const db = require('../../../src/db');
const request = require('supertest');
const app = require('../../../src/app');
const model_task_categories = require('../../../src/models/v1/task-categories');

afterAll(() => db.close());

const route = '/v1/task-categories';

describe(`GET ${route}`, () => {
    test('plain', async () => {
        const element1 = await model_task_categories.create({'name': 'test_get_1'});
        const element2 = await model_task_categories.create({'name': 'test_get_2'});

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
        const element1 = await model_task_categories.create({'name': 'test_getId_1'});
        await expectGetIdOk(element1.id);
        element1.destroy();
    });

    test('invalid id', () => {
        return expectGetIdError('wrong Id (as a string)');
    });
    test('empty id', () => {
        return expectGetIdError();
    });
    test('null id', () => {
        return expectGetIdError(null);
    });

    test('id not present', () => {
        return expectGetIdNotFound(-1);
    });
});

describe(`POST ${route}`, () => {

    const expectPostError = id => {
        expect.assertions(2);
        return request(app)
            .post(route + '/' + id)
            .then(res => {
                expect(res.status).toBe(405);
                expect(res.body).toEqual(
                    {
                        code: expect.any(Number),
                        message: expect.any(String)
                    }
                );
            });
    };
    test('wrong param', () => {
        return expectPostError(1);
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
    const wrong_body_param = {
        wrong_parameter: 'im wrong'
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

    const expectPostOk = body => {
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
    test('wrong param', () => {
        return expectPostError(wrong_body_param);
    });
});

describe(`PUT ${route}/:id`, () => {

    const expectPutIdOkWithUpdatedId = (body, id) => {
        expect.assertions(2);
        return request(app)
            .put(route + '/' + id)
            .send(body)
            .then(res => {
                expect(res.statusCode).toBe(204);
                expect(res.body).toEqual({});
            });
    };

    const expectPutIdNotFound = (body, id) => {
        expect.assertions(2);
        return request(app)
            .put(route + '/' + id)
            .send(body)
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

    const expectPutIdError = (body, id) => {
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

    test('correct update', async () => {
        const elementOLD = await model_task_categories.create({name: 'test_putId_1_OLD'});
        const elementNEW = {...(elementOLD.dataValues), name: 'test_putId_1_NEW'};
        await expectPutIdOkWithUpdatedId(elementNEW, elementOLD.id);
        await model_task_categories.destroy({
            where: {
                id: elementNEW.id
            }
        });
    });
    test('not existing id', async () => {
        const elementOLD = await model_task_categories.create({name: 'test_putId_2_OLD'});
        const elementNEW = {...(elementOLD.dataValues), name: 'test_putId_2_NEW'};
        await expectPutIdNotFound(elementNEW, -1);
        await model_task_categories.destroy({
            where: {
                id: elementNEW.id
            }
        });
    });
    test('not valid id', async () => {
        const elementOLD = await model_task_categories.create({name: 'test_putId_3_OLD'});
        const elementNEW = {...(elementOLD.dataValues), name: 'test_putId_3_NEW'};
        await expectPutIdError(elementNEW, 'not a valid id');
        await model_task_categories.destroy({
            where: {
                id: elementNEW.id
            }
        });
    });
    test('too much params', async () => {
        const elementOLD = await model_task_categories.create({name: 'test_putId_4_OLD'});
        const elementNEW = {...(elementOLD.dataValues), name: 'test_putId_4_NEW', excidingParam: 'too much'};
        await expectPutIdError(elementNEW, elementOLD.id);
        await model_task_categories.destroy({
            where: {
                id: elementNEW.id
            }
        });
    });
    test('too few params', async () => {
        const elementOLD = await model_task_categories.create({name: 'test_putId_5_OLD'});
        const elementNEW = {id: elementOLD.id};
        await expectPutIdError(elementNEW, elementOLD.id);
        await model_task_categories.destroy({
            where: {
                id: elementNEW.id
            }
        });
    });
    test('null param', async () => {
        const elementOLD = await model_task_categories.create({name: 'test_putId_5_OLD'});
        const elementNEW = {...(elementOLD.dataValues), name: null};
        await expectPutIdError(elementNEW, elementOLD.id);
        await model_task_categories.destroy({
            where: {
                id: elementNEW.id
            }
        });
    });
    test('wrong param', async () => {
        const elementOLD = await model_task_categories.create({name: 'test_putId_6_OLD'});
        const elementNEW = {id: elementOLD.id, wrongParameterName: 'test_putId_6_NEW'};
        await expectPutIdError(elementNEW, elementOLD.id);
        await model_task_categories.destroy({
            where: {
                id: elementNEW.id
            }
        });
    });
});

describe(`DELETE ${route}/:id`, () => {
    const expectDeleteIdOk = id => {
        expect.assertions(2);
        return request(app)
            .delete(route + '/' + id)
            .then(res => {
                expect.assertions(2);
                expect(res.statusCode).toBe(204);
                expect(res.body).toEqual({});
            });
    };

    const expectDeleteIdError = id => {
        expect.assertions(2);
        return request(app)
            .delete(route + '/' + id)
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

    const expectDeleteIdNotFound = id => {
        expect.assertions(2);
        return request(app)
            .delete(route + '/' + id)
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
        const element1 = await model_task_categories.create({'name': 'test_deleteId_1'});
        await expectDeleteIdOk(element1.id);
        element1.destroy();
    });

    test('invalid id', () => {
        return expectDeleteIdError('wrong Id (as a string)');
    });
    test('empty id', () => {
        return expectDeleteIdError();
    });
    test('null id', () => {
        return expectDeleteIdError(null);
    });
    test('id not present', () => {
        return expectDeleteIdNotFound(-1);
    });
});