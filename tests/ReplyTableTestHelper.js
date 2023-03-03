/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ReplyTableTestHelper = {
  async addReply({
    id = 'reply-123',
    content = 'sebuah reply content',
    date = new Date().toISOString(),
    owner = 'user-123',
    commentId = 'comment-123',
    threadId = 'thread-123',
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [id, content, owner, date, false, commentId, threadId],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async checkIsDeletedReplyById(id) {
    const query = {
      text: 'SELECT is_deleted FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0].is_deleted;
  },

  async deleteReply(id) {
    const query = {
      text: 'UPDATE replies SET is_deleted = TRUE WHERE id = $1',
      values: [id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = ReplyTableTestHelper;
