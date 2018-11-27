let db;

beforeAll(() => {
    db = require('../../db');
});

afterAll(() => {
    // noinspection JSIgnoredPromiseFromCall
    db.close();
});

const model_users_v1 = require('./users');

test('model_users_v1.findAll() to have id, name, surname, student number and average', async () => {
    await model_users_v1.findAll().then(users => {
        users.forEach(function (user) {
            expect(user.dataValues).toHaveProperty('id');
            expect(user.dataValues).toHaveProperty('name');
            expect(user.dataValues).toHaveProperty('surname');
            expect(user.dataValues).toHaveProperty('student_number');
            expect(user.dataValues).toHaveProperty('average');
        });
    });
});