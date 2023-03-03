const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddReply = require('../../../Domains/reply/entities/AddReply');
const AddedReply = require('../../../Domains/reply/entities/AddedReply');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await ReplyTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply and return added reply correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'syarif' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah title thread',
        body: 'sebuah body thread',
        date: new Date(),
        ownerId: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const addReply = new AddReply({
        content: 'sebuan reply comment',
        owner: 'user-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
      });

      const fakeIdGnerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGnerator);

      const addedReply = await replyRepositoryPostgres.addReply(addReply);

      const reply = await ReplyTableTestHelper.findReplyById('reply-123');
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'sebuan reply comment',
        owner: 'user-123',
      }));
      expect(reply).toHaveLength(1);
    });
  });

  describe('checkAvailabilityReply function', () => {
    it('should throw NotFoundError when reply not available', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.checkAvailabilityReply('reply-123')).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when reply not owned by user', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'syarif' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah title thread',
        body: 'sebuah body thread',
        date: new Date(),
        ownerId: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const fakeIdGnerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGnerator);

      const addReply = new AddReply({
        content: 'sebuan reply comment',
        owner: 'user-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
      });

      await replyRepositoryPostgres.addReply(addReply);

      await expect(replyRepositoryPostgres.checkAvailabilityReply('reply-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError when reply not owned by user', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'syarif' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah title thread',
        body: 'sebuah body thread',
        date: new Date(),
        ownerId: 'user-123',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      await ReplyTableTestHelper.addReply({
        id: 'reply-123',
        content: 'sebuan reply comment',
        owner: 'user-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwner('xxx', 'user-123'))
        .rejects.toThrowError(AuthorizationError);
    });
  });

  describe('deleteReply function', () => {
    it('should delete reply from database', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'syarif' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah title thread',
        body: 'sebuah body thread',
        date: new Date(),
        ownerId: 'user-123',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      await ReplyTableTestHelper.addReply({
        id: 'reply-123',
        content: 'sebuan reply comment',
        owner: 'user-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await replyRepositoryPostgres.deleteReply('reply-123');

      const reply = await ReplyTableTestHelper.checkIsDeletedReplyById('reply-123');
      expect(reply).toEqual(true);
    });
  });

  describe('getCommentReplies function', () => {
    it('should return replies correctly', async () => {
      const userPayload = { id: 'user-123', username: 'syarif' };
      const threadPayload = {
        id: 'thread-123',
        title: 'sebuan thread title',
        body: 'sebuan thread body',
        owner: 'user-123',
      };
      const commentPayload = {
        id: 'comment-123',
        content: 'sebuan comment',
        owner: 'user-123',
        threadId: 'thread-123',
      };
      const replyPayload = {
        id: 'reply-123',
        content: 'sebuan reply comment',
        owner: 'user-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
      };

      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThread(threadPayload);
      await CommentsTableTestHelper.addComment(commentPayload);
      await ReplyTableTestHelper.addReply(replyPayload);

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const replies = await replyRepositoryPostgres.getCommentReplies('comment-123');
      expect(Array.isArray(replies)).toBe(true);
      expect(replies).toHaveLength(1);
    });
  });

  describe('getReply functiom', () => {
    it('should return replies correctly', async () => {
      const userPayload = { id: 'user-123', username: 'syarif' };
      const threadPayload = {
        id: 'thread-123',
        title: 'sebuan thread title',
        body: 'sebuan thread body',
        owner: 'user-123',
      };
      const commentPayload = {
        id: 'comment-123',
        content: 'sebuan comment',
        owner: 'user-123',
        threadId: 'thread-123',
      };
      const replyPayload = {
        id: 'reply-123',
        content: 'sebuan reply comment',
        owner: 'user-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
      };

      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThread(threadPayload);
      await CommentsTableTestHelper.addComment(commentPayload);
      await ReplyTableTestHelper.addReply(replyPayload);

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const replies = await replyRepositoryPostgres.getReply('thread-123');
      expect(Array.isArray(replies)).toBe(true);
      expect(replies).toHaveLength(1);
    });
  });
});
