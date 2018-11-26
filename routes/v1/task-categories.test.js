let db;

beforeAll(() => {
    db = require('../../db');
});

afterAll(() => {
    // noinspection JSIgnoredPromiseFromCall
    db.close();
});

test('v1_get response to have id and name', () => {
    const request = require('supertest');
    const app = require('../../app');
    return request(app).get('/v1/task-categories').then(response => {
        expect(response.statusCode).toBe(200);
        response.body.forEach(function (task_category) {
            expect(task_category).toHaveProperty('id');
            expect(task_category).toHaveProperty('name');
        });
    });
});