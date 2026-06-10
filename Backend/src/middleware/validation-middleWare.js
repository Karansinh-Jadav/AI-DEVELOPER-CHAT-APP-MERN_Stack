import { body, validationResult } from 'express-validator';

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    next();
};

export const projectValidationRule = [
    body('name')
        .isString()
        .withMessage('Please provide a valid email'),
        
        validate,
];

export const registerUserValidationRule = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

        validate
];
export const userArrayValidation = [
    body('projectId')
    .isString()
    .withMessage("Project ID is Required"),

    body('users')
    .isArray({ min: 1 })
    .withMessage('Users must be a non-empty array')
    .custom((users) =>  users.every(user => typeof user === 'string'))
    .withMessage('All users must be strings'),
];
