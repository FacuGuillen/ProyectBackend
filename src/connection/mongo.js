import mongoose from "mongoose";

const uri = 'mongodb+srv://facuguillen:v_bFutgZbeu6.CQ@facu.eokxl.mongodb.net/?retryWrites=true&w=majority&appName=Facu';

export const mongoConnection = async () => {
    try {
        await mongoose.connect(uri, {
            dbName: 'Users',
        });
        console.log('Base de datos conectada');
    } catch (e) {
        console.log('Error al conectarse a la base de datos:', e.message);
    }
};
