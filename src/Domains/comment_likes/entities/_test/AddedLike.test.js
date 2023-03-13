const AddedLike = require('../AddedLike');

describe('a AddedLike entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new AddedLike(payload)).toThrowError('ADDED_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      userId: 123,
      commentId: 123,
    };

    expect(() => new AddedLike(payload)).toThrowError('ADDED_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment object correctly', () => {
    const payload = {
      id: 'comment-like-123',
      userId: 'user-123',
      commentId: 'comment-123',
    };

    const { id, userId, commentId } = new AddedLike(payload);

    expect(id).toEqual(payload.id);
    expect(userId).toEqual(payload.userId);
    expect(commentId).toEqual(payload.commentId);
  });
});
