const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should response 201 and create new thread', async () => {
      const authPayload = {
        username: 'syarif',
        password: 'secret',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'syarif',
          password: 'secret',
          fullname: 'syarif hidayatulloh',
        },
      });

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: authPayload,
      });

      const responseAuth = JSON.parse(auth.payload);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread title',
          body: 'sebuah thread body',
        },
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });
  });
});
