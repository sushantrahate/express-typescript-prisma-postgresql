import request, { SuperTest, Test } from 'supertest';
import { app } from '../src/app';

let api: SuperTest<Test> = request(app);
const baseURL = '/v1/users';

describe('User Controller', () => {
  let userId: string;

  it('should register a new user', async () => {
    const response = await api.post(`${baseURL}/register`).send({
      email: 'test@example.com',
      mobile: '9999999990',
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    userId = response.body.data.userId;
  });

  it('should login', async () => {
    const response = await api.post(`${baseURL}/login`).send({
      email: 'test@example.com',
      mobile: '9999999990',
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  // Add more test cases for other controller functions
});
