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

    it('should not throw NotFoundError when comment available', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'syarif' }); // user-thread
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'hidayatulloh' }); // user-comment
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah title thread',
        body: 'sebuah body thread',
        date: new Date(),
        ownerId: 'user-123',
      });

      await CommentTableTestHelper.addComment({
        id: 'comment-123',
        content: 'dicoding',
        owner: 'user-321',
        threadId: 'thread-123',
      });

      await expect(commentRepositoryPostgres.checkAvailabilityComment('comment-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when comment owner not match', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'syarif' }); // user-thread
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'hidayatulloh' }); // user-comment

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah title thread',
        body: 'sebuah body thread',
        date: new Date(),
        ownerId: 'user-123',
      });

      await CommentTableTestHelper.addComment({
        id: 'comment-123',
        content: 'dicoding',
        owner: 'user-321',
        threadId: 'thread-123',
      });

      const commentId = 'comment-123';
      const owner = 'user-333';

      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, owner))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when comment owner match', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'syarif' }); // user-thread
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'hidayatulloh' }); // user-comment

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah title thread',
        body: 'sebuah body thread',
        date: new Date(),
        ownerId: 'user-123',
      });

      await CommentTableTestHelper.addComment({
        id: 'comment-123',
        content: 'dicoding',
        owner: 'user-321',
        threadId: 'thread-123',
      });

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-321'))
        .resolves
        .not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment from database', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'syarif' }); // user-thread
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'hidayatulloh' }); // user-comment

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah title thread',
        body: 'sebuah body thread',
        date: new Date(),
        ownerId: 'user-123',
      });

      await CommentTableTestHelper.addComment({
        id: 'comment-123',
        content: 'dicoding',
        owner: 'user-321',
        threadId: 'thread-123',
      });

      await commentRepositoryPostgres.deleteComment('comment-123');

      const comment = await CommentTableTestHelper.checkIsDeletedCommentsById('comment-123');
      expect(comment).toEqual(true);
    });
  });

  describe('getCommentsThread function', () => {
    it('should get comments of thread', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'syarif' }); // user-thread
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'hidayatulloh' }); // user-comment

      const threadPayload = {
        id: 'thread-123',
        title: 'sebuah title thread',
        body: 'sebuah body thread',
        date: new Date(),
        ownerId: 'user-123',
      };

      await ThreadsTableTestHelper.addThread(threadPayload);

      const commentPayload = {
        id: 'comment-123',
        content: 'dicoding',
        owner: 'user-321',
        threadId: threadPayload.id,
        date: new Date(),
      };

      await CommentTableTestHelper.addComment(commentPayload);

      const comment = await commentRepositoryPostgres.getCommentThread('thread-123');

      expect(comment).toStrictEqual([
        {
          id: 'comment-123',
          content: 'dicoding',
          is_deleted: false,
          username: 'hidayatulloh',
          date: commentPayload.date,
        },
      ]);
    });
  });
});
