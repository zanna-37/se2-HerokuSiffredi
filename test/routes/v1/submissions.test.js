let db;
let tester;
let app;

const route = '/v1/submissions';
const model_submissions = require('./../../../src/models/v1/submissions');
const model_exams = require('./../../../src/models/v1/exams');
const model_users = require('./../../../src/models/v1/users');
beforeAll(() => {
    db = require('../../../src/db');
    tester = require('supertest');
    app = require('../../../src/app');
});

afterAll(() => {
    // noinspection JSIgnoredPromiseFromCall
    db.close();
});

const defaultBody = {
    examId : 2,
    userId : 2,
    assignedTaskId : 5,
    userAnswer : 'user answer',
};

describe('GET /v1/submissions/', () => {
    test('check the existence of all attributes and the status code',() => {
        return tester(app)
            .get(route)
            .then( resp => {
                expect(resp.statusCode).toBe(200);
                expect(resp.body).toBeInstanceOf(Array);
                resp.body.forEach(item => {
                    expect(item).toBeInstanceOf(Object);
                    expect(item.hasOwnProperty('id') &&
                        item.hasOwnProperty('userId') &&
                        item.hasOwnProperty('assignedTaskId') &&
                        item.hasOwnProperty( 'userAnswer') &&
                        item.hasOwnProperty('finalCorrectionId')).toBeTruthy();
                });
            });
    });

    test('check the type of the attributes', () => {
        tester(app)
            .get(route)
            .then( resp => {
                resp.body.forEach(item => {
                    expect(Number.isInteger(item.id)).toBeTruthy();
                    expect(Number.isInteger(item.userId)).toBeTruthy();
                    expect(Number.isInteger(item.assignedTaskId)).toBeTruthy();
                    expect(typeof item.userAnswer).toBe('string');
                    expect(Number.isInteger(item.finalCorrectionId) ||
                        (item.finalCorrectionId == null && typeof item.finalCorrectionId == 'object'))
                        .toBeTruthy();
                });
            });
    });
});






