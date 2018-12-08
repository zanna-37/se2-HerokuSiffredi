let db;
let tester;
let app;

const route = '/v1/submissions';
const model_submissions = require('./../../../src/models/v1/submissions');
beforeAll(() => {
    db = require('../../../src/db');
    tester = require('supertest');
    app = require('../../../src/app');
});

afterAll(() => {
    db.close();
});

const defaultPostBody = {
    examInstanceId: 2,
    assignedTaskId: 5,
    userAnswer: 'user answer'
};

const createSubmission = body => {
    return model_submissions.create(body)
        .then(model => {
            return model.get('id');
        });
};
const deleteSubmissions = idsToDelete => {
    return model_submissions.destroy({where: {id: idsToDelete}});
};
describe('GET /v1/submissions/', () => {
    test('check the existence of all attributes and the status code', () => {
        return tester(app)
            .get(route)
            .then(resp => {
                expect(resp.statusCode).toBe(200);
                expect(resp.body).toBeInstanceOf(Array);
                resp.body.forEach(item => {
                    expect(item).toBeInstanceOf(Object);
                    expect(item.hasOwnProperty('id') &&
                        item.hasOwnProperty('examInstanceId') &&
                        item.hasOwnProperty('assignedTaskId') &&
                        item.hasOwnProperty('userAnswer') &&
                        item.hasOwnProperty('finalCorrectionId')).toBeTruthy();
                });
            });
    });

    test('check the type of the attributes', () => {
        tester(app)
            .get(route)
            .then(resp => {
                resp.body.forEach(item => {
                    expect(Number.isInteger(item.id)).toBeTruthy();
                    expect(Number.isInteger(item.examInstanceId)).toBeTruthy();
                    expect(Number.isInteger(item.assignedTaskId)).toBeTruthy();
                    expect(typeof item.userAnswer).toBe('string');
                    expect(Number.isInteger(item.finalCorrectionId) ||
                        (item.finalCorrectionId == null && typeof item.finalCorrectionId == 'object'))
                        .toBeTruthy();
                });
            });
    });
});
describe('GET /v1/submissions/id', () => {
    test('check the existence of all attributes and the status code', () => {
        return createSubmission({...defaultPostBody, userAnswer: 'new'})
            .then(async id => {
                return tester(app)
                    .get(route + '/' + id)
                    .then(resp => {
                        expect(resp.statusCode).toBe(200);
                        expect(resp.body).toBeInstanceOf(Object);
                        expect(resp.body.hasOwnProperty('id') &&
                            resp.body.hasOwnProperty('examInstanceId') &&
                            resp.body.hasOwnProperty('assignedTaskId') &&
                            resp.body.hasOwnProperty('userAnswer') &&
                            resp.body.hasOwnProperty('finalCorrectionId')).toBeTruthy();
                    });
            });
    });
    test('check the type of the attributes', () => {
        return createSubmission({...defaultPostBody, userAnswer: 'new'})
            .then(async id => {
                return tester(app)
                    .get(route + '/' + id)
                    .then(resp => {
                        expect(typeof resp.body.id).toBe('number');
                        expect(typeof resp.body.examInstanceId).toBe('number');
                        expect(typeof resp.body.assignedTaskId).toBe('number');
                        expect(typeof resp.body.userAnswer).toBe('string');
                        expect(typeof resp.body.finalCorrectionId == 'number' ||
                            (resp.body.finalCorrectionId == null && typeof resp.body.finalCorrectionId == 'object'))
                            .toBeTruthy();
                    });
            });

    });

    test('get with id that does not exist', () => {
        return createSubmission({...defaultPostBody, userAnswer: 'new'})
            .then(id => {
                return deleteSubmissions(id)
                    .then(() => {
                        return tester(app)
                            .get(route + '/' + id)
                            .then(resp => {
                                expect(resp.statusCode).toBe(404);
                                expect(resp.body).toHaveProperty('code');
                                expect(resp.body).toHaveProperty('message');
                            });

                    });
            });
    });

    test('get request with negative id', () => {
        return tester(app)
            .get(route + '/' + -1)
            .then(resp => {
                expect(resp.statusCode).toBe(400);
                expect(resp.body).toHaveProperty('code');
                expect(resp.body).toHaveProperty('message');
            });
    });

    test('get request with float id', () => {
        return tester(app)
            .get(route + '/' + 2.3)
            .then(resp => {
                expect(resp.statusCode).toBe(400);
                expect(resp.body).toHaveProperty('code');
                expect(resp.body).toHaveProperty('message');
            });
    });


});

