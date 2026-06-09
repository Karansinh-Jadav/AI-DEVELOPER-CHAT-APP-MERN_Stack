import {Router} from 'express'
import * as userController from '../controllers/user.controller.js'
import {registerUserValidationRule} from '../middleware/validation-middleWare.js'
import authValidate from '../middleware/auth.middleWare.js'

const router = Router();

router.post('/register',registerUserValidationRule,userController.createUserController);

router.post('/login',registerUserValidationRule,userController.loginController);

router.get('/profile',authValidate,userController.profileController);

router.get('/logout',authValidate,userController.logoutController);


export default router;