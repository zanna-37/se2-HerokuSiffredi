const db = require('../../db');

afterAll(() => db.close());

test('tasks_v1 get response must have:\n' +
    '\t- id\n' +
    '\t- exerciseText\n' +
    '\t- answers[]\n' +
    '\t- explanation\n' +
    '\t- categoryId\n' +
    '\t- totalPoints\n' +
    '\t- lastEdit', () => {
    const request = require('supertest');
    const app = require('../../app');
    return request(app).get('/v1/tasks').then(response => {
        expect(response.statusCode).toBe(200);
        response.body.forEach(function (task) {
            expect(task).toHaveProperty('id');
            expect(task).toHaveProperty('exerciseText');
            expect(task).toHaveProperty('answers');
            expect(task).toHaveProperty('explanation');
            expect(task).toHaveProperty('categoryId');
            expect(task).toHaveProperty('totalPoints');
            expect(task).toHaveProperty('lastEdit');
        });
    });
});