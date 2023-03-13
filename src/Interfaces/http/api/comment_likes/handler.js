const AddCommentLikeUseCase = require('../../../../Applications/use_case/AddCommentLikeUseCase');

class CommentLikesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeCommentHandler = this.putLikeCommentHandler.bind(this);
  }

  async putLikeCommentHandler(request, h) {
    const addCommentLikeUseCase = this._container.getInstance(AddCommentLikeUseCase.name);
    const { threadId, commentId } = request.params;
    const { id: userId } = request.auth.credentials;

    const payload = {
      userId, threadId, commentId,
    };

    await addCommentLikeUseCase.execute(payload);

    return {
      status: 'success',
    };
  }
}
module.exports = CommentLikesHandler;
