export declare class Validators {
    private emailRegex;
    private strongPasswordRegex;
    private usernameRegex;
    private isAdminValues;
    private isPasswordLengthValid;
    /**
     * @param username
     * @param email
     * @param password
     * @returns validate the signup user credentials
     */
    validateSignup(username: string, email: string, password: string): {
        isValid: boolean;
        message: string;
    };
    /**
     * @param email
     * @param password
     * @returns validate the login user credentials
     */
    validateLogin(email: string, password: string): {
        isValid: boolean;
        message: string;
    };
    /**
     * @param email
     * @param username
     * @param bio
     * @returns validate the update user credentials
     */
    validateUpdateUser(email: string, username: string, bio: string): {
        isValid: boolean;
        message: string;
    };
    /**
     *
     * @param password
     * @param newPassword
     * @param confirmPassword
     * @returns validate the password user data
     */
    validatePasswordChange(password: string, newPassword: string, confirmPassword: string): {
        isValid: boolean;
        message: string;
    };
    validateUsersSearchQuery: (isAdmin: string, page: string, q: string, userNumbers: string) => {
        isValid: boolean;
        message: string;
    };
}
//# sourceMappingURL=validators.d.ts.map