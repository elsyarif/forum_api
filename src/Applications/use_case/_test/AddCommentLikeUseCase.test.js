const AddLike = require('../../../Domains/comment_likes/entities/AddLike');
const AddedLike = require('../../../Domains/comment_likes/entities/AddedLike');
const CommentLikesRepository = require('../../../Domains/comment_likes/CommentLikesRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentLikeUseCase = require('../AddCommentLikeUseCase');

describe('AddCommentLikeUseCase', () => {
  it('should orchestrating the add like comment action correctly', async () => {
    // arrange
    const useCasePayload = {
      id: 'comment-like-123',
      commentId: 'comment-123',
      userId: 'user-123',
      threadId: 'thread-123',
    };

    const expected = new AddedLike({
      id: 'comment-like-123',
      commentId: 'comment-123',
      userId: 'user-123',
    });

    /** creating dependency of use case */
    const mockCommentLikesRepository = new CommentLikesRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest.fn(() => Promise.resolve());

    mockCommentLikesRepository.checkCommentLike = jest.fn(() => Promise.resolve(false));
    mockCommentLikesRepository.addCommentLike = jest.fn(() => Promise.resolve(expected));
    mockCommentLikesRepository.deleteCommentLike = jest.fn(() => Promise.resolve(expected));

    /** creating use case instance */
    const addCommentLikeUseCase = new AddCommentLikeUseCase({
      commentLikesRepository: mockCommentLikesRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // action
    const addedCommentLike = await addCommentLikeUseCase.execute(useCasePayload);

    // assert
    expect(addedCommentLike).toStrictEqual(expected);
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentLikesRepository.checkCommentLike)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
    expect(mockCommentLikesRepository.addCommentLike).toBeCalledWith(new AddLike(useCasePayload));
  });

  it('should orchestrating the delete like comment action correctly', async () => {
    // arrange
    const useCasePayload = {
      id: 'comment-like-123',
      commentId: 'comment-123',
      userId: 'user-123',
      threadId: 'thread-123',
    };

    const expected = new AddedLike({
      id: 'comment-like-123',
      commentId: 'comment-123',
      userId: 'user-123',
    });

    /** creating dependency of use case */
    const mockCommentLikesRepository = new CommentLikesRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest.fn(() => Promise.resolve());

    mockCommentLikesRepository.checkCommentLike = jest.fn(() => Promise.resolve(true));
    mockCommentLikesRepository.deleteCommentLike = jest.fn(() => Promise.resolve(expected));

    /** creating use case instance */
    const addCommentLikeUseCase = new AddCommentLikeUseCase({
      commentLikesRepository: mockCommentLikesRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // action
    const addedCommentLike = await addCommentLikeUseCase.execute(useCasePayload);

    // assert
    expect(addedCommentLike).toStrictEqual(expected);
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentLikesRepository.checkCommentLike)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
    expect(mockCommentLikesRepository.deleteCommentLike)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
  });
});
