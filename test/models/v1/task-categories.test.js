const db = require('../../../src/db');

afterAll(() => db.close());

const model_task_categories_v1 = require('../../../src/models/v1/task-categories');

test('task_categories_v1.findAll() to have id and name', async () => {
    await model_task_categories_v1.findAll().then(task_categories => {
        task_categories.forEach(function (category) {
            expect(category.dataValues).toHaveProperty('id');
            expect(category.dataValues).toHaveProperty('name');
        });
    });
});