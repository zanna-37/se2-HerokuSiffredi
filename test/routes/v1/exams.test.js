const db = require('../../../src/db');
const request = require('supertest');
const app = require('../../../src/app');
const examsModel = require('../../../src/models/v1/exams');

afterAll(() => db.close());

const route = '/v1/exams';

test(`GET ${route}`, () => {
    return request(app)
        .get(route)
        .then(res => {
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
            res.body.forEach(exam => {
                expect(exam).toHaveProperty('id');
                expect(exam).toHaveProperty('examTemplateID');
                expect(exam).toHaveProperty('defaultDeadlineEnd');
            });
        });
});

describe(`GET ${route}/:id`, () => {
    const defaultBody = {
        examTemplateID: 23,
        ownersIDs: [5, 10, 70],
        defaultDeadlineEnd: '2019-10-19 10:23:54+02'
    };
    const expectGetIdOk = id => {
        expect.assertions(2);
        return request(app)
            .get(route + '/' + id)
            .then(res => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toMatchObject(
                    {
                        id: expect.any(Number),
                        examTemplateID: expect.any(Number),
                        defaultDeadlineEnd: expect.any(String)
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
        const element1 = await examsModel.create(defaultBody);
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

// Three required inputs: examTemplateID:integer, ownersIDs:[integer], defaultDeadlineEnd:date
// Inputs are passed as json in body
describe(`POST ${route}`, () => {
    const defaultBody = {
        examTemplateID: 23,
        ownersIDs: [5, 10, 70],
        defaultDeadlineEnd: '2019-10-19 10:23:54+02'
    };

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

    test('no body', () =>
        request(app)
            .post(route)
            .then(res => {
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty('code');
                expect(res.body).toHaveProperty('message');
            })
    );
    test('pass empty json in body', () => expectPostError({}));
    test('pass wrong properties in json', () => expectPostError(
        {
            aaa: 'bbb',
            ccc: 'ddd',
            eee: 'fff',
            ggg: 'hhh'
        }
    ));
    test('examTemplateID is null', () => expectPostError({...defaultBody, examTemplateID: null}));
    test('ownersIDs is null', () => expectPostError({...defaultBody, ownersIDs: null}));
    test('defaultDeadlineEnd is null', () => expectPostError({...defaultBody, defaultDeadlineEnd: null}));
    test('examTemplateID is undefined', () => expectPostError({...defaultBody, examTemplateID: undefined}));
    test('ownersIDs is undefined', () => expectPostError({...defaultBody, ownersIDs: undefined}));
    test('defaultDeadlineEnd is undefined', () => expectPostError({...defaultBody, defaultDeadlineEnd: undefined}));
    test('examTemplateID string instead of integer', () => expectPostError(
        {
            ...defaultBody,
            examTemplateID: defaultBody.examTemplateID.toString()
        }
    ));
    test('ownersIDs string instead of integer', () => expectPostError(
        {
            ...defaultBody,
            ownersIDs: defaultBody.ownersIDs.map(toString)
        }
    ));
    test('examTemplateID integer instead of string', () => expectPostError(
        {
            ...defaultBody,
            defaultDeadlineEnd: parseInt(defaultBody.defaultDeadlineEnd)
        }
    ));

    test('using arbitrary body', () =>
        request(app)
            .post(route)
            .send(defaultBody)
            .then(res => {
                expect(res.status).toBe(201);
                expect(res.body).toHaveProperty('id');
            })
    );
});

describe(`PUT ${route}/:id`, () => {

    const defaultBody = {
        examTemplateID: 23,
        ownersIDs: [5, 10, 70],
        defaultDeadlineEnd: '2019-10-19 10:23:54+02'
    };

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
        const elementOLD = await examsModel.create(defaultBody);
        const elementNEW = {...defaultBody, id: elementOLD.id, defaultDeadlineEnd: '2020-10-19 10:23:54+02'};
        await expectPutIdOkWithUpdatedId(elementNEW, elementOLD.id);
        await examsModel.destroy({
            where: {
                id: elementNEW.id
            }
        });
    });
    test('correct update', async () => {
        const elementOLD = await examsModel.create(defaultBody);
        const elementNEW = {...defaultBody, id: elementOLD.id, defaultDeadlineStart: '2020-10-19 10:23:54+02'};
        await expectPutIdOkWithUpdatedId(elementNEW, elementOLD.id);
        await examsModel.destroy({
            where: {
                id: elementNEW.id
            }
        });
    });
    test('not existing id', async () => {
        const elementOLD = await examsModel.create(defaultBody);
        const elementNEW = {...defaultBody, id: elementOLD.id, defaultDeadlineEnd: '2020-10-19 10:23:54+02'};
        await expectPutIdNotFound(elementNEW, -1);
        await examsModel.destroy({
            where: {
                id: elementNEW.id
            }
        });
    });
    test('not valid id', async () => {
        const elementOLD = await examsModel.create(defaultBody);
        const elementNEW = {...defaultBody, id: elementOLD.id, defaultDeadlineEnd: '2020-10-19 10:23:54+02'};
        await expectPutIdError(elementNEW, 'not a valid id');
        await examsModel.destroy({
            where: {
                id: elementNEW.id
            }
        });
    });
    test('too much params', async () => {
        const elementOLD = await examsModel.create(defaultBody);
        const elementNEW = {
            ...defaultBody,
            id: elementOLD.id,
            defaultDeadlineEnd: '2020-10-19 10:23:54+02',
            excidingParam: 'too much'
        };
        await expectPutIdError(elementNEW, elementOLD.id);
        await examsModel.destroy({
            where: {
                id: elementNEW.id
            }
        });
    });
    test('too few params', async () => {
        const elementOLD = await examsModel.create(defaultBody);
        const elementNEW = {id: elementOLD.id, defaultDeadlineEnd: '2020-10-19 10:23:54+02'};
        await expectPutIdError(elementNEW, elementOLD.id);
        await examsModel.destroy({
            where: {
                id: elementNEW.id
            }
        });
    });
    test('null param', async () => {
        const elementOLD = await examsModel.create(defaultBody);
        const elementNEW = {...defaultBody, id: elementOLD.id, defaultDeadlineEnd: null};
        await expectPutIdError(elementNEW, elementOLD.id);
        await examsModel.destroy({
            where: {
                id: elementNEW.id
            }
        });
    });
});

describe(`DELETE ${route}/:id`, () => {

    const defaultBody = {
        examTemplateID: 23,
        ownersIDs: [5, 10, 70],
        defaultDeadlineEnd: '2019-10-19 10:23:54+02'
    };

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
        const element1 = await examsModel.create(defaultBody);
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