describe('POST /v1/submissions', () => {
    const defaultFinalCorrectionId = 5;

    const wrongPostRequest = body => {
        return tester(app)
            .post(route)
            .send(body)
            .then(resp => {
                expect(resp.statusCode).toBe(400);
                expect(resp.body).toHaveProperty('message');
                expect(resp.body).toHaveProperty('code');
            });
    };

    const checkTheCorrectPostInsertion = (bodyToCheck, id) => {
        return tester(app)
            .get(route + '/' + id)
            .then(resp => {
                expect(resp.statusCode).toBe(200);
                const keys = Object.getOwnPropertyNames(bodyToCheck);
                keys.forEach(key => {
                    expect(resp.body).toHaveProperty(key);
                    expect(resp.body[key]).toBe(bodyToCheck[key]);
                });
            });
    };

    const correctPostRequest = async body => {
        return tester(app)
            .post(route)
            .send(body)
            .then(resp => {
                expect(resp.statusCode).toBe(201);
                expect(resp.body).toHaveProperty('id');
            });
    };

    test('no body', () => {
        return tester(app)
            .post(route)
            .then(resp => {
                expect(resp.statusCode).toBe(400);
                expect(resp.body).toHaveProperty('code');
                expect(resp.body).toHaveProperty('message');
            });
    });

    test('empty json', () => wrongPostRequest({}));

    test('wrong parameters', () => wrongPostRequest({
        foo: 'foo',
        bar: 'bar'
    }));

    test('examInstanceId null', () => wrongPostRequest({...defaultPostBody, examInstanceId: null}));
    test('assignedTaskId null', () => wrongPostRequest({...defaultPostBody, assignedTaskId: null}));
    test('userAnswer null', () => wrongPostRequest({...defaultPostBody, userAnswer: null}));

    test('examId undefined', () => wrongPostRequest({...defaultPostBody, examInstanceId: undefined}));
    test('assignedTaskId undefined', () => wrongPostRequest({...defaultPostBody, assignedTaskId: undefined}));
    test('userAnswer undefined', () => wrongPostRequest({...defaultPostBody, userAnswer: undefined}));

    test('too many arguments', () => wrongPostRequest({...defaultPostBody, foo: 'foo', bar: 'bar'}));

    test('examId not a Integer', () => wrongPostRequest({...defaultPostBody, examInstanceId: 'string'}));
    test('assignedTaskId not a Integer', () => wrongPostRequest({...defaultPostBody, assignedTaskId: 'string'}));
    test('userAnswer not a String', () => wrongPostRequest({...defaultPostBody, userAnswer: 9}));
    test('finalCorrectionId not a Integer', () => wrongPostRequest({...defaultPostBody, finalCorrectionId: 'string'}));
    test('not enough arguments', () => wrongPostRequest({examInstanceId: 2, finalCorrectionId: 2}));

    test('right POST request without finalCorrectionId', async () => {
        return correctPostRequest({...defaultPostBody});
    });

    test('right POST request with all attributes', async () => {
        return correctPostRequest({...defaultPostBody, finalCorrectionId: defaultFinalCorrectionId});
    });

    test('check if the previous values have been insert correctly with not complete object', () => {
        return tester(app)
            .post(route)
            .send({...defaultPostBody})
            .then(resp => {
                return checkTheCorrectPostInsertion({...defaultPostBody}, resp.body.id);
            });
    });
    test('check if the previous values have been insert correctly with complete object', () => {
        return tester(app)
            .post(route)
            .send({...defaultPostBody, finalCorrectionId: defaultFinalCorrectionId})
            .then(resp => {
                checkTheCorrectPostInsertion({
                    ...defaultPostBody,
                    finalCorrectionId: defaultFinalCorrectionId
                }, resp.body.id);
            });
    });
});
describe('POST /v1/submissions/id', () => {
    test('Post request at route not allowed', () => {
        return tester(app)
            .post(route + '/' + 5)
            .send(defaultPostBody)
            .then(resp => {
                expect(resp.statusCode).toBe(404);
                expect(resp.body).toHaveProperty('code');
                expect(resp.body).toHaveProperty('message');
            });
    });
});

