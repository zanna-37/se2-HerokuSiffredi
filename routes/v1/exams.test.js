const db = require('../../db');
const request = require('supertest');
const app = require('../../app');


beforeAll(() => {
});

afterAll(() => {
    return db.close();
});

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

// Three required inputs: examTemplateID:integer, ownerIDs:[integer], defaultDeadlineEnd:date
// Inputs are passed as json in body
describe(`POST ${route}`, () => {
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
    const defaultBody = {
        examTemplateID: 23,
        ownerIDs: [5, 10, 70],
        defaultDeadlineEnd: '2019-10-19 10:23:54+02'
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
    test('pass wrong properties in json', () => expectPostError({
        aaa: 'bbb',
        ccc: 'ddd',
        eee: 'fff',
        ggg: 'hhh'
    }));
    test('examTemplateID is null', () => expectPostError({...defaultBody, examTemplateID: null}));
    test('ownerIDs is null', () => expectPostError({...defaultBody, ownerIDs: null}));
    test('defaultDeadlineEnd is null', () => expectPostError({...defaultBody, defaultDeadlineEnd: null}));
    test('examTemplateID is undefined', () => expectPostError({...defaultBody, examTemplateID: undefined}));
    test('ownerIDs is undefined', () => expectPostError({...defaultBody, ownerIDs: undefined}));
    test('defaultDeadlineEnd is undefined', () => expectPostError({...defaultBody, defaultDeadlineEnd: undefined}));
    test('examTemplateID string instead of integer', () => expectPostError({
        ...defaultBody,
        examTemplateID: defaultBody.examTemplateID.toString()
    }));
    test('ownerIDs string instead of integer', () => expectPostError({
        ...defaultBody,
        ownerIDs: defaultBody.ownerIDs.map(toString)
    }));
    test('examTemplateID integer instead of string', () => expectPostError({
        ...defaultBody,
        defaultDeadlineEnd: parseInt(defaultBody.defaultDeadlineEnd)
    }));

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