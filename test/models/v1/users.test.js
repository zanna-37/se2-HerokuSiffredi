const db = require('../../../src/db');

afterAll(() => db.close());

const model_users_v1 = require('../../../src/models/v1/users');

test('V1_USERS: test if the model has all the attributes', async () => {
    await model_users_v1.findAll().then(users => {
        users.forEach(function (user) {
            expect(user).toBeInstanceOf(Object);

            expect(user.dataValues).toHaveProperty('id');
            expect(user.dataValues).toHaveProperty('name');
            expect(user.dataValues).toHaveProperty('surname');
            expect(user.dataValues).toHaveProperty('student_number');
            expect(user.dataValues).toHaveProperty('average');

            expect(user).toMatchObject({id: expect.any(Number)});
            expect(user).toMatchObject({name: expect.any(String)});
            expect(user).toMatchObject({surname: expect.any(String)});
            expect(user).toMatchObject({student_number: expect.any(Number)});
        });
    });
});