import { Schema, model } from "mongoose";

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        maxLength: [25, 'No puede superar los 25 caracteres']
    },
    surname: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        maxLength: [25, 'No puede superar los 25 caracteres'],
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: [true, "El correo es obligatorio"],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    phone: {
        type: String,
        minLength: 8,
        maxLength: 8,
        required: [true, 'El número de teléfono es obligatorio']
    },
    role: {
        type: String,
        required: true,
        enum: ['ALUMNO_ROLE', 'TEACHER_ROLE'],
        default: "ALUMNO_ROLE"
    },
    estado: {
        type: Boolean,
        default: true
    },
    keeper: [{
        type: Schema.Types.ObjectId,
        ref: 'course',
        required: false
    }]
},
{
    timestamps: true,
    versionKey: false
});

UserSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model('user', UserSchema);
