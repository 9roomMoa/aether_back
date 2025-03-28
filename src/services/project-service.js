const Project = require('../models/Project');
const taskUtil = require('../utils/task-util');

exports.createProject = async (data) => {
  try {
    if (data.members && !Array.isArray(data.members)) {
      data.members = [data.members];
    }
    const result = await Project.create(data);

    return result;
  } catch (err) {
    console.error(err);
    throw new Error('Error occured during creating a project');
  }
};

exports.patchProject = async (pid, userId, data) => {
  try {
    const isExistingProject = await taskUtil.isExistingResource(Project, pid);
    if (!isExistingProject) {
      throw new Error('No project found');
    }
    if (!(await taskUtil.isProjectCreator(userId, isExistingProject))) {
      throw new Error('you dont have privilege to update this project');
    }
    if (
      taskUtil.isInvalidDateRange(
        data?.startDate || isExistingProject.startDate,
        data?.dueDate || isExistingProject.dueDate
      )
    ) {
      throw new Error('date data are invalidate');
    }
    const updatedProject = await Project.findByIdAndUpdate(
      pid,
      {
        $set: data,
      },
      { new: true, runValidators: true }
    );

    return updatedProject;
  } catch (err) {
    console.error(err);
    throw new Error('Error occured during updating a project');
  }
};
