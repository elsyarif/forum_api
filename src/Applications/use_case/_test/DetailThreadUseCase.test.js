const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/reply/ReplyRepository');
const DetailThreadUseCase = require('../DetailThreadUseCase');

describe('DetailThreadUseCase', () => {
  it('should orchestrating the detail thread action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const useCaseThread = {
      id: 'thread-123',
      title: 'sebuah title thread',
      body: 'sebuah body thread',
      username: 'syarif',
      date: '2023-03-02T14:51:45.880Z',
    };

    const useCaseComment = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2023-03-02T14:54:45.880Z',
        content: 'sebuah comment content',
        is_deleted: false,
      },
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2023-03-02T14:59:45.880Z',
        content: 'sebuah comment content',
        is_deleted: true,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
    mockThreadRepository.getDetailThread = jest.fn()
      .mockImplementation(() => Promise.resolve(useCaseThread));
    mockCommentRepository.getCommentThread = jest.fn()
      .mockImplementation(() => Promise.resolve(useCaseComment));
    mockReplyRepository.getReply = jest.fn()
      .mockImplementation(() => Promise.resolve([]));

    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const expectedThread = {
      id: 'thread-123',
      title: 'sebuah title thread',
      body: 'sebuah body thread',
      username: 'syarif',
      date: '2023-03-02T14:51:45.880Z',
    };

    const expectedComment = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2023-03-02T14:54:45.880Z',
        content: 'sebuah comment content',
      },
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2023-03-02T14:59:45.880Z',
        content: '**komentar telah dihapus**',
      },
    ];

    const detailThread = await detailThreadUseCase.execute(useCasePayload);

    expect(mockThreadRepository.getDetailThread)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentThread)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(detailThread.thread.id).toEqual(expectedThread.id);
    expect(detailThread.thread.title).toEqual(expectedThread.title);
    expect(detailThread.thread.body).toEqual(expectedThread.body);
    expect(detailThread.thread.username).toEqual(expectedThread.username);
    expect(detailThread.thread.comments).toEqual(expectedComment);
  });
});
