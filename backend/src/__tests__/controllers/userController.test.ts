import { UserController } from '../../controllers/userController';
import { User } from '../../models/User';
import httpMocks from 'node-mocks-http';
import { createMockUser } from '../utils/mockUser';

test('UserNotFound-test', async () => {
  const userControllerInstance = new UserController();

  const req = httpMocks.createRequest({
    method: 'GET',
    url: '/users/10',
    params: {
      id: '1',
    },
  });

  const res = httpMocks.createResponse();

  jest.spyOn(User, 'findByPk').mockResolvedValue(null);

  await userControllerInstance.getUserByPk(req, res);
  expect(res.statusCode).toBe(404);
  expect(res._getJSONData()).toEqual({ message: 'User not found' });
});

test('UserFound-test', async () => {
  const userControllerInstance = new UserController();

  const req = httpMocks.createRequest({
    method: 'GET',
    url: '/users/1',
    params: {
      id: '1',
    },
  });

  const res = httpMocks.createResponse();

  jest.spyOn(User, 'findByPk').mockResolvedValue(
    createMockUser({
      id: 1,
      name: 'Prueba',
      email: 'test@example.com',
      password: 'fakePassword',
    }) as unknown as User
  );

  await userControllerInstance.getUserByPk(req, res);
  expect(res.statusCode).toBe(200);
  expect(res._getJSONData()).toEqual({
    id: 1,
    name: 'Prueba',
    email: 'test@example.com',
    password: 'fakePassword',
  });
});

test('UserError-test', async () => {
  const userControllerInstance = new UserController();

  const req = httpMocks.createRequest({
    method: 'GET',
    url: '/users/1',
    params: {
      id: '1',
    },
  });

  const res = httpMocks.createResponse();
  const error = new Error('Database error');

  jest.spyOn(User, 'findByPk').mockRejectedValue(error);
  await userControllerInstance.getUserByPk(req, res);
  expect(res.statusCode).toBe(500);
  expect(res._getJSONData()).toEqual({ message: 'Internal server error' });
});
