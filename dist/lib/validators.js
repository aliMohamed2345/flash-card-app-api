export class Validators {
    emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    usernameRegex = /^[a-zA-Z0-9_]+$/;
    booleanValues = ["true", "false"];
    isPasswordLengthValid = (pwd) => {
        return pwd.length >= 6 && pwd.length <= 64;
    };
    /**
     * @param username
     * @param email
     * @param password
     * @returns validate the signup user credentials
     */
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
        if (!this.usernameRegex.test(username))
            return {
                isValid: false,
                message: "Username can only contain letters, numbers, and underscores.",
            };
        //email validation
        if (!email)
            return { isValid: false, message: "email is required" };
        if (typeof email !== "string")
            return { isValid: false, message: "email should be a string" };
        if (!this.emailRegex.test(email))
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
        if (!this.strongPasswordRegex.test(password))
            return {
                isValid: false,
                message: `Password must include uppercase, lowercase, number, and special character.`,
            };
        return { isValid: true, message: "" };
    }
    /**
     * @param email
     * @param password
     * @returns validate the login user credentials
     */
    validateLogin(email, password) {
        //email validation
        if (!email)
            return { isValid: false, message: "email is required" };
        if (typeof email !== "string")
            return { isValid: false, message: "email should be a string" };
        if (!this.emailRegex.test(email))
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
        if (!this.strongPasswordRegex.test(password))
            return {
                isValid: false,
                message: `Password must include uppercase, lowercase, number, and special character.`,
            };
        return { isValid: true, message: "" };
    }
    /**
     * @param email
     * @param username
     * @param bio
     * @returns validate the update user credentials
     */
    validateUpdateUser(email, username, bio) {
        //email validation
        if (email) {
            if (typeof email !== "string")
                return { isValid: false, message: "email should be a string" };
            if (!this.emailRegex.test(email))
                return {
                    isValid: false,
                    message: "email is invalid, please provide a valid email",
                };
        }
        //user name validation
        if (username) {
            if (username.length < 3 || username.length > 50) {
                return {
                    isValid: false,
                    message: "Username must be between 3 and 50 characters long.",
                };
            }
            if (!this.usernameRegex.test(username))
                return {
                    isValid: false,
                    message: "Username can only contain letters, numbers, and underscores.",
                };
        }
        if (bio) {
            if (typeof bio !== "string")
                return { isValid: false, message: "bio should be a string" };
            if (bio.length < 2 || bio.length > 100)
                return {
                    isValid: false,
                    message: "bio must be between 2 and 100 characters long",
                };
        }
        return { isValid: true, message: "" };
    }
    /**
     *
     * @param password
     * @param newPassword
     * @param confirmPassword
     * @returns validate the password user data
     */
    validatePasswordChange(password, newPassword, confirmPassword) {
        if (!password || !newPassword || !confirmPassword) {
            return {
                isValid: false,
                message: "Password, new password, and confirm password are required.",
            };
        }
        if (typeof password !== "string" ||
            typeof newPassword !== "string" ||
            typeof confirmPassword !== "string") {
            return {
                isValid: false,
                message: "All password fields must be strings.",
            };
        }
        if (!this.isPasswordLengthValid(password) ||
            !this.isPasswordLengthValid(newPassword) ||
            !this.isPasswordLengthValid(confirmPassword)) {
            return {
                isValid: false,
                message: "All passwords must be between 6 and 64 characters long.",
            };
        }
        if (!this.strongPasswordRegex.test(newPassword)) {
            return {
                isValid: false,
                message: "New password must include uppercase, lowercase, number, and special character.",
            };
        }
        if (newPassword !== confirmPassword) {
            return {
                isValid: false,
                message: "New password and confirm password must match.",
            };
        }
        // New password must not be same as old
        if (password === newPassword) {
            return {
                isValid: false,
                message: "New password must be different from the old password.",
            };
        }
        return { isValid: true, message: "" };
    }
    /**
     * @param isAdmin
     * @param page
     * @param q
     * @param userNumbers
     * @returns validate the user search Query to the getAllUsers Controller
     */
    validateUsersSearchQuery = (isAdmin, page, q, userNumbers) => {
        // isAdmin validator
        if (isAdmin) {
            const lower = isAdmin?.trim().toLowerCase();
            if (!this.booleanValues.includes(lower)) {
                return {
                    isValid: false,
                    message: "Invalid isAdmin value: must be true or false",
                };
            }
        }
        // q validator
        if (q) {
            if (q.length < 1 || q.length > 100) {
                return {
                    isValid: false,
                    message: "Invalid q value: must be between 1 and 100 characters",
                };
            }
        }
        // page validator
        if (page) {
            const pageNumber = +page;
            if (isNaN(pageNumber) || pageNumber < 1) {
                return {
                    isValid: false,
                    message: "Invalid page value: must be a positive number",
                };
            }
        }
        // userNumbers validator
        if (userNumbers) {
            const num = +userNumbers;
            if (isNaN(num) || num < 1 || num > 20) {
                return {
                    isValid: false,
                    message: "Invalid userNumbers value: must be between 1 and 20 per page",
                };
            }
        }
        return { isValid: true, message: "" };
    };
    validateDeckSearchQuery = (page, q, isPublic) => {
        // page validator
        if (page) {
            const pageNumber = +page;
            if (isNaN(pageNumber) || pageNumber < 1) {
                return {
                    isValid: false,
                    message: "Invalid page value: must be a positive number",
                };
            }
        }
        if (q) {
            if (q.length < 1 || q.length > 100) {
                return {
                    isValid: false,
                    message: "Invalid q value: must be between 1 and 100 characters",
                };
            }
        }
        if (isPublic) {
            const lower = isPublic.trim().toLowerCase();
            if (!this.booleanValues.includes(lower)) {
                return {
                    isValid: false,
                    message: "Invalid isPublic value: must be true or false",
                };
            }
        }
        return { isValid: true, message: "" };
    };
    /**
     * validateDeckData
     * @param title
     * @param description
     * @param isPublic
     * checks if the deck data is valid
     */
    validateDeckData(title, description, isPublic) {
        //title validations
        title = title?.trim();
        description = description?.trim();
        isPublic = isPublic?.trim().toLowerCase();
        if (!title)
            return {
                isValid: false,
                message: "Title is required",
            };
        if (typeof title !== "string")
            return { isValid: false, message: "title should be a sting " };
        if (title.length < 3 || title.length > 100)
            return {
                isValid: false,
                message: "Title must be between 3 and 100 characters long",
            };
        //description validations
        if (!description) {
            return {
                isValid: false,
                message: "Description is required",
            };
        }
        if (typeof description !== "string")
            return { isValid: false, message: "description should be a string" };
        if (description.length < 2 || description.length > 200)
            return {
                isValid: false,
                message: "Description must be between 2 and 1000 characters long",
            };
        //is Public validations
        if (!isPublic) {
            return {
                isValid: false,
                message: "isPublic is required",
            };
        }
        if (!this.booleanValues.includes(isPublic)) {
            return {
                isValid: false,
                message: "isPublic must be true or false",
            };
        }
        return { isValid: true, message: "" };
    }
    /**
     *
     * @param title
     * @param description
     * @description validate the new deck data for the update process
     */
    validateUpdateDeckData(title, description) {
        title = title?.trim();
        description = description?.trim();
        if (title) {
            if (typeof title !== "string")
                return { isValid: false, message: "title should be a sting " };
            if (title.length < 3 || title.length > 100)
                return {
                    isValid: false,
                    message: "Title must be between 3 and 100 characters long",
                };
        }
        if (description) {
            if (typeof description !== "string")
                return { isValid: false, message: "description should be a string" };
            if (description.length < 2 || description.length > 200)
                return {
                    isValid: false,
                    message: "Description must be between 2 and 1000 characters long",
                };
        }
        return { isValid: true, message: "" };
    }
    /**
     *
     * @param front
     * @param back
     * @param hint
     * @returns validate the flash card data
     */
    validateFlashCard = (front, back, hint) => {
        front = front?.trim();
        back = back?.trim();
        hint = hint?.trim();
        //validate the front
        if (!front)
            return { isValid: false, message: "front is required" };
        if (typeof front !== "string")
            return { isValid: false, message: "front should be a string" };
        if (!back)
            return { isValid: false, message: "back is required" };
        if (typeof back !== "string")
            return { isValid: false, message: "back should be a string" };
        if (front === back)
            return { isValid: false, message: "front and back cannot be the same" };
        if (hint) {
            if (typeof hint !== "string")
                return { isValid: false, message: "hint should be a string" };
            if (hint.length > 100)
                return {
                    isValid: false,
                    message: "Hint cannot exceed 100 characters long ",
                };
        }
        return { isValid: true, message: "" };
    };
}
//# sourceMappingURL=validators.js.map