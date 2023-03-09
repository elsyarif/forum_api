class LikeCount {
  constructor(payload) {
    this._verifyPayload(payload);

    this.likeCount = payload.likeCount;
  }

  _verifyPayload(payload) {
    const likeCount = payload;

    if (!likeCount) {
      throw new Error('LIKE_COUNT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof likeCount !== 'number') {
      throw new Error('LIKE_COUNT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LikeCount;
