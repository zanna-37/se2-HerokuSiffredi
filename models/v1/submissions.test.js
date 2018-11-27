let db;

beforeAll(() => {
    db = require('../../db');
});

afterAll(() => {
    // noinspection JSIgnoredPromiseFromCall
    db.close();
});

const model_submissions_v1 = require('./submissions');

test('submissions_v1.findAll() to have correct value', async () => {
    await model_submissions_v1.findAll().then(submissions => {
        submissions.forEach( function (item) {

            expect(item.dataValues).toHaveProperty('id');
            expect(item.dataValues).toHaveProperty('userId');
            expect(item.dataValues).toHaveProperty('assignedTaskId');
            expect(item.dataValues).toHaveProperty('userAnswer');
            expect(item.dataValues).toHaveProperty('finalCorrectionId');
        });
    });
});