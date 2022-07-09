const mongoose = require('mongoose');

require('dotenv').config({ path: 'variables.env' });

const conectarBD = async () => {
    try {
        await mongoose.connect(process.env.DB, {

        });
        console.log('conectado');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = conectarBD;