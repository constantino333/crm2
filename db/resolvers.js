const User = require('../models/User');
const Product = require('../models/Product');

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

const createToken = (user, secret, expiresIn) => {
    console.log(user);
    const {id, email, name, lastname} = user;

    return jwt.sign({ id }, secret, { expiresIn })
}

const clientes = [
    {
        name: "Ricardo",
        email: "ventas@sideris.com.mx"
    },
    {
        name: "Joana",
        email: "joana@sideris.com.mx"
    }
]

// Resolvers
const resolvers = {
    Query:{
        getUser: async (_, { token }) => {
            const userId = await jwt.verify(token, process.env.SECRETA);

            return userId;
        }
    },
    Mutation: {
        newUser: async (_, { input }) => {
            const { email, password } = input;

            // Revisar si el usuario ya está registrado
            const userExists = await User.findOne({email});
            if(userExists){
                throw new Error('El usuario ya está registrado');
            }

            // Hashear el passwords
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt);

            // Guardar en la base de datos
            try {
                const user = new User(input);
                user.save();
                return user;
            } catch (error) {
                console.log(error);
            }
        },
        authenticateUser: async (_, {input}) => {
            const { email, password } = input;

            // Si el usuario existe o no existe
            const userExists = await User.findOne({email}); 
            if(!userExists){
                throw new Error('El usuario no está registrado');
            }

            // Revisar si el possword es correcto
            const correctPassword = await bcryptjs.compare(password, userExists.password);
            if(!correctPassword){
                throw new Error('El password es incorrecto');
            }

            // Crear el token
            return {
                token: createToken(userExists, process.env.SECRETA, '24h')
            }
        },
        newProduct: async (_, { input }) => {
            try {
                const product = new Product(input);

                // almacenar en la base de datos
                const resultado = await product.save();

                return resultado;
            } catch (error) {
                console.log(error);
            }
        }
    }
}
module.exports = resolvers;