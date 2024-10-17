import express from 'express'
import userAuth from '../middlewares/authMiddleware.js'
import { updateUseController } from '../controller/userController.js'

// route 

const router = express.Router()

//routes

// GET USER || GET 

//UPDATE USER  || PUT

router.put('/update-user', userAuth, updateUseController)

export default router 