import {Router} from 'express'
import * as projectController from '../controllers/project.controller.js'
import {projectValidationRule} from '../middleware/validation-middleWare.js'
import authValidate from '../middleware/auth.middleWare.js'

const router = Router();

router.post('/create',projectValidationRule,authValidate,projectController.createProjectController)

export default router;