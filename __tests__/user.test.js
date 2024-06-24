const { describe, it, expect, beforeAll, afterAll } = require('@jest/globals');
const request = require('supertest');
const app = require('../app');
const { AUTH_LOGIN_PATH, USERS_PATH } = require('./conf/path');
const {
	TEST_USER_ONE_EMAIL,
	TEST_USER_ONE_PASSWORD,
	TEST_USER_TWO_ID,
	TEST_USER_TWO_EMAIL,
	TEST_USER_TWO_PASSWORD,
	TEST_USER_TWO_ROLE,
	TEST_USER_ONE_ID,
} = require('./conf/test.utils');
const { connectDB, disconnectDB } = require('../src/config/db');
const { StatusCodes } = require('http-status-codes');

require('dotenv').config();

describe(`${USERS_PATH} TESTS`, () => {
	beforeAll(async () => {
		await connectDB();
	});

	it(`GET ${USERS_PATH} should return users list`, async () => {
		const logRes = await request(app)
			.post(AUTH_LOGIN_PATH)
			.send({ email: TEST_USER_ONE_EMAIL, password: TEST_USER_ONE_PASSWORD })
			.expect(StatusCodes.OK);

		const res = await request(app)
			.get(`${USERS_PATH}`)
			.set({ Authorization: `Bearer ${logRes.body.token}` })
			.expect('Content-Type', /json/)
			.expect(StatusCodes.OK);
		expect(res.statusCode).toBe(StatusCodes.OK);
		expect(res.body.length >= 2).toBe(true);
	});

	it(`GET ${USERS_PATH}/:user_id should return on user by id`, async () => {
		const logRes = await request(app)
			.post(AUTH_LOGIN_PATH)
			.send({ email: TEST_USER_ONE_EMAIL, password: TEST_USER_ONE_PASSWORD })
			.expect(StatusCodes.OK);

		const res = await request(app)
			.get(`${USERS_PATH}/${TEST_USER_TWO_ID}`)
			.set({ Authorization: `Bearer ${logRes.body.token}` })
			.expect('Content-Type', /json/)
			.expect(StatusCodes.OK);
		expect(res.statusCode).toBe(StatusCodes.OK);
		expect(res.body._id).toBe(TEST_USER_TWO_ID);
		expect(res.body.email).toBe(TEST_USER_TWO_EMAIL);
		expect(res.body.role).toBe(TEST_USER_TWO_ROLE);
	});

	it(`PUT ${USERS_PATH}/user_id should updated user`, async () => {
		const logRes = await request(app)
			.post(AUTH_LOGIN_PATH)
			.send({ email: TEST_USER_TWO_EMAIL, password: TEST_USER_TWO_PASSWORD })
			.expect(StatusCodes.OK);

		const res = await request(app)
			.put(`${USERS_PATH}/${TEST_USER_TWO_ID}`)
			.set({ Authorization: `Bearer ${logRes.body.token}` })
			.send({ bio: 'new bio' })
			.expect('Content-Type', /json/)
			.expect(StatusCodes.OK);
		expect(res.statusCode).toBe(StatusCodes.OK);
		expect(res.body.bio).toEqual('new bio');
	});

	it(`PUT ${USERS_PATH}/user_id should return Unauthorized`, async () => {
		const logRes = await request(app)
			.post(AUTH_LOGIN_PATH)
			.send({ email: TEST_USER_TWO_EMAIL, password: TEST_USER_TWO_PASSWORD })
			.expect(StatusCodes.OK);

		const res = await request(app)
			.put(`${USERS_PATH}/${TEST_USER_ONE_ID}`)
			.set({ Authorization: `Bearer ${logRes.body.token}` })
			.send({ bio: 'new bio' })
			.expect('Content-Type', /json/)
			.expect(StatusCodes.UNAUTHORIZED);
		expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
	});

	afterAll(async () => {
		await disconnectDB();
	});
});
