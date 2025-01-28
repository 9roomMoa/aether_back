const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const Comment = require('../models/Comment');
const taskUtil = require('../utils/task-util');

exports.createTask = async (taskData) => {
  try {
    const existingProject = await Project.findById(taskData.project);
    if (!existingProject) {
      throw new Error('Invalid Project ID');
    }
    const task = new Task(taskData);
    await task.save();

    return task;
  } catch (err) {
    console.error(err);
    throw new Error('Error occured during creating new task');
  }
};

exports.getTaskInfo = async (tid, userId) => {
  try {
    const existingTask = await Task.findById(tid).lean();
    if (!existingTask) {
      throw new Error('Invalid Task ID');
    }
    const creator = await User.findById(existingTask.createdBy);

    const isAcceptable = await taskUtil.scopeChecker(userId, existingTask);

    if (!isAcceptable) {
      throw new Error('User not includes in this task');
    }

    return {
      ...existingTask,
      creator: creator.name,
    };
  } catch (err) {
    console.error(err);
    throw new Error('Error occured during getting task information');
  }
};

exports.getAllTasks = async (project) => {
  try {
    const existingProject = await Project.findById(project);
    if (!existingProject) {
      throw new Error('Invalid Project ID');
    }
    const task = await Task.find({ project: project }).select(
      'title description status priority'
    );

    return task;
  } catch (err) {
    console.error(err);
    throw new Error('Error during getting tasks');
  }
};

exports.deleteTask = async (userId, taskId) => {
  try {
    const existingTask = await Task.findById(taskId);
    if (!existingTask) {
      throw new Error('Invalid Task ID');
    }
    const isCreator = taskUtil.isTaskCreator(userId, existingTask);
    if (!isCreator) {
      throw new Error('You dont have privilege to delete this task');
    }

    await Task.findByIdAndDelete(taskId);

    return { success: true, message: 'Task successfully deleted' };
  } catch (err) {
    console.error(err);
    throw new Error('Error occured during deleting a task');
  }
};

exports.getManagerInfo = async (userId, taskId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Invalid user id');
    }
    const existingTask = await Task.findById(taskId);
    const task = await Task.findById(taskId)
      .populate('createdBy assignedTo', 'name email')
      .lean();

    if (!task) {
      throw new Error('Invalid task id');
    }

    const isAccessible = await taskUtil.scopeChecker(userId, existingTask);

    if (!isAccessible) {
      throw new Error('You dont have privilege to get info');
    }

    const result = {
      createdBy: task.createdBy,
      assignedTo: task.assignedTo,
    };
    return result;
  } catch (err) {
    console.error(err);
    throw new Error('Error occured during getting Manager info');
  }
};

exports.addManagers = async (taskId, userId, managerId) => {
  try {
    const task = await taskUtil.isExisitingResource(Task, taskId);
    await taskUtil.isExisitingResource(User, userId);
    const isAccessible = await taskUtil.isTaskCreator(userId, task);
    if (!isAccessible) {
      throw new Error('You dont have privilege to add managers');
    }
    await taskUtil.isExisitingResource(User, managerId);

    const updatedTask = Task.findByIdAndUpdate(
      taskId,
      {
        $addToSet: { assignedTo: managerId },
      },
      { new: true }
    );

    return updatedTask;
  } catch (err) {
    console.error(err);
    throw new Error('Error occured during adding managers');
  }
};

exports.searchComments = async (keyword, taskId, userId) => {
  try {
    const task = await taskUtil.isExisitingResource(Task, taskId);

    const isAccessible = await taskUtil.scopeChecker(userId, task);
    if (!isAccessible) {
      throw new Error('You dont have privilege to access to comments');
    }
    console.log(keyword);
    const comments = await Comment.find({
      taskId: taskId,
      content: { $regex: keyword, $options: 'i' },
    });

    return comments;
  } catch (err) {
    console.error(err);
    throw new Error('error occured during searching comments');
  }
};
