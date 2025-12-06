import { config } from "../utils/env-config.js"
import { statusCode } from "../utils/status-code.js"
import jwt from 'jsonwebtoken'
class Middlewares {
    verifyToken = (req, res, next) => {
        try {
            const token = req.cookies?.token
            if (!token) return res.status(statusCode.UNAUTHORIZED).json({ status: false, message: 'Unauthorized:No token provided' })

            const decoded = jwt.verify(token, config.jwtSecret)

            req.user = decoded
            next()
        } catch (error) {
            console.log(`invalid Token:${error.message}`)
            return res.status(statusCode.UNAUTHORIZED).json({ status: false, message: `Unauthorized:${error.message}` })
        }
    }

}

export default Middlewares