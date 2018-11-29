let db;

beforeAll(() => {
    db = require('../../../src/db');
});

afterAll(() => {
    // noinspection JSIgnoredPromiseFromCall
    db.close();
});

const model_submissions_v1 = require('../../../src/models/v1/submissions');

test('submissions_v1 check if the table submission has all the right attributes', async () => {
    await model_submissions_v1.findAll().then(submissions => {
        submissions.forEach( function (item) {
            expect(item).toBeInstanceOf(Object);
            expect(item).toMatchObject({id : expect.any(Number)});
            expect(item).toMatchObject({userId : expect.any(Number)});
            expect(item).toMatchObject({assignedTaskId : expect.any(Number)});
            expect(item).toMatchObject({userAnswer : expect.any(String)});
            expect(item).toHaveProperty('finalCorrectionId');
        });
    });
});