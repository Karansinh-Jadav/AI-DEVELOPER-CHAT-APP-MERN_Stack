import {Router} from 'express'
import * as projectController from '../controllers/project.controller.js'
import {projectValidationRule,userArrayValidation} from '../middleware/validation-middleWare.js'
import authValidate from '../middleware/auth.middleWare.js'

const router = Router();

router.post('/create',projectValidationRule,authValidate,projectController.createProjectController)

router.get('/all',authValidate,projectController.getAllProject)

router.get('/get-project/:projectId',authValidate,projectController.getProject)


router.put('/add-user',userArrayValidation,authValidate,projectController.addUserToProject)

export default router;