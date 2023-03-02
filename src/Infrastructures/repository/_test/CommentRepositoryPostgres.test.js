const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'syarif' }); // user-thread
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'hidayatulloh' }); // user-comment
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah title thread',
        body: 'sebuah body thread',
        date: new Date(),
        ownerId: 'user-123',
      });

      const addComment = new AddComment({
        content: 'sebuah content comment',
        threadId: 'thread-123',
        owner: 'user-321',
      });

      const fakeIdGenerator = () => 123;
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      const comment = await CommentTableTestHelper.findCommentById('comment-123');
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'sebuah content comment',
        owner: 'user-321',
      }));
      expect(comment).toHaveLength(1);
    });
  });

  describe('checkAvailabilityComment function', () => {
    it('should throw NotFoundError when comment not available', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(() => commentRepositoryPostgres.checkAvailabilityComment('comment-123')).rejects.toThrowError(NotFoundError);
    });
  });
});
