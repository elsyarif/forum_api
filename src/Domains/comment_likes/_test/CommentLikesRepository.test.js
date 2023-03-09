const CommentLikesRepository = require('../CommentLikesRepository');

describe('a CommentLikesRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const commentLikesRepository = new CommentLikesRepository();

    await expect(commentLikesRepository.addCommentLike()).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentLikesRepository.getCommentLike()).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentLikesRepository.deleteCommentLike()).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentLikesRepository.getCountOfCommentLike()).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentLikesRepository.checkCommentLike()).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
