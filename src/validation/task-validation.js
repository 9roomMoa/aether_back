const Joi = require('joi');

exports.creatingSchema = Joi.object({
  // userId: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.string().valid('To Do', 'In Progress', 'Done').default('To Do'),
  priority: Joi.number().integer().min(1).max(5).default(5),
  project: Joi.string().required(), // 프로젝트 ID
  assignedTo: Joi.array().items(Joi.string()).optional(), // 사용자 ID
  // createdBy: Joi.string().required(), // 생성자 ID
  projectScope: Joi.string().valid('Public', 'Restricted').default('Public'),
  startDate: Joi.date(),
  dueDate: Joi.date(),
});

//상태, 공개여부, 일정, 우선선위
exports.updatingSchema = Joi.object({
  status: Joi.string().valid('To Do', 'In Progress', 'Done').optional(),
  priority: Joi.number().integer().min(1).max(5).optional(),
  startDate: Joi.date().optional(),
  dueDate: Joi.date().optional(),
  projectScope: Joi.string().valid('Public', 'Restricted').optional(),
}).min(1);
