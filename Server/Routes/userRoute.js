import express from 'express'
import {loginUser, registerUser, createCheckoutSession, verifyPayment,userCredits } from '../Controllers/userController.js'
import userAuth from '../Middleware/Auth.js'

const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/credits',userAuth,userCredits)
userRouter.post('/pay',userAuth, createCheckoutSession)
userRouter.post('/verify-payment'/*,userAuth*/, verifyPayment)

export default userRouter
