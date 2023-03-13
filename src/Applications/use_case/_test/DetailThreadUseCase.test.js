const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/reply/ReplyRepository');
const DetailThreadUseCase = require('../DetailThreadUseCase');
const CommentLikesRepository = require('../../../Domains/comment_likes/CommentLikesRepository');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/reply/entities/DetailReply');

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

    const useCaseReply = [
      {
        id: 'reply-123',
        username: 'dicoding',
        date: '2023-03-10T14:59:45.880Z',
        content: 'sebuah reply content',
        commentId: 'comment-123',
        is_deleted: false,
      },
      {
        id: 'reply-123',
        username: 'dicoding',
        date: '2023-03-10T14:59:45.880Z',
        content: 'sebuah reply content',
        commentId: 'comment-123',
        is_deleted: true,
      },
    ];

    const useCaseCommentLike = [
      {
        id: 'comment-like-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-123',
      },
      {
        id: 'comment-like-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-321',
      },
    ];

    const expectThread = {
      id: useCaseThread.id,
      title: useCaseThread.title,
      body: useCaseThread.body,
      date: useCaseThread.date,
      username: useCaseThread.username,
      comments: useCaseComment.map((comment) => new DetailComment({
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.content,
        is_deleted: comment.is_deleted,
        likeCount: useCaseCommentLike.filter((like) => like.commentId === comment.id).length,
        replies: useCaseReply.filter((r) => r.commentId === comment.id).map((r) => new DetailReply({
          id: r.id,
          username: r.username,
          date: r.date,
          content: r.content,
          commentId: r.commentId,
          is_deleted: r.is_deleted,
        })),
      })),
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentLikesRepository = new CommentLikesRepository();

    mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
    mockThreadRepository.getDetailThread = jest.fn(() => Promise.resolve(useCaseThread));
    mockCommentRepository.getCommentThread = jest.fn(() => Promise.resolve(useCaseComment));
    mockReplyRepository.getReply = jest.fn(() => Promise.resolve(useCaseReply));
    mockCommentLikesRepository.getCountOfCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve(useCaseCommentLike));

    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      commentLikesRepository: mockCommentLikesRepository,
    });

    const detailThread = await detailThreadUseCase.execute(useCasePayload);

    expect(mockThreadRepository.getDetailThread)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentThread)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getReply)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentLikesRepository.getCountOfCommentLike)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(detailThread.thread.id).toEqual(expectThread.id);
    expect(detailThread.thread.title).toEqual(expectThread.title);
    expect(detailThread.thread.body).toEqual(expectThread.body);
    expect(detailThread.thread.username).toEqual(expectThread.username);
    expect(detailThread.thread.comments).toEqual(expectThread.comments);
  });
});
