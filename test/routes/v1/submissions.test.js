let db;
let tester;
let app;

const route = '/v1/submissions';

beforeAll(() => {
    db = require('../../../src/db');
    tester = require('supertest');
    app = require('../../../src/app');
});

afterAll(() => {
    // noinspection JSIgnoredPromiseFromCall
    db.close();
});
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
                    expect(typeof item.id).toBe('number');
                    expect(typeof item.userId).toBe('number');
                    expect(typeof item.assignedTaskId).toBe('number');
                    expect(typeof item.userAnswer).toBe('string');
                    expect(typeof item.finalCorrectionId == 'number' ||
                        (item.finalCorrectionId == null && typeof item.finalCorrectionId == 'object'))
                        .toBeTruthy(); //TODO: è brutto?
                });
            });
    });
});

describe('GET /v1/submissions/id', () =>{//TODO: fare prima la POST e poi verificare quei valori
    test('check the existence of all attributes and the status code', () => {
        return tester(app)
            .get(route)
            .then(resp => {
                return resp.body[0].id;
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
            .get(route)
            .then(resp => {
                return resp.body[0].id;
            })
            .then(id => {
                tester(app)
                    .get(route+'/'+id)
                    .then(resp => {
                        expect(typeof resp.body.id).toBe('number');
                        expect(typeof resp.body.userId).toBe('number');

                        expect(typeof resp.body.assignedTaskId).toBe('number');
                        expect(typeof resp.body.userAnswer).toBe('string');
                        expect(typeof resp.body.finalCorrectionId == 'number' ||
                            (resp.body.finalCorrectionId == null && typeof resp.body.finalCorrectionId == 'object'))
                            .toBeTruthy(); //TODO: è brutto?
                    });
            });
    });
});




describe('POST', () => {
    let idCompleteObject;
    let idUncompleteObject;
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
    const defaultFinalCorrectionId = 5;
    const defaultBody = {
        examId : 2,
        userId : 2,
        assignedTaskId : 5,
        userAnswer : 'user answer',
    };

    const checkTheCorrectPostInsertion = (body,id) => {
        return tester(app)
            .get(route+'/'+id)
            .then( resp => {
                expect(resp.statusCode).toBe(200);
                for(let key in body.k){
                    expect(resp.body).toHaveProperty(''+ key);
                }
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
    // test('finalCorrectionId undefined', () => wrongPostRequest({...defaultBody, finalCorrectionId : undefined}));

    test('to many arguments',() =>  wrongPostRequest({...defaultBody, foo: 'foo', bar: 'bar'}));

    test('examId not a Integer', () => wrongPostRequest({...defaultBody, examId: 'string'}));
    test('userId not a Integer', () => wrongPostRequest({...defaultBody, userId: 'string'}));
    test('assignedTaskId not a Integer', () => wrongPostRequest({...defaultBody, assignedTaskId: 'string'}));
    test('userAnswer not a String', () => wrongPostRequest({...defaultBody, userAnswer: 9}));
    test('finalCorrectionId not a Integer', () => wrongPostRequest({...defaultBody, finalCorrectionId: 'string'}));
    test('not enough attributes', () => wrongPostRequest({ examId : 2, userId : 2}));


    test('right POST request without finalCorrectionId', () =>{
        return tester(app)
            .post(route)
            .send({...defaultBody})
            .then(resp => {
                expect(resp.statusCode).toBe(200);
                expect(resp.body).toHaveProperty('id');
                idUncompleteObject = resp.body.id;
            });
    });

    test('right POST request with all attributes', () => {
        return tester(app)
            .post(route)
            .send({...defaultBody,finalCorrectionId : defaultFinalCorrectionId})
            .then(resp => {
                expect(resp.statusCode).toBe(200);
                expect(resp.body).toHaveProperty('id');
                idCompleteObject = resp.body.id;
            });
    });

    test('check if the previous values have been insert correctly with uncomplete object', () => checkTheCorrectPostInsertion({...defaultBody},idUncompleteObject));
    test('check if the previous values have been insert correctly with complete object', () => checkTheCorrectPostInsertion({...defaultBody,finalCorrectionId: defaultFinalCorrectionId},idCompleteObject));
});

