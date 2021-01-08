const Order = require('../models/order');

exports.getOrders = (req, res, next) => {

    Order.find().then(orders => {
        res
            .status(200)
            .json({ message: 'Fetched orders successfully.', orders: orders });
    })
        .catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.postOrder = (req, res, next) => {
    const order = new Order({
        type: req.body.type,
        quantity: req.body.quantity,
        date: req.body.date,
        status: req.body.status,
        costumerName: req.body.costumerName,
    })
    order.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order created successfully!',
                post: result
            })
        })
        .catch(err => {
            console.log(err);
        });
}

exports.updateOrder = (req, res, next) => {
    const orderId = req.params.orderId;

    Order.findById(orderId)
        .then(order => {
            if (!order) {
                const error = new Error('Could not find order.');
                error.statusCode = 404;
                throw error;
            }
            order.type = req.body.type;
            order.quantity = req.body.quantity;
            order.date = req.body.date;
            order.status = req.body.status;
            order.costumerName = req.body.costumerName;
            return order.save();
        })
        .then(result => {
            res.status(200).json({ message: 'Order updated!', order: result });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};