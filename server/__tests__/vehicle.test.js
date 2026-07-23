const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const Vehicle = require('../src/models/vehicleSchema');
const User = require('../src/models/userSchema');

let mongoServer;
let userToken, adminToken;
let user, admin;

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

describe('Vehicle & Inventory API (TDD)', () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    });

    beforeEach(async () => {
        await Vehicle.deleteMany({});
        await User.deleteMany({});

        // Create test user token
        user = await User.create({
            name: 'Regular User',
            email: 'user@example.com',
            password: 'password123',
            role: 'user',
        });
        userToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);

        // Create test admin token
        admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'adminpassword',
            role: 'admin',
        });
        adminToken = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    // TDD Tests for Vehicles API
    describe('POST /api/vehicles (Create Vehicle)', () => {
        it('should add a new vehicle when authenticated', async () => {
            const res = await request(app)
                .post('/api/vehicles')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    make: 'Tesla',
                    model: 'Model 3',
                    category: 'Electric',
                    price: 35000,
                    quantity: 5,
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body.vehicle).toHaveProperty('make', 'Tesla');
            expect(res.body.vehicle).toHaveProperty('quantity', 5);
        });

        it('should return 401 if no token provided', async () => {
            const res = await request(app).post('/api/vehicles').send({
                make: 'Tesla',
                model: 'Model 3',
                category: 'Electric',
                price: 35000,
                quantity: 5,
            });

            expect(res.statusCode).toEqual(401);
        });
    });

    // TDD For Get All Vehicle & Search
    describe('GET /api/vehicles & /search', () => {
        beforeEach(async () => {
            await Vehicle.create([
                { make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 3 },
                { make: 'Tesla', model: 'Model Y', category: 'SUV', price: 50000, quantity: 2 },
            ]);
        });

        it('should fetch all vehicles', async () => {
            const res = await request(app)
                .get('/api/vehicles')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.vehicles.length).toEqual(2);
        });

        it('should search vehicles by make or category', async () => {
            const res = await request(app)
                .get('/api/vehicles/search?make=Tesla')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.vehicles.length).toEqual(1);
            expect(res.body.vehicles[0]).toHaveProperty('model', 'Model Y');
        });
    });

    // TDD For the Purchase Vehicle and Stock
    describe('POST /api/vehicles/:id/purchase', () => {
        it('should decrease vehicle quantity by 1 upon purchase', async () => {
            const car = await Vehicle.create({
                make: 'Ford',
                model: 'Mustang',
                category: 'Sports',
                price: 40000,
                quantity: 2,
            });

            const res = await request(app)
                .post(`/api/vehicles/${car._id}/purchase`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.vehicle).toHaveProperty('quantity', 1);
        });

        it('should return 400 if vehicle is out of stock (quantity === 0)', async () => {
            const car = await Vehicle.create({
                make: 'Ford',
                model: 'Mustang',
                category: 'Sports',
                price: 40000,
                quantity: 0,
            });

            const res = await request(app)
                .post(`/api/vehicles/${car._id}/purchase`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Vehicle is out of stock');
        });
    });

    describe('Admin Operations (DELETE & RESTOCK)', () => {
        it('should allow Admin to delete a vehicle', async () => {
            const car = await Vehicle.create({
                make: 'BMW',
                model: 'M3',
                category: 'Sedan',
                price: 70000,
                quantity: 1,
            });

            const res = await request(app)
                .delete(`/api/vehicles/${car._id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Vehicle deleted successfully');
        });

        it('should reject non-admin users from deleting a vehicle with 403', async () => {
            const car = await Vehicle.create({
                make: 'BMW',
                model: 'M3',
                category: 'Sedan',
                price: 70000,
                quantity: 1,
            });

            const res = await request(app)
                .delete(`/api/vehicles/${car._id}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(403);
        });
    });
});