describe('GET /v1/submissions/id', () =>{
    test('check the existence of all attributes and the status code', () => {
        return tester(app)
            .post(route)
            .send({...defaultBody, userAnswer: 'new'})
            .then(resp => {
                return resp.body.id;
            })
            .then(id => {
                tester(app)
                    .get(route+'/'+id)
                    .then(resp => {
                        expect(resp.statusCode).toBe(200);
                        expect(resp.body).toBeInstanceOf(Object);
                        expect(resp.body.hasOwnProperty('id') &&
                                resp.body.hasOwnProperty('userId') &&
                                resp.body.hasOwnProperty('assignedTaskId') &&
                                resp.body.hasOwnProperty( 'userAnswer') &&
                                resp.body.hasOwnProperty('finalCorrectionId')).toBeTruthy();
                    });
            });
    });
    test('check the type of the attributes', () => {
        return tester(app)
            .post(route)
            .send({...defaultBody, userAnswer: 'new'})
            .then( resp => {
                return resp.body.id;
            }).then(async id => {
                return tester(app)
                    .get(route + '/' + id)
                    .then(resp => {
                        expect(typeof resp.body.id).toBe('number');
                        expect(typeof resp.body.userId).toBe('number');
                        expect(typeof resp.body.assignedTaskId).toBe('number');
                        expect(typeof resp.body.userAnswer).toBe('string');
                        expect(typeof resp.body.finalCorrectionId == 'number' ||
                            (resp.body.finalCorrectionId == null && typeof resp.body.finalCorrectionId == 'object'))
                            .toBeTruthy();
                    });
            });
    });

    test('get with id that does not exist' , () => {
        return tester(app)
            .post(route)
            .send({...defaultBody, userAnswer: 'new'})
            .then(resp => {
                return resp.body.id;
            })
            .then(id => {
                return tester(app)
                    .delete(route)
                    .send([id])
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
});







describe('POST', () => {
    const defaultFinalCorrectionId = 5;

    const createExam = () => {
        return model_exams.create({
            examTemplateID: 1,
            ownerIDs: [1,2],
            avgMark: 4,
            defaultDeadlineStart: '2018-12-06 20:40:36.103000 +00:00',
            defaultDeadlineEnd: '2018-12-06 20:40:36.103000 +00:00'
        })
            .then(exam => {
                return exam.get('id');
            });
    };

    const createUser = () => {
        return model_users.create({
            name: 'Mario',
            surname: 'Bros',
            student_number: 12345
        })
            .then(user => {
                return user.get('id');
            });
    };

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


    const checkTheCorrectPostInsertion = (bodyToCheck,id) => {
        return tester(app)
            .get(route+'/'+id)
            .then( resp => {
                expect(resp.statusCode).toBe(200);
                const keys = Object.getOwnPropertyNames(bodyToCheck);
                keys.forEach(key => {
                    expect(resp.body).toHaveProperty(key);
                    expect(resp.body[key]).toBe(bodyToCheck[key]);
                });
            });
    };

    const correctPostRequest = async body =>{
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

    test('empty json',  () => wrongPostRequest({}));
    test('wrong parameters', () => wrongPostRequest({
        foo: 'foo',
        bar: 'bar'
    }));
    test('examId null', () => wrongPostRequest({...defaultBody, examId : null}));
    test('userId null', () => wrongPostRequest({...defaultBody, userId : null}));
    test('assignedTaskId null', () => wrongPostRequest({...defaultBody, assignedTaskId : null}));
    test('userAnswer null', () => wrongPostRequest({...defaultBody, userAnswer : null}));

    test('examId undefined', () => wrongPostRequest({...defaultBody, examId : undefined}));
    test('userId undefined', () => wrongPostRequest({...defaultBody, userId : undefined}));
    test('assignedTaskId undefined', () => wrongPostRequest({...defaultBody, assignedTaskId : undefined}));
    test('userAnswer undefined', () => wrongPostRequest({...defaultBody, userAnswer : undefined}));

    test('too many arguments',() =>  wrongPostRequest({...defaultBody, foo: 'foo', bar: 'bar'}));

    test('examId not a Integer', () => wrongPostRequest({...defaultBody, examId: 'string'}));
    test('userId not a Integer', () => wrongPostRequest({...defaultBody, userId: 'string'}));
    test('assignedTaskId not a Integer', () => wrongPostRequest({...defaultBody, assignedTaskId: 'string'}));
    test('userAnswer not a String', () => wrongPostRequest({...defaultBody, userAnswer: 9}));
    test('finalCorrectionId not a Integer', () => wrongPostRequest({...defaultBody, finalCorrectionId: 'string'}));
    test('not enough arguments', () => wrongPostRequest({ examId : 2, userId : 2}));

    test('right POST request without finalCorrectionId', async () => {
        const userId = await createUser();
        const examId = await createExam();
        return correctPostRequest({...defaultBody,userId :userId,examId:examId});
    });

    test('right POST request with all attributes', async () => {
        const userId = await createUser();
        const examId = await createExam();
        return correctPostRequest({...defaultBody,userId :userId,examId:examId,finalCorrectionId : defaultFinalCorrectionId});
    });

    test('check if the previous values have been insert correctly with not complete object', () =>{
        return tester(app)
            .post(route)
            .send({...defaultBody})
            .then(resp => {
                return checkTheCorrectPostInsertion({...defaultBody},resp.body.id);
            });
    });
    test('check if the previous values have been insert correctly with complete object', () => {
        return tester(app)
            .post(route)
            .send({...defaultBody, finalCorrectionId: defaultFinalCorrectionId})
            .then(resp => {
                checkTheCorrectPostInsertion({...defaultBody,finalCorrectionId: defaultFinalCorrectionId},resp.body.id);
            });
    });
});

describe('PUT /v1/submissions/id', () => {

    const defaultPutBody = {
        id: 934,
        examId : 6,
        userId : 4,
        assignedTaskId : 9,
        userAnswer : 'user answer',
    };

    const wrongPutRequest = body => {
        return tester(app)
            .put(route+'/'+body.id)
            .send(body)
            .then(resp => {
                expect(resp.statusCode).toBe(400);

                expect(resp.body).toHaveProperty('code');
                expect(resp.body).toHaveProperty('message');
            });
    };



    const correctPutRequest = async body => {
        const firstId = await model_submissions.create({...defaultBody})
            .then(model => {
                return model.get('id');
            });
        const secondId = await model_submissions.create({...defaultBody})
            .then(model => {
                return model.get('id');
            });
        return tester(app)
            .put(route+'/'+firstId)
            .send({...body})
            .then(async resp => {
                await model_submissions.destroy({where: {id: [firstId,secondId]}});
                expect(resp.statusCode).toBe(204);

            });

    };

    /*  const postRequest = (body) => {
        return tester(app)
            .post(route)
            .send(body)
            .then( resp => {
                return resp.id;
            });
    };*/

    /*const deleteRequest = ids => {
        return tester(app)
            .del(route)
            .send(ids);
    };


    test('put with a id that does not exist', async () =>  {
        await postRequest(defaultBody)
            .then(id => {
                deleteRequest([id]);
                return id;
            })
            .then(id => {
                wrongPutRequest({...defaultPutBody, id: id});
            });

    });*/

    //test('inserire foreign key che non esistono', () => expect(0).toBe(1));//TODO: da fare

    test('examId as a string instead of integer', () =>  wrongPutRequest({...defaultPutBody, examId: '6'}));
    test('examId as a a float instead of integer', () =>  wrongPutRequest({...defaultPutBody, examId: 6.4}));

    test('userId as a string instead of integer', () =>  wrongPutRequest({...defaultPutBody, userId: '4'}));
    test('userId as a a float instead of integer', () =>  wrongPutRequest({...defaultPutBody, userId: 4.6}));

    test('assignedTaskId as a string instead of integer', () =>  wrongPutRequest({...defaultPutBody, assignedTaskId: '9'}));
    test('assignedTaskId as a a float instead of integer', () =>  wrongPutRequest({...defaultPutBody, assignedTaskId: 9.6}));

    test('finalCorrectionId as a string instead of integer', () =>  wrongPutRequest({...defaultPutBody, finalCorrectionId: '9'}));
    test('finalCorrectionId as a a float instead of integer', () =>  wrongPutRequest({...defaultPutBody, finalCorrectionId: 9.6}));

    test('id as a string instead of integer', () =>  wrongPutRequest({...defaultPutBody, id: '9'}));
    test('id as a a float instead of integer', () =>  wrongPutRequest({...defaultPutBody, id: 9.6}));

    test('userAnswer as a integer instead of string', () =>  wrongPutRequest({...defaultPutBody, userAnswer: 9}));

    test('empty body', () => wrongPutRequest({}));

    test('examId null', () => wrongPutRequest({...defaultPutBody, examId : null}));
    test('userId null', () => wrongPutRequest({...defaultPutBody, userId : null}));
    test('assignedTaskId null', () => wrongPutRequest({...defaultPutBody, assignedTaskId : null}));
    test('userAnswer null', () => wrongPutRequest({...defaultPutBody, userAnswer : null}));

    test('examId undefined', () => wrongPutRequest({...defaultPutBody, examId : undefined}));
    test('userId undefined', () => wrongPutRequest({...defaultPutBody, userId : undefined}));
    test('assignedTaskId undefined', () => wrongPutRequest({...defaultPutBody, assignedTaskId : undefined}));
    test('userAnswer undefined', () => wrongPutRequest({...defaultPutBody, userAnswer : undefined}));
    //TODO: anche finalCorrectionId undefined?

    test('too many arguments ', () =>  wrongPutRequest({...defaultPutBody, foo:'foo', bar: 5}));

    test('not enough arguments (no id)', () => {
        return wrongPutRequest({
            examId : 6,
            userId : 4,
            assignedTaskId : 9,
            userAnswer : 'user answer'
        });
    });

    test('not enough arguments (no examId)', () => {
        return wrongPutRequest({
            id: 934,
            userId : 4,
            assignedTaskId : 9,
            userAnswer : 'user answer'
        });
    });

    test('not enough arguments (no userId)', () => {
        return wrongPutRequest({
            id: 934,
            examId : 6,
            assignedTaskId : 9,
            userAnswer : 'user answer'
        });
    });

    test('not enough arguments (no assignedTaskId )', () => {
        return wrongPutRequest({
            id: 934,
            examId : 6,
            userId : 4,
            userAnswer : 'user answer'
        });
    });

    test('not enough arguments (no userAnswer )', () => {
        return wrongPutRequest({
            id: 934,
            examId : 6,
            userId : 4,
            assignedTaskId : 9,
        });
    });


    test('corretto inserimento di tutti gli attributi', () =>{
        correctPutRequest({...defaultPutBody, finalCorrectionId: 5});
    });

    test('corretto inserimento con solo gli attributi obbligatori', () => {
        return correctPutRequest({...defaultPutBody, id : 5});
    });
});


describe('DELETE /v1/submissions' , () => {

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

    test('sent an object instead array', () => wrongDeleteRequest({firstId : 1, secondId : 2}));
    test('no body', () => wrongDeleteRequest());
    test('empty body' , () => wrongDeleteRequest([]));

    test('sent an array with at least a string as element' ,() => {
        return wrongDeleteRequest([1,'2',3]);
    });

    test('sent an array with at least a non-integer element' , async () => {
        return wrongDeleteRequest([1,1.2,3]);
    });
    test('sent negative number as id', () => wrongDeleteRequest([-1,-3]));
    test('sent a correct delete request with only one id' ,() =>{
        return tester(app)
            .post(route)
            .send(defaultBody)
            .then(async res => {
                await correctDeleteRequest([res.body.id]);
            });

    });

    test('sent a correct delete request with a list of id' , () => {
        let ids = [];
        return tester(app)
            .get(route)
            .then(resp => {
                resp.body.forEach(item => {
                    ids.push(item.id);
                });
            })
            .then(  async () => {
                await correctDeleteRequest(ids);
            });
    });
});








