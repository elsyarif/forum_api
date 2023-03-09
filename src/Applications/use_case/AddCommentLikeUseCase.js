const AddLike = require('../../Domains/comment_likes/entities/AddLike');

class AddCommentLikeUseCase {
  constructor({ commentLikesRepository, threadRepository, commentRepository }) {
    this._commentLikesRepository = commentLikesRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const addLike = new AddLike(useCasePayload);

    await this._threadRepository.checkAvailabilityThread(useCasePayload.threadId);
    await this._commentRepository.checkAvailabilityComment(useCasePayload.commentId);
    const isLiked = await this._commentLikesRepository
      .checkCommentLike(useCasePayload.commentId, useCasePayload.userId);

    if (!isLiked) {
      await this._commentLikesRepository.addCommentLike(addLike);
    }
    return this._commentLikesRepository
      .deleteCommentLike(useCasePayload.commentId, useCasePayload.userId);
  }
}

module.exports = AddCommentLikeUseCase;
