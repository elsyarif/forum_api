const CommentLikesRepository = require('../../Domains/comment_likes/CommentLikesRepository');
const AddedLike = require('../../Domains/comment_likes/entities/AddedLike');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class CommentLikesRepositoryPostgres extends CommentLikesRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addCommentLike(addedCommentLike) {
    const { userId, commentId, threadId } = addedCommentLike;
    const id = `comment-like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3, $4) RETURNING id, user_id as "userId", comment_id as "commentId"',
      values: [id, userId, threadId, commentId],
    };

    const result = await this._pool.query(query);
    return new AddedLike(result.rows[0]);
  }

  async deleteCommentLike(commentId, userId) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2 RETURNING id',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('tidak ada like yang ditemukan pada comment ini');
    }
  }

  async getCountOfCommentLike(threadId) {
    const query = {
      text: 'SELECT id, user_id as "userId", comment_id as "commentId", thread_id as "threadId" FROM comment_likes WHERE thread_id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async checkCommentLike(commentId, userId) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    const result = await this._pool.query(query);

    return result.rowCount;
  }
}

module.exports = CommentLikesRepositoryPostgres;
