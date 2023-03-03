const AddReply = require('../../../Domains/reply/entities/AddReply');
const AddedReply = require('../../../Domains/reply/entities/AddedReply');
const ReplyRepository = require('../../../Domains/reply/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      content: 'sebuah content comment',
      owner: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedReply));
    mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest.fn(() => Promise.resolve());

    const addCommentUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedReply = await addCommentUseCase.execute(useCasePayload);

    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockReplyRepository.addReply).toBeCalledWith(new AddReply(useCasePayload));
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.threadId);
  });
});
