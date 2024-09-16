import express from 'express'
import {
    registerController,
    loginController,
} from '../controllers/auth.controller.js'

import { verifyJWT } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'

const router = express.Router()



router.route('/register').post(upload.single('file'), registerController)

router.route('/login').post(loginController)

export default router