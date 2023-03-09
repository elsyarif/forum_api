class AddedLike {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.userId = payload.userId;
    this.commentId = payload.commentId;
  }

  _verifyPayload(payload) {
    const { id, userId, commentId } = payload;

    if (!id || !userId || !commentId) {
      throw new Error('ADDED_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof userId !== 'string' || typeof commentId !== 'string') {
      throw new Error('ADDED_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedLike;
