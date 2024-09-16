import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'


export const verifyJWT = async (req, res, next) => {
    try {
        
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ", "")
        if (!token) {
            return res.status(401).json({ success: false, message: "No token, authorization denied" })
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select('-password -refreshToken')


        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid AccessToken" })
        }
        req.user = user
        next()

    } catch (error) {
        console.log(error)

        return res.status(400).send({
            success: false,
            message: 'Some Error occured in verifyJWT Middleware'
        })
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        const { role } = req.user
        if (role !== 1) {
            return res.status(401).send({
                success: false,
                message: 'Unauthorized Access'
            })
        } else {
            next()
        }
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            success: false,
            message: 'Some error occured in isAdmin middleware '
        })
    }
}