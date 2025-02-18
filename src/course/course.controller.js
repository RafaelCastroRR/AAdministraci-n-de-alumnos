import User from '../users/user.model.js'
import Course from './course.model.js'

export const saveCourse = async (req, res) =>{
    try {
        
        const data = req.body;
        const user = await User.findOne({ email: data.email });

        if(!user){
            return res.status(404).json({
                success: false,
                message: 'Curso no encontrado'
            })
        }

        const course = new Course({
            ...data,
            keeper: user._id
        });

        await course.save();

        res.status(200).json({
            success: true,
            course
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al guardar el curso',
            error
        })
    }
}

export const getCourses = async (req, res) =>{
    
    const { limite = 10, desde = 0} = req.query;
    const query = { status: true};

    try {
        
        const courses = await Course.find(query)
            .skip(Number(desde))
            .limit(Number(limite));

        const coursesWithOwnerNames = await Promise.all(courses.map(async (course) =>{
            const owner = await User.findById(course.keeper);
            return {
                ...course.toObject(),
                keeper: owner ? owner.name : "Maestro no encontrado"
            }
        }));

        const total = await Course.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            courses: coursesWithOwnerNames
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el curso',
            error
        })
    }
}

export const searchCourse = async (req, res) => {
    
    const { id } = req.params;

    try {

        const course = await Course.findById(id);

        if(!course){
            return res.status(404).json({
                success: false,
                message: 'Curso no encontrado'
            })
        }

        const owner = await User.findById(course.keeper);

        res.status(200).json({
            success: true,
            course: {
                ...course.toObject(),
                keeper: owner ? owner.nombre : "Propietario no encontrado"
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar el curso',
            error
        })
    }
}

export const deleteCourse = async (req, res) => {

    const { id } = req.params;

    try {
        
        await Course.findByIdAndUpdate(id, { status: false});

        res.status(200).json({
            success: true,
            message: 'Curso eliminado exitosamente'
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar curso',
            error
        })
    }

}

export const updateCourse = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id,  ...data } = req.body;
        let { email } = req.body;
 
        if(email) {
            const user = await User.findOne({ email });
 
            if (!user) {
                return res.status(400).json({
                    success: false,
                    msg: 'Usuario con ese correo electrónico no encontrado',
                });
            }
           
            data.keeper = user._id;
        }
 
        const course = await Course.findByIdAndUpdate(id, data, { new: true });
 
        res.status(200).json({
            success: true,
            msg: 'Curso Actualizado',
            course
        })
 
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar el curso',
            error
        })  
    }
}