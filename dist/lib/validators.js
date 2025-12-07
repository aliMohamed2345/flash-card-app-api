export class Validators {
    #emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    #strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    #usernameRegex = /^[a-zA-Z0-9_]+$/;
    validateSignup(username, email, password) {
        //username validation
        if (!username)
            return { isValid: false, message: "username is required" };
        if (username.length < 3 || username.length > 50) {
            return {
                isValid: false,
                message: "Username must be between 3 and 50 characters long.",
            };
        }
        if (!this.#usernameRegex.test(username))
            return {
                isValid: false,
                message: "Username can only contain letters, numbers, and underscores.",
            };
        //email validation
        if (!email)
            return { isValid: false, message: "email is required" };
        if (typeof email !== "string")
            return { isValid: false, message: "email should be a string" };
        if (!this.#emailRegex.test(email))
            return {
                isValid: false,
                message: "email is invalid, please provide a valid email",
            };
        //password validation
        if (!password)
            return { isValid: false, message: "password is required" };
        if (typeof password !== "string")
            return { isValid: false, message: "password should be a string" };
        if (password.length < 6 || password.length > 64)
            return {
                isValid: false,
                message: `password must be between 6 and 64 characters long`,
            };
        if (!this.#strongPasswordRegex.test(password))
            return {
                isValid: false,
                message: `Password must include uppercase, lowercase, number, and special character.`,
            };
        return { isValid: true, message: "" };
    }
    validateLogin(email, password) {
        //email validation
        if (!email)
            return { isValid: false, message: "email is required" };
        if (typeof email !== "string")
            return { isValid: false, message: "email should be a string" };
        if (!this.#emailRegex.test(email))
            return {
                isValid: false,
                message: "email is invalid, please provide a valid email",
            };
        //password validation
        if (!password)
            return { isValid: false, message: "password is required" };
        if (typeof password !== "string")
            return { isValid: false, message: "password should be a string" };
        if (password.length < 6 || password.length > 64)
            return {
                isValid: false,
                message: `password must be between 6 and 64 characters long`,
            };
        if (!this.#strongPasswordRegex.test(password))
            return {
                isValid: false,
                message: `Password must include uppercase, lowercase, number, and special character.`,
            };
        return { isValid: true, message: "" };
    }
}
//# sourceMappingURL=validators.js.map