describe('PUT /v1/submissions/id', () => {

    const defaultPutBody = {
        id: 934,
        examInstanceId: 6,
        assignedTaskId: 9,
        userAnswer: 'user answer',
    };

    const wrongPutRequest = body => {
        return tester(app)
            .put(route + '/' + body.id)
            .send(body)
            .then(resp => {
                expect(resp.statusCode).toBe(400);
                expect(resp.body).toHaveProperty('code');
                expect(resp.body).toHaveProperty('message');
            });
    };


    const correctPutRequest = async body => {
        const firstId = await createSubmission(defaultPostBody);
        const secondId = await createSubmission(defaultPostBody);
        return tester(app)
            .put(route + '/' + firstId)
            .send({...body})
            .then(async resp => {
                deleteSubmissions([firstId, secondId]);
                expect(resp.statusCode).toBe(204);

            });

    };

    test('examId as a string instead of integer', () => wrongPutRequest({...defaultPutBody, examInstanceId: '6'}));
    test('examId as a a float instead of integer', () => wrongPutRequest({...defaultPutBody, examInstanceId: 6.4}));

    test('assignedTaskId as a string instead of integer', () => wrongPutRequest({
        ...defaultPutBody,
        assignedTaskId: '9'
    }));
    test('assignedTaskId as a a float instead of integer', () => wrongPutRequest({
        ...defaultPutBody,
        assignedTaskId: 9.6
    }));

    test('finalCorrectionId as a string instead of integer', () => wrongPutRequest({
        ...defaultPutBody,
        finalCorrectionId: '9'
    }));
    test('finalCorrectionId as a a float instead of integer', () => wrongPutRequest({
        ...defaultPutBody,
        finalCorrectionId: 9.6
    }));

    test('id as a string instead of integer', () => wrongPutRequest({...defaultPutBody, id: '9'}));
    test('id as a a float instead of integer', () => wrongPutRequest({...defaultPutBody, id: 9.6}));

    test('userAnswer as a integer instead of string', () => wrongPutRequest({...defaultPutBody, userAnswer: 9}));

    test('empty body', () => wrongPutRequest({}));

    test('examId null', () => wrongPutRequest({...defaultPutBody, examInstanceId: null}));
    test('assignedTaskId null', () => wrongPutRequest({...defaultPutBody, assignedTaskId: null}));
    test('userAnswer null', () => wrongPutRequest({...defaultPutBody, userAnswer: null}));

    test('examId undefined', () => wrongPutRequest({...defaultPutBody, examInstanceId: undefined}));
    test('assignedTaskId undefined', () => wrongPutRequest({...defaultPutBody, assignedTaskId: undefined}));
    test('userAnswer undefined', () => wrongPutRequest({...defaultPutBody, userAnswer: undefined}));

    test('too many arguments ', () => wrongPutRequest({...defaultPutBody, foo: 'foo', bar: 5}));

    test('put request of an id that does not exist', async () => {
        const idThatWillBeDeleted = await createSubmission(defaultPostBody);
        await deleteSubmissions(idThatWillBeDeleted);
        return tester(app)
            .put(route + '/' + idThatWillBeDeleted)
            .send(defaultPutBody)
            .then(resp => {
                expect(resp.statusCode).toBe(404);
                expect(resp.body).toHaveProperty('code');
                expect(resp.body).toHaveProperty('message');
            });
    });
    test('not enough arguments (no id)', () => {
        return wrongPutRequest({
            examInstanceId: 6,
            assignedTaskId: 9,
            userAnswer: 'user answer'
        });
    });

    test('not enough arguments (no examId)', () => {
        return wrongPutRequest({
            id: 934,
            assignedTaskId: 9,
            userAnswer: 'user answer'
        });
    });

    test('not enough arguments (no assignedTaskId )', () => {
        return wrongPutRequest({
            id: 934,
            examInstanceId: 6,
            userAnswer: 'user answer'
        });
    });

    test('not enough arguments (no userAnswer )', () => {
        return wrongPutRequest({
            id: 934,
            examInstanceId: 6,
            assignedTaskId: 9,
        });
    });


    test('correct put request with all arguments', () => {
        return correctPutRequest({...defaultPutBody, finalCorrectionId: 5});
    });

    test('correct put request with only mandatory arguments', () => {
        return correctPutRequest({...defaultPutBody, id: 5});
    });
});

