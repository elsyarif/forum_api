const AddedComment = require('../AddedComment');

describe('a AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      owner: 'user-321',
      threadId: 'thread-123',
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 124,
      content: 'thread comment content',
      owner: 'user-321',
      threadId: 'thread-123',
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment object correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'thread comment content',
      owner: 'user-321',
      threadId: 'thread-123',
    };

    const comment = new AddedComment(payload);

    expect(comment.id).toEqual(payload.id);
    expect(comment.content).toEqual(payload.content);
    expect(comment.threadId).toEqual(payload.threadId);
    expect(comment.owner).toEqual(payload.owner);
  });
});
