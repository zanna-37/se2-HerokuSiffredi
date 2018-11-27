let db;
let tester;
let app;
beforeAll(() => {
    db = require('../../db');
    tester = require('supertest');
    app = require('../../app');
});

afterAll(() => {
    // noinspection JSIgnoredPromiseFromCall
    db.close();
});

test('v1_get response to have id and name', async () => {
    await tester(app).get('/v1/submissions').then(response => {
        expect(response.statusCode).toBe(200);
        response.body.forEach(function (item) {
            expect(item).toBeInstanceOf(Object);
            expect(item).toMatchObject({id : expect.any(Number)});
            expect(item).toMatchObject({userId : expect.any(Number)});
            expect(item).toMatchObject({assignedTaskId : expect.any(Number)});
            expect(item).toMatchObject({userAnswer : expect.any(String)});
            expect(item).toMatchObject({finalCorrectionId : expect.any(Number)});
        });
    });
});


test('check if the post works', async () => {
    await tester(app).post('/v1/submissions/').send({name: 'john'}).then(respo => {
        expect(respo.statusCode).toBe(200);
    });

    /*request.post(
            'http://www.yoursite.com/formpage',
            { json: { key: 'value' } },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body)
                }*/
});