describe('PUT /v1/submissions', () => {

    const wrongPutRequest = body => {
        return tester(app)
            .put(route)
            .send(body)
            .then(resp => {
                expect(resp.statusCode).toBe(400);
                expect(resp.body).toHaveProperty('code');
                expect(resp.body).toHaveProperty('message');
            });
    };

    test('empty body', () => wrongPutRequest());
    test('wrong body', () => wrongPutRequest({}));

    test('empty array', () => wrongPutRequest([]));
    test('array of non-object', () => wrongPutRequest([1, 2, 3]));

    test('array with object that has not all arguments', async () => {
        const firstNewSubmissionId = await createSubmission(defaultPostBody);
        const secondNewSubmissionId = await createSubmission(defaultPostBody);
        return wrongPutRequest([{assignedTaskId: 3, id: firstNewSubmissionId}, {
            examInstanceId: 3,
            id: secondNewSubmissionId
        }]);
    });
    /*
        test('put request with id that does not exist', async () => {
            const firstSubmissionIdThatWillBeDeleted = await createSubmission(defaultPostBody);
            const secondSubmissionIdThatWillBeDeleted = await createSubmission(defaultPostBody);
            await deleteSubmissions([firstSubmissionIdThatWillBeDeleted, secondSubmissionIdThatWillBeDeleted]);
            return wrongPutRequest([{...defaultPostBody, id:firstSubmissionIdThatWillBeDeleted},
                {...defaultPostBody, id: secondSubmissionIdThatWillBeDeleted}]);
        });*/
    test('correct put request', async () => {
        const firstNewSubmissionId = await createSubmission(defaultPostBody);
        const secondNewSubmissionId = await createSubmission(defaultPostBody);
        return tester(app)
            .put(route)
            .send([{...defaultPostBody, id: firstNewSubmissionId, examInstanceId:4000}, {...defaultPostBody, id: secondNewSubmissionId,examInstanceId:3000}])
            .then(resp => {
                expect(resp.statusCode).toBe(204);
            });
    });

});

describe('DELETE /v1/submissions', () => {

    const wrongDeleteRequest = body => {
        return tester(app)
            .delete(route)
            .send(body)
            .expect(400);
    };

    const correctDeleteRequest = ids => {
        return tester(app)
            .delete(route)
            .send(ids)
            .expect(200);
    };

    test('sent an object instead array', () => wrongDeleteRequest({firstId: 1, secondId: 2}));
    test('no body', () => wrongDeleteRequest());
    test('empty body', () => wrongDeleteRequest([]));

    test('sent an array with at least a string as element', () => {
        return wrongDeleteRequest([1, '2', 3]);
    });

    test('sent an array with at least a non-integer element', async () => {
        return wrongDeleteRequest([1, 1.2, 3]);
    });
    test('sent negative number as id', () => wrongDeleteRequest([-1, -3]));
    test('sent a correct delete request with only one id', () => {
        return createSubmission(defaultPostBody)
            .then(async id => {
                await correctDeleteRequest([id]);
            });
    });

    test('sent a correct delete request with a list of id', async () => {
        return createSubmission(defaultPostBody)
            .then(() => {
                return createSubmission(defaultPostBody)
                    .then(() => {
                        let ids = [];
                        return tester(app)
                            .get(route)
                            .then(resp => {
                                resp.body.forEach(item => {
                                    ids.push(item.id);
                                });
                            })
                            .then(async () => {
                                await correctDeleteRequest(ids);
                            });
                    });
            });

    });
});
describe('DELETE /v1/submissions/id', () => {
    const wrongDeleteRequest = id => {
        return tester(app)
            .delete(route + '/' + id)
            .then(resp => {
                expect(resp.statusCode).toBe(400);
                expect(resp.body).toHaveProperty('code');
                expect(resp.body).toHaveProperty('message');
            });
    };
    test('delete request with non-integer id', () => wrongDeleteRequest(4.4));
    test('delete request with negative id', () => wrongDeleteRequest(-2));
    test('delete a submissions that does not exist', async () => {
        const idSubmissionsThatWillBeDeleted = await createSubmission(defaultPostBody);
        await deleteSubmissions([idSubmissionsThatWillBeDeleted]);

        return tester(app)
            .delete(route + '/' + idSubmissionsThatWillBeDeleted)
            .then(resp => {
                expect(resp.statusCode).toBe(404);
                expect(resp.body).toHaveProperty('code');
                expect(resp.body).toHaveProperty('message');
            });
    });

    test('correct delete request', async () => {
        const idNewSubmissions = await createSubmission(defaultPostBody);
        return tester(app)
            .delete(route + '/' + idNewSubmissions)
            .then(resp => {
                expect(resp.statusCode).toBe(204);
            });
    });
});









