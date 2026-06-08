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


export const registerUserValidationRule = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

        validate
];
