export declare class Validators {
    private emailRegex;
    private strongPasswordRegex;
    private usernameRegex;
    private booleanValues;
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
    /**
     * @param isAdmin
     * @param page
     * @param q
     * @param userNumbers
     * @returns validate the user search Query to the getAllUsers Controller
     */
    validateUsersSearchQuery: (isAdmin: string, page: string, q: string, userNumbers: string) => {
        isValid: boolean;
        message: string;
    };
    validateDeckSearchQuery: (page: number, q: string, isPublic: string) => {
        isValid: boolean;
        message: string;
    };
    /**
     * validateDeckData
     * @param title
     * @param description
     * @param isPublic
     * checks if the deck data is valid
     */
    validateDeckData(title: string, description: string, isPublic: string): {
        isValid: boolean;
        message: string;
    };
    /**
     *
     * @param title
     * @param description
     * @description validate the new deck data for the update process
     */
    validateUpdateDeckData(title: string, description: string): {
        isValid: boolean;
        message: string;
    };
    /**
     *
     * @param front
     * @param back
     * @param hint
     * @returns validate the flash card data
     */
    validateFlashCard: (front: string, back: string, hint: string) => {
        isValid: boolean;
        message: string;
    };
}
//# sourceMappingURL=validators.d.ts.map