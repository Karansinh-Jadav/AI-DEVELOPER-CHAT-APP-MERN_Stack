import {Router} from 'express'
import {getResult} from '../controllers/ai.controller.js'
import authValidate from '../middleware/auth.middleWare.js'

const router = Router();

router.get('/get-result', authValidate, getResult)

export default router