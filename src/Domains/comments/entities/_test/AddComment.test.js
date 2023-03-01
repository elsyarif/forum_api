const AddComment = require('../AddComment');

describe('a AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'comment content',
      threadId: 'thread-123',
    };

    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: {},
      threadId: 'thread-123',
      owner: 'user-321',
    };

    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment object correctly', () => {
    const payload = {
      content: 'comment thread content',
      threadId: 'thread-123',
      owner: 'user-321',
    };

    const comment = new AddComment(payload);

    expect(comment.content).toEqual(payload.content);
    expect(comment.threadId).toEqual(payload.threadId);
    expect(comment.owner).toEqual(payload.owner);
  });
});
