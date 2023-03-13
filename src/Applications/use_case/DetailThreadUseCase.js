const DetailThread = require('../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../Domains/reply/entities/DetailReply');

class DetailThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    commentLikesRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._commentLikesRepository = commentLikesRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = new DetailThread(useCasePayload);

    await this._threadRepository.checkAvailabilityThread(threadId);
    const detailThread = await this._threadRepository.getDetailThread(threadId);
    const getCommentThread = await this._commentRepository.getCommentThread(threadId);
    const getRepliesComment = await this._replyRepository.getReply(threadId);
    const getCountLike = await this._commentLikesRepository.getCountOfCommentLike(threadId);

    detailThread.comments = getCommentThread.map((comment) => {
      // eslint-disable-next-line max-len
      comment.replies = getRepliesComment.filter((filtered) => filtered.commentId === comment.id).map((reply) => new DetailReply(reply));
      comment.likeCount = getCountLike.filter((fil) => fil.commentId === comment.id).length;
      return new DetailComment(comment);
    });

    return {
      thread: detailThread,
    };
  }
}

module.exports = DetailThreadUseCase;
