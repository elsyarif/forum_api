const AddReply = require('../AddReply');

describe('a AddReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'sebuah balasan comment',
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: 'sebuah balasan comment',
      owner: 123,
      commentId: 1234,
      threadId: 321,
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create reply object correctly', () => {
    const payload = {
      content: 'sebuah balasan comment',
      owner: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const reply = new AddReply(payload);

    expect(reply.content).toEqual(payload.content);
    expect(reply.owner).toEqual(payload.owner);
    expect(reply.commentId).toEqual(payload.commentId);
    expect(reply.threadId).toEqual(payload.threadId);
  });
});
