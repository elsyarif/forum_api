class AddLike {
  constructor(payload) {
    this._verifyPayload(payload);

    this.userId = payload.userId;
    this.commentId = payload.commentId;
    this.threadId = payload.threadId;
  }

  _verifyPayload(payload) {
    const { userId, commentId, threadId } = payload;

    if (!userId || !commentId || !threadId) {
      throw new Error('ADD_LIKES.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof userId !== 'string' || typeof commentId !== 'string' || typeof threadId !== 'string') {
      throw new Error('ADD_LIKES.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddLike;
