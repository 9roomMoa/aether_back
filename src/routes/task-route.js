const express = require('express');
const router = express.Router();

const taskController = require('../controllers/task-controller');
const commentController = require('../controllers/comment-controller');

router.post('/', taskController.createTask);

router.get('/', taskController.getAllTasks);

router.delete('/', taskController.deleteTask);

router.get('/:tid/info', taskController.getTaskInfo);

router.post('/:tid/comments', commentController.createComment);

router.get('/:tid/comments', commentController.getComments);

router.delete('/:tid/comments', commentController.deleteComment);

router.get('/:tid/comments/search', taskController.searchComments);

router.get('/:tid/managers', taskController.getManagerInfo);

router.post('/:tid/managers', taskController.addManagers);

module.exports = router;
