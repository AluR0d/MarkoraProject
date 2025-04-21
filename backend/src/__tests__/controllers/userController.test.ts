import { UserController } from '../../controllers/userController';
import { UserService } from '../../services/userService';
import httpMocks from 'node-mocks-http';
import { createMockUser } from '../../test-utils/mockUser';
import { mockUserInput } from '../../test-utils/mockUserInput';
import { User } from '../../models/User';

describe('getUserByPk', () => {
  let userControllerInstance: UserController;
  let res: httpMocks.MockResponse<any>;

  beforeEach(() => {
    userControllerInstance = new UserController();
    res = httpMocks.createResponse();
  });

  test('UserNotFound-test', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/users/10',
      params: {
        id: '1',
      },
    });

    jest.spyOn(UserService, 'getUserByPk').mockResolvedValue(null);

    await userControllerInstance.getUserByPk(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: 'User not found' });
  });

  test('UserFound-test', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/users/1',
      params: {
        id: '1',
      },
    });

    const mockUser = createMockUser({
      id: 1,
      name: 'Prueba',
      email: 'test@example.com',
      password: 'fakePassword',
    });

    jest.spyOn(UserService, 'getUserByPk').mockResolvedValue(mockUser);

    await userControllerInstance.getUserByPk(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockUser);
  });

  test('UserError-test', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/users/1',
      params: {
        id: '1',
      },
    });

    const error = new Error('Database error');

    jest.spyOn(UserService, 'getUserByPk').mockRejectedValue(error);

    await userControllerInstance.getUserByPk(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'Internal server error' });
  });
});

describe('getAllUsers', () => {
  let userControllerInstance: UserController;
  let res: httpMocks.MockResponse<any>;

  beforeEach(() => {
    userControllerInstance = new UserController();
    res = httpMocks.createResponse();
  });

  test('AllUsersFound-test', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/users',
    });

    const mockUsers = [createMockUser({ id: 1 }), createMockUser({ id: 2 })];

    jest.spyOn(UserService, 'getAllUsers').mockResolvedValue(mockUsers);

    await userControllerInstance.getAllUsers(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockUsers);
  });

  test('AllUsersNotFound-test', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/users',
    });
    const mockUsers: User[] = [];

    jest.spyOn(UserService, 'getAllUsers').mockResolvedValue(mockUsers);

    await userControllerInstance.getAllUsers(req, res);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: 'No users found' });
  });

  test('AllUsersError-test', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/users',
    });
    const error = new Error();

    jest.spyOn(UserService, 'getAllUsers').mockRejectedValue(error);
    await userControllerInstance.getAllUsers(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'Internal server error' });
  });
});

describe('createUser', () => {
  let userControllerInstance: UserController;
  let res: httpMocks.MockResponse<any>;

  beforeEach(() => {
    userControllerInstance = new UserController();
    res = httpMocks.createResponse();
  });

  test('CreateUser-test', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/users',
      body: mockUserInput(),
    });

    jest.spyOn(UserService, 'createUser').mockResolvedValue(req.body);

    await userControllerInstance.createUser(req, res);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('CreateUserFailed-test', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/users',
      body: {
        name: 123,
        password: '123',
      },
    });

    jest.spyOn(UserService, 'createUser').mockResolvedValue(req.body);

    await userControllerInstance.createUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      errors: {
        name: ['Expected string, received number'],
        email: ['Required'],
        password: ['Password must be atleast 6.'],
      },
    });
  });

  test('CreateUserError-test', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/users',
      body: mockUserInput(),
    });

    const error = new Error();

    jest.spyOn(UserService, 'createUser').mockRejectedValue(error);
    await userControllerInstance.createUser(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'Internal server error' });
  });
});
