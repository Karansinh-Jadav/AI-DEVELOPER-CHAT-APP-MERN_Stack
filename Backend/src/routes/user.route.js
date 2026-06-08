import {Router} from 'express'
import * as userController from '../controllers/user.controller.js'
import {registerUserValidationRule} from '../middleware/validation-middleWare.js'
import authVAlidate from '../middleware/auth.middleWare.js'

const router = Router();

router.post('/register',registerUserValidationRule,userController.createUserController);

router.post('/login',registerUserValidationRule,userController.loginController);

router.get('/profile',authVAlidate,userController.profileController);

export default router;