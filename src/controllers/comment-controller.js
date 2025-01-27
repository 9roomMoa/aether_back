const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');
const commentService = require('../services/comment-service');

const commentValidationSchema = Joi.object({
  commenterId: Joi.string().required(),
  content: Joi.string().required(),
  parentId: Joi.string().optional(),
});

exports.createComment = async (req, res) => {
  try {
    const { tid } = req.params;
    const { error, value } = commentValidationSchema.validate(req.body);

    if (!tid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'TaskID omitted',
      });
    }

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid input data, ' + error.details,
      });
    }

    const commentData = { taskId: tid, ...value };

    const comment = await commentService.createComment(commentData);

    return res.status(StatusCodes.CREATED).json({
      data: comment,
      success: true,
      message: 'comment created successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal Server Error: ' + err.message,
    });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { tid } = req.params;
    const { userId } = req.body;

    if (!userId || !tid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'taskId and userId must be required',
      });
    }

    const comments = await commentService.getComments(userId, tid);

    return res.status(StatusCodes.OK).json({
      data: comments,
      success: true,
      message: 'Retrieved comments successfully',
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error: ' + err.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { tid } = req.params;
    const { userId, commentId } = req.body;

    if (!tid || !userId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'taskId and userId must be required',
      });
    }

    const result = await commentService.deleteComment(userId, tid, commentId);

    return res.status(StatusCodes.OK).json({
      data: result,
      success: true,
      message: 'comment deleted successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error: ' + err.message,
    });
  }
};
