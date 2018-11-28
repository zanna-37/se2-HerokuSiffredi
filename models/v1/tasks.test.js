let db;

beforeAll(() => {
    db = require('../../db');
});

afterAll(() => {
    db.close();
});

const model_tasks_v1 = require('./tasks');

test('tasks_v1.findAll() must have:\n' +
    '\t- id\n' +
    '\t- exerciseText\n' +
    '\t- answers[]\n' +
    '\t- explanation\n' +
    '\t- categoryId\n' +
    '\t- totalPoints\n' +
    '\t- lastEdit', async () => {
    await model_tasks_v1.findAll().then(tasks => {
        tasks.forEach(function (task) {
            expect(task.dataValues).toHaveProperty('id');
            expect(task.dataValues).toHaveProperty('exerciseText');
            expect(task.dataValues).toHaveProperty('answers');
            expect(task.dataValues).toHaveProperty('explanation');
            expect(task.dataValues).toHaveProperty('categoryId');
            expect(task.dataValues).toHaveProperty('totalPoints');
            expect(task.dataValues).toHaveProperty('lastEdit');
        });
    });
});