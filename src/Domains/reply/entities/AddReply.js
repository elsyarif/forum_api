class AddReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      content, owner, commentId, threadId,
    } = payload;

    this.content = content;
    this.owner = owner;
    this.commentId = commentId;
    this.threadId = threadId;
  }

  _verifyPayload(payload) {
    const {
      content, owner, commentId, threadId,
    } = payload;

    if (!content || !owner || !commentId || !threadId) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof owner !== 'string' || typeof commentId !== 'string' || typeof threadId !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReply;
