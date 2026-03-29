const mongoose = require('mongoose');
const { Schema } = mongoose;

const InventorySchema = new Schema({
    name: String,
    quantityInStock: Number,
    expirationDate: Date,
    price: Number,

    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', InventorySchema);

module.exports = Inventory;