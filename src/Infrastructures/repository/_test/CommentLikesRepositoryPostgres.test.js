const pool = require('../../database/postgres/pool');
const CommentLikesRepositoryPostgres = require('../CommentLikesRepositoryPostgres');
const CommentLikeTableTestHelper = require('../../../../tests/CommentLikeTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddLike = require('../../../Domains/comment_likes/entities/AddLike');
const AddedLike = require('../../../Domains/comment_likes/entities/AddedLike');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentLikesRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentLikeTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addCommentLike function', () => {
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

      await CommentTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah content comment',
        threadId: 'thread-123',
        owner: 'user-321',
        isDeleted: false,
      });

      const addCommentLike = new AddLike({
        userId: 'user-321',
        commentId: 'comment-123',
        threadId: 'thread-123',
      });

      const fakeIdGenerator = () => 123;
      const LikesRepositoryPostgres = new CommentLikesRepositoryPostgres(pool, fakeIdGenerator);

      const addedCommentLike = await LikesRepositoryPostgres.addCommentLike(addCommentLike);

      const commentLike = await CommentLikeTableTestHelper.findCommentLikeById('comment-like-123');
      expect(addedCommentLike).toStrictEqual(new AddedLike({
        id: 'comment-like-123',
        commentId: 'comment-123',
        userId: 'user-321',
      }));
      expect(commentLike).toHaveLength(1);
    });
  });

  describe('deleteCommentLike function', () => {
    it('should throw NotFoundError when like comment not found', async () => {
      const likesRepositoryPostgres = new CommentLikesRepositoryPostgres(pool, {});
      const commentLikeId = 'comment-like-123';
      const userId = 'user-123';

      await expect(likesRepositoryPostgres.deleteCommentLike(commentLikeId, userId))
        .rejects.toThrowError(NotFoundError);
    });

    it('should delete liked comment from database', async () => {
      const likesRepositoryPostgres = new CommentLikesRepositoryPostgres(pool, {});
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
        content: 'sebuah content comment',
        threadId: 'thread-123',
        owner: 'user-321',
        isDeleted: false,
      });

      await CommentLikeTableTestHelper.addCommentLike({
        id: 'comment-like-123',
        userId: 'user-321',
        commentId: 'comment-123',
        threadId: 'thread-123',
      });

      await likesRepositoryPostgres.deleteCommentLike('comment-123', 'user-321');
      const commentLike = await CommentLikeTableTestHelper.findCommentLikeById('comment-like-123');

      expect(commentLike).toHaveLength(0);
    });
  });

  describe('getCountOfCommentLike function', () => {
    it('should return number of liked comments', async () => {
      const likesRepositoryPostgres = new CommentLikesRepositoryPostgres(pool, {});
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
        content: 'sebuah content comment',
        threadId: 'thread-123',
        owner: 'user-321',
        isDeleted: false,
      });

      await CommentLikeTableTestHelper.addCommentLike({
        id: 'comment-like-123',
        userId: 'user-321',
        commentId: 'comment-123',
        threadId: 'thread-123',
      });

      const expectedLikes = [
        {
          id: 'comment-like-123',
          userId: 'user-321',
          commentId: 'comment-123',
          threadId: 'thread-123',
        },
      ];

      const countLike = await likesRepositoryPostgres.getCountOfCommentLike('thread-123');
      expect(countLike).toEqual(expectedLikes);
    });
  });

  describe('checkCommentLike function', () => {
    it('should return true when comment is liked', async () => {
      const likesRepositoryPostgres = new CommentLikesRepositoryPostgres(pool, {});
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
        content: 'sebuah content comment',
        threadId: 'thread-123',
        owner: 'user-321',
        isDeleted: false,
      });

      await CommentLikeTableTestHelper.addCommentLike({
        id: 'comment-like-123',
        userId: 'user-321',
        commentId: 'comment-123',
        threadId: 'thread-123',
      });

      const isLiked = await likesRepositoryPostgres.checkCommentLike('comment-123', 'user-321');
      expect(isLiked).toEqual(1);
    });
  });
});
