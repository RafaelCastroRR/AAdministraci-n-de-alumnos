import { response, request } from "express";
import { hash } from "argon2";
import User from "./user.model.js";
import Course from "../course/course.model.js";

export const getUsers = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query).skip(Number(desde)).limit(Number(limite)).populate('keeper', 'nameC description level')
        ]);

        res.json({ success: true, total, users });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Hubo un error al obtener los usuarios' });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('keeper', 'name description level');
        if (!user) return res.status(404).json({ success: false, msg: 'Usuario no encontrado' });
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Hubo un error al obtener el usuario' });
    }
};

export const updateUser = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { password, ...data } = req.body;
        if (password) data.password = await hash(password);
        const user = await User.findByIdAndUpdate(id, data, { new: true });
        res.json({ success: true, msg: 'Usuario actualizado correctamente', user });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Hubo un error al actualizar el usuario' });
    }
};

export const updatePassword = async (req, res = response) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { password: await hash(req.body.password) }, { new: true });
        res.json({ success: true, msg: 'Contraseña actualizada correctamente', user });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Hubo un error al actualizar la contraseña' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { estado: false }, { new: true });
        res.json({ success: true, msg: 'Usuario eliminado correctamente', user, authenticatedUser: req.user });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Hubo un error al eliminar el usuario' });
    }
};

export const asignarCourse = async (req, res) => {
    try {
        const course = await Course.findOne({ nameC: req.body.nameC });
        if (!course) return res.status(404).json({ success: false, msg: 'Curso no encontrado' });
        
        const updatedUser = await User.findById(req.params.id).populate('keeper', 'nameC description level');
        if (updatedUser.keeper.length >= 3) return res.status(400).json({ success: false, msg: 'No se pueden asignar más de 3 cursos' });
        if (updatedUser.keeper.some(item => item.nameC === course.nameC)) return res.status(400).json({ success: false, msg: 'El curso ya está asignado' });
        
        updatedUser.keeper.push(course._id);
        await updatedUser.save();

        res.json({ success: true, msg: 'Curso asignado correctamente', user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Hubo un error al asignar el curso' });
    }
};
