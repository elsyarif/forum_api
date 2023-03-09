const createServer = require('../createServer');

describe('when GET /', () => {
  it('should return 200 and Hello World', async () => {
    // arrange
    const server = await createServer({});

    // action
    const response = await server.inject({
      method: 'GET',
      url: '/',
    });

    // assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(200);
    expect(responseJson.value).toEqual('Hello World!');
  });
});
