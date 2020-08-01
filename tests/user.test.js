const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')


test('Should sign up a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Tomy',
        email: 'tomygr@ejemplo.com',
        password: '123456'
    }).expect(201)

    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Tomy',
            email: 'tomygr@ejemplo.com',
        },
    })
    expect(user.password).not.toBe('123456')
})