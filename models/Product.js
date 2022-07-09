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
    created: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Product', ProductsSchema);