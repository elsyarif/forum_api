const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../Domains/reply/entities/AddedReply');
const ReplyRepository = require('../../Domains/reply/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(addReply) {
    const {
      content, owner, commentId, threadId,
    } = addReply;

    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, content, owner, date, false, commentId, threadId],
    };

    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async checkAvailabilityReply(replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }
  }

  async verifyReplyOwner(replyId, owner) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND owner = $2',
      values: [replyId, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('anda tidak dapat menghapus balasan orang lain!');
    }
  }

  async deleteReply(replyId) {
    const query = {
      text: 'UPDATE replies SET is_deleted = $1 WHERE id = $2',
      values: [true, replyId],
    };

    await this._pool.query(query);
  }

  async getCommentReplies(commentId) {
    const query = {
      text: `SELECT A.id, A.content, A.date, B.username, A.is_deleted
      FROM replies A
      LEFT JOIN users B ON B.id = A.owner
      WHERE A.comment_id = $1
      ORDER BY A.date ASC`,
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getReply(threadId) {
    const query = {
      text: `SELECT A.id, A.content, A.date, C.username, A.is_deleted, A.comment_id AS "commentId"
      FROM replies A
      INNER JOIN threads B ON A.thread_id = B.id
      LEFT JOIN users C ON C.id = A.owner
      WHERE A.thread_id = $1
      ORDER BY A.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = ReplyRepositoryPostgres;
