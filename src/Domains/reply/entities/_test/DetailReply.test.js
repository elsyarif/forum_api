const DetailReply = require('../DetailReply');

describe('a DetailReply entities', () => {
  it('shoult throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      content: 123,
      date: 123,
      username: 123,
      is_deleted: 123,
      commentId: 123,
    };

    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should deleted property correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'sebuah balasan comment yang telah dihapus',
      date: '2023-03-02T07:56:29.033Z',
      username: 'syarif',
      is_deleted: true,
      commentId: 'comment-123',
    };

    const reply = new DetailReply(payload);

    const expectedReply = {
      id: 'reply-123',
      content: '**balasan telah dihapus**',
      date: '2023-03-02T07:56:29.033Z',
      username: 'syarif',
    };

    expect(reply).toEqual(expectedReply);
  });

  it('should create DetailedReply object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'sebuah balasan comment',
      date: '2023-03-02T07:56:29.033Z',
      username: 'syarif',
      is_deleted: false,
      commentId: 'comment-123',
    };

    const reply = new DetailReply(payload);

    const expectedReply = {
      id: 'reply-123',
      content: 'sebuah balasan comment',
      date: '2023-03-02T07:56:29.033Z',
      username: 'syarif',
    };

    expect(reply).toEqual(expectedReply);
  });
});
