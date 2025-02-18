import { Router } from 'express';
import { login, registerProfesor, registerAlumno } from './auth.controller.js'
import { registerValidator, loginValidator } from '../middlewares/validator.js';
import { deleteFileOnError } from '../middlewares/deleteFileOnError.js';

const router = Router();

router.post(
    '/login',
    loginValidator,
    deleteFileOnError,
    login
);

router.post(
    '/registerProfes',
    registerValidator,
    deleteFileOnError,
    registerProfesor
);

router.post(
    '/registerAlumos',
    registerValidator,
    deleteFileOnError,
    registerAlumno
);

export default router;