const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    date: {
        type: String
    },
    status: {
        type: String,
        enum: ['נשלח', 'בהכנה', 'הוזמן'],
        default: 'הוזמן'
    },
    costumerName: {
        type: String,
        required: true
    },
    costumerId: {
        type: Schema.Types.ObjectId,
        ref: 'Costumer'
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
