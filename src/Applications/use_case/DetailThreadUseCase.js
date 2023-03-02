const DetailThread = require('../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../Domains/comments/entities/DetailComment');

class DetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = new DetailThread(useCasePayload);

    await this._threadRepository.checkAvailabilityThread(threadId);
    const detailThread = await this._threadRepository.getDetailThread(threadId);
    const getCommentThread = await this._commentRepository.getCommentThread(threadId);

    detailThread.comments = getCommentThread.map((comment) => new DetailComment(comment));

    return {
      thread: detailThread,
    };
  }
}

module.exports = DetailThreadUseCase;
