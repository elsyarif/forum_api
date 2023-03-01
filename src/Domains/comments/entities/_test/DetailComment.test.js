const DetailComment = require('../DetailComment');

describe('a DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-123',
    };

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'comment-123',
      content: {},
      date: 80,
      username: 1234,
      is_deleted: true,
    };

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should delete peroperty correctly', () => {
    const payload = {
      id: 'comment-123',
      username: 'syarif',
      date: '2023-03-01T07:56:29.033Z',
      content: 'sebuah comment thread',
      is_deleted: true,
    };

    const comment = new DetailComment(payload);

    const expectedComment = {
      id: 'comment-123',
      username: 'syarif',
      date: '2023-03-01T07:56:29.033Z',
      content: '**komentar telah dihapus**',
    };

    expect(comment).toEqual(expectedComment);
  });

  it('should create DetailComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      username: 'syarif',
      date: '2023-03-01T07:56:29.033Z',
      content: 'sebuah comment thread',
      is_deleted: false,
    };

    const comment = new DetailComment(payload);

    const expectedComment = {
      id: 'comment-123',
      username: 'syarif',
      date: '2023-03-01T07:56:29.033Z',
      content: 'sebuah comment thread',
    };

    expect(comment).toEqual(expectedComment);
  });
});
