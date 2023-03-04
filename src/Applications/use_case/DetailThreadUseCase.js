const DetailThread = require('../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../Domains/reply/entities/DetailReply');

class DetailThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = new DetailThread(useCasePayload);

    await this._threadRepository.checkAvailabilityThread(threadId);
    const detailThread = await this._threadRepository.getDetailThread(threadId);
    const getCommentThread = await this._commentRepository.getCommentThread(threadId);
    const getRepliesComment = await this._replyRepository.getReply(threadId);

    detailThread.comments = getCommentThread.map((comment) => {
      // eslint-disable-next-line max-len
      comment.replies = getRepliesComment.filter((filtered) => filtered.commentId === comment.id).map((reply) => new DetailReply(reply));
      return new DetailComment(comment);
    });

    return {
      thread: detailThread,
    };
  }
}

module.exports = DetailThreadUseCase;
