let db;
let tester;
let app;

const route = '/v1/submissions/';

beforeAll(() => {
    db = require('../../db');
    tester = require('supertest');
    app = require('../../app');
});

afterAll(() => {
    // noinspection JSIgnoredPromiseFromCall
    db.close();
});

test('v1_get response to have all attributes ',  () => {
    return tester(app)
        .get('/v1/submissions')
        .then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeInstanceOf(Array);

            response.body.forEach( (item) => {
                expect(item).toBeInstanceOf(Object);
                expect(item).toMatchObject({id : expect.any(Number)});
                expect(item).toMatchObject({userId : expect.any(Number)});
                expect(item).toMatchObject({assignedTaskId : expect.any(Number)});
                expect(item).toMatchObject({userAnswer : expect.any(String)});
                expect(item).toHaveProperty('finalCorrectionId');
            });
        });
});



describe('POST', () => {
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
    const defaultBody = {
        examId : 2,
        userId : 2,
        assignedTaskId : 5,
        userAnswer : 'user answer',
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
    test('not enought attributes', () => wrongPostRequest({ examId : 2, userId : 2}));


    test('right POST request without finalCorrectionId', () =>{
        return tester(app)
            .post(route)
            .send({...defaultBody})
            .then(resp => {
                expect(resp.statusCode).toBe(200);
                expect(resp.body).toHaveProperty('id');
            });
    });

    test('right POST request with all attributes', () => {
        return tester(app)
            .post(route)
            .send({...defaultBody,finalCorrectionId : 5})
            .then(resp => {
                expect(resp.statusCode).toBe(200);
                expect(resp.body).toHaveProperty('id');
            });
    });
});

