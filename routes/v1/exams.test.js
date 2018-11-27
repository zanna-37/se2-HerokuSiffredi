const request = require('supertest');
const app = require('../../app');

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