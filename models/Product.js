const mongoose = require('mongoose');

const ProductsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        requiered: true,
        trim: true,
        default: 0
    },
    image: {
        type: String,
        requiered: true,
        trim: true
    },
    created: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'User'
    }

});

module.exports = mongoose.model('Product', ProductsSchema);