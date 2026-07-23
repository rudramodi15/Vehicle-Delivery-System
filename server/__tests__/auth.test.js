const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../src/app.js');
const User = require('../src/models/userSchema.js');

let mongoServer;

describe('Auth Endpoints (TDD with MongoDB)', () => {
    // Start in-memory MongoDB server before running tests
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    });

    // Clean up database after each test
    beforeEach(async () => {
        await User.deleteMany({});
    });

    // Stop in-memory server after all tests complete
    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    // Test Cases: User Registration
    describe('POST /api/auth/register', () => {
        it('should register a new user successfully with HTTP 201', async () => {
            const res = await request(app).post('/api/auth/register').send({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                role: 'user',
            });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('message', 'User registered successfully');
            expect(res.body.user).toHaveProperty('email', 'john@example.com');
            expect(res.body.user).not.toHaveProperty('password');
        });

        it('should return HTTP 400 if user email already exists', async () => {
            // Create initial user
            await request(app).post('/api/auth/register').send({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            });

            // Try duplicate registration
            const res = await request(app).post('/api/auth/register').send({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'User already exists');
        });
    });

    // Test Case: User Login
    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await request(app).post('/api/auth/register').send({
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'adminpassword',
                role: 'admin',
            });
        });

        it('should login successfully and return JWT token', async () => {
            const res = await request(app).post('/api/auth/login').send({
                email: 'admin@example.com',
                password: 'adminpassword',
            });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('role', 'admin');
        });

        it('should return HTTP 401 for incorrect password', async () => {
            const res = await request(app).post('/api/auth/login').send({
                email: 'admin@example.com',
                password: 'wrongpassword',
            });

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('error', 'Invalid credentials');
        });
    });
});
