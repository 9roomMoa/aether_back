const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const taskUtils = require('../utils/task-util');

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

exports.getAllTasks = async (project) => {
  try {
    const existingProject = await Project.findById(project);
    if (!existingProject) {
      throw new Error('Invalid Project ID');
    }
    const task = await Task.find({ project: project });

    return task;
  } catch (err) {
    console.error(err);
    throw new Error('Error during getting tasks');
  }
};

exports.getTaskInfo = async (tid, userId) => {
  try {
    const existingTask = await Task.findById(tid).lean();
    if (!existingTask) {
      throw new Error('Invalid Task ID');
    }
    const creator = await User.findById(existingTask.createdBy);

    const isAcceptable = await taskUtils.scopeChecker(userId, existingTask);

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
