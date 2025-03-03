const { StatusCodes } = require('http-status-codes');
const memoService = require('../services/memo-service');
const memoValidation = require('../validation/memo-validation');

exports.createMemo = async (req, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'User ID Omission',
      });
    }
    const { error, value } = memoValidation.creatingSchema.validate(req.body);
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message:
          'Invalid input data' + error.details.map((d) => d.message).join(','),
      });
    }

    const result = await memoService.createMemo(userId, value);

    return res.status(StatusCodes.CREATED).json({
      data: result,
      success: true,
      message: 'Memo created successfully',
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error: ' + err.message,
    });
  }
};
