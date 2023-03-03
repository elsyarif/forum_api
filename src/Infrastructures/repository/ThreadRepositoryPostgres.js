const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(payload) {
    const { title, body, owner } = payload;
    const id = `thread-${this._idGenerator()}`;
    const createDate = new Date();

    const query = {
      text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, createDate],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async checkAvailabilityThread(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async getDetailThread(threadId) {
    const query = {
      text: `SELECT * FROM threads A
      LEFT JOIN users B ON A.owner = B.id
      WHERE A.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
