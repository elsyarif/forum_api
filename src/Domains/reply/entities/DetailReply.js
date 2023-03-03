class DetailReply {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.is_deleted ? '**balasan telah dihapus**' : payload.content;
    this.date = payload.date;
    this.username = payload.username;
  }

  _verifyPayload(payload) {
    const {
      id, content, date, username, commentId,
    } = payload;

    if (!id || !content || !date || !username || !commentId) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof date !== 'string' || typeof username !== 'string' || typeof commentId !== 'string') {
      throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
module.exports = DetailReply;
