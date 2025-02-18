import { Router } from "express";
import { check } from "express-validator";
import { saveCourse, getCourses, searchCourse, deleteCourse, updateCourse } from "./course.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        tieneRole("TEACHER_ROLE"),
        check('email', 'Este no es un correo valido').not().isEmpty(),
        validarCampos
    ],
    saveCourse
)

router.get("/", getCourses)

router.get(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID valido").isMongoId(),
        validarCampos
    ],
    searchCourse
)

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole("TEACHER_ROLE"),
        check("id", "No es un id Valido").isMongoId(),
        validarCampos
    ],
    deleteCourse
)

router.put(
    "/:id",
    [
        validarJWT,
        tieneRole("TEACHER_ROLE"),
        check("id", "No es un id Valido").isMongoId(),
        validarCampos
    ],
    updateCourse
)

export default router;