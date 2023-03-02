const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return posted thread correctly', async () => {
      // arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'syarif',
        password: 'secret',
        fullname: 'syarif',
      });

      const addThread = new AddThread({
        title: 'sebuah thread title',
        body: 'sebuah thread body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');

      expect(threads).toHaveLength(1);
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'sebuah thread title',
        owner: 'user-123',
      }));
      expect(threads).toHaveLength(1);
    });
  });

  describe('checkAvailabilityThread', () => {
    it('should throw NotFoundError if thread not available', async () => {
      // arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const threadId = 'xxx';

      // action and assert
      await expect(threadRepositoryPostgres.checkAvailabilityThread(threadId))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError if thread available', async () => {
      // arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', body: 'sebuah thread', ownerId: 'user-123' });

      // action and assert
      await expect(threadRepositoryPostgres.checkAvailabilityThread('thread-123'))
        .resolves.not.toThrow(NotFoundError);
    });
  });
});
