import { config } from "../utils/env-config.js";
import { statusCode } from "../utils/status-code.js";
import jwt from "jsonwebtoken";
class Middlewares {
    verifyToken = (req, res, next) => {
        try {
            const token = req.cookies?.token;
            if (!token)
                return res
                    .status(statusCode.UNAUTHORIZED)
                    .json({ status: false, message: "Unauthorized:No token provided" });
            const decoded = jwt.verify(token, config.jwtSecret);
            req.user = decoded;
            next();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Invalid Token";
            console.log(`invalid Token:${message}`);
            return res
                .status(statusCode.UNAUTHORIZED)
                .json({ status: false, message: `Unauthorized:${message}` });
        }
    };
}
export default Middlewares;
//# sourceMappingURL=middlewares.js.map