class AddedComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.content;
    this.threadId = payload.threadId;
    this.owner = payload.owner;
  }

  _verifyPayload(payload) {
    const {
      id, content, threadId, owner,
    } = payload;

    if (!id || !content || !threadId || !owner) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof threadId !== 'string' || typeof owner !== 'string') {
      throw new Error('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedComment;
