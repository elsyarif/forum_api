const AddReply = require('../../Domains/reply/entities/AddReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addReply = new AddReply(useCasePayload);
    await this._threadRepository.checkAvailabilityThread(addReply.threadId);
    await this._commentRepository.checkAvailabilityComment(addReply.commentId);
    return this._replyRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;
