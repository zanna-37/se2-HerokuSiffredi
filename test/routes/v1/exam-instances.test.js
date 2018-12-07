const db = require('../../../src/db');
const request = require('supertest');
const app = require('../../../src/app');

afterAll(() => db.close());

const route = '/v1/exam-instances';

test(`GET ${route}`, () =>
    request(app)
        .get(route)
        .then(res => {
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
            res.body.forEach(examInstance => {
                expect(Object.keys(examInstance).length).toBe(5);
                expect(examInstance).toHaveProperty('id');
                expect(examInstance).toHaveProperty('userIDs');
                expect(examInstance).toHaveProperty('assignedTaskIDs');
                expect(examInstance).toHaveProperty('examEventID');
                expect(examInstance).toHaveProperty('finalEvaluation');
            });
        })
);

describe(`GET ${route}/:id`, () => {
    const expectGetError = id =>
        request(app)
            .get(`${route}${id}`)
            .then(res => {
                expect.assertions(3);
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty('code');
                expect(res.body).toHaveProperty('message');
            });

    test('no id', () => expectGetError(''));
    test('id is alphanumerical', () => expectGetError('tt1'));
    test('id is unvalid', () => expectGetError('0'));
    test('valid id', async () => {
        const testExamInstance = {
            userIDs: [4, 6, 9],
            assignedTaskIDs: [10, 20, 30],
            examEventID: 14
        };
        const examInstance = await db.model('exam_instances').create(testExamInstance);
        await request(app)
            .get(`${route}/${examInstance.id}`)
            .then(res => {
                const instID = examInstance.id;
                expect(res.status).toBe(200);
                expect(res.body).toEqual({id: instID, ...testExamInstance});
                return db.model('exam_instances').destroy({
                    where: {
                        id: instID
                    }
                });
            });
    });
});


describe(`POST ${route}`, () => {
    const expectPostError = body =>
        request(app)
            .post(route)
            .send(body)
            .then(res => {
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty('code');
                expect(res.body).toHaveProperty('message');
            });

    const defaultBody = {
        userIDs: [7, 9, 10],
        assignedTaskIDs: [1, 11, 21],
        examEventID: 23,
        finalEvaluation: null
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
    test('userIDs is null', () => expectPostError({...defaultBody, userIDs: null}));
    test('assignedTaskIDs is null', () => expectPostError({...defaultBody, assignedTaskIDs: null}));
    test('examEventID is null', () => expectPostError({...defaultBody, examEventID: null}));
    test('userIDs is undefined', () => expectPostError({...defaultBody, userIDs: undefined}));
    test('assignedTaskIDs is undefined', () => expectPostError({...defaultBody, assignedTaskIDs: undefined}));
    test('examEventID is undefined', () => expectPostError({...defaultBody, examEventID: undefined}));
    test('userIDs string instead of integer', () => expectPostError(
        {
            ...defaultBody,
            userIDs: defaultBody.userIDs.map(toString)
        }
    ));
    test('assignedTaskIDs string instead of integer', () => expectPostError(
        {
            ...defaultBody,
            assignedTaskIDs: defaultBody.assignedTaskIDs.map(toString)
        }
    ));
    test('examEventID string instead of integer', () => expectPostError(
        {
            ...defaultBody,
            examEventID: defaultBody.examEventID.toString()
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