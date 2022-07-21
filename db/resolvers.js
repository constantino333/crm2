const User = require('../models/User');
const Product = require('../models/Product');

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

const createToken = (user, secret, expiresIn) => {
    const {id, email, name, lastname} = user;

    return jwt.sign({ id, email }, secret, { expiresIn })
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
        obtenerUsuario: async (_, {}, ctx) => {
            return ctx.usuario;
        },
        getUser: async (_, {}, ctx) => {
            return ctx.usuario;
        },
        getProductUser: async (_, {}, ctx) => {
            try {
                const products = await Product.find({ user: ctx.usuario.id.toString() });
                return products;
            } catch (error) {
                console.log(error);
            }
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
        newProduct: async (_, { input }, ctx) => {
            try {
                const product = new Product(input);

                // Asignar el producto al usuario
                product.user = ctx.usuario.id;
                console.log(product.user);

                // almacenar en la base de datos
                const resultado = await product.save();

                return product;
            } catch (error) {
                console.log(error);
            }
        },
        deleteProduct: async(_, {id}) => {
            // revisar si el producto existe o no
            let producto = await Product.findById(id);

            if(!producto) {
                throw new Error('Producto no encontrado');
            }

            // Eliminar
            await Product.findOneAndDelete({_id :  id});

            return "Producto Eliminado";
        },
    }
}
module.exports = resolvers;