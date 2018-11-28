let db;

beforeAll(() => {
    db = require('../../db');
});

afterAll(() => {
    // noinspection JSIgnoredPromiseFromCall
    db.close();
});

test('v1_get response to have id, name, surname, student number and average', () => {
    const request = require('supertest');
    const app = require('../../app');
    return request(app).get('/v1/users').then(response => {
        expect(response.statusCode).toBe(200);
        response.body.forEach(function (user) {
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('name');
            expect(user).toHaveProperty('surname');
            expect(user).toHaveProperty('student_number');
            expect(user).toHaveProperty('average');
        });
    });
});