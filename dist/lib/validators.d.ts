interface IValidationResult {
    isValid: boolean;
    message: string;
}
declare class AuthValidators {
    protected usernameRegex: RegExp;
    protected emailRegex: RegExp;
    protected strongPasswordRegex: RegExp;
    private isPasswordLengthValid;
    /**
     * @param username
     * @param email
     * @param password
     * @returns validate the signup user credentials
     */
    validateSignup(username: string, email: string, password: string): IValidationResult;
    /**
     * @param email
     * @param password
     * @returns validate the login user credentials
     */
    validateLogin(email: string, password: string): IValidationResult;
    /**
     *
     * @param password
     * @param newPassword
     * @param confirmPassword
     * @returns validate the password user data
     */
    validatePasswordChange(password: string, newPassword: string, confirmPassword: string): IValidationResult;
}
export declare class Validators extends AuthValidators {
    private booleanValues;
    /**
     * @param email
     * @param username
     * @param bio
     * @returns validate the update user credentials
     */
    validateUpdateUser(email: string, username: string, bio: string): IValidationResult;
    /**
     * @param isAdmin
     * @param page
     * @param q
     * @param userNumbers
     * @returns validate the user search Query to the getAllUsers Controller
     */
    validateUsersSearchQuery: (isAdmin: string, page: string, q: string, userNumbers: string) => IValidationResult;
    /**
     *
     * @param page
     * @param q
     * @param isPublic
     * @returns validate the deck search query
     */
    validateDeckSearchQuery: (page: number, q: string, isPublic: string) => IValidationResult;
    /**
     * validateDeckData
     * @param title
     * @param description
     * @param isPublic
     * checks if the deck data is valid
     */
    validateDeckData(title: string, description: string, isPublic: string): IValidationResult;
    /**
     *
     * @param title
     * @param description
     * @description validate the new deck data for the update process
     */
    validateUpdateDeckData(title: string, description: string): IValidationResult;
    /**
     *
     * @param front
     * @param back
     * @param hint
     * @returns validate the flash card data
     */
    validateFlashCard: (front: string, back: string, hint: string) => IValidationResult;
}
export {};
//# sourceMappingURL=validators.d.ts.map