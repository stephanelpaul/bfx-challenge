class Order {
    constructor(id, side, price, quantity, timestamp) {
        this.id = id;
        this.side = side;
        this.price = price;
        this.quantity = quantity;
        this.timestamp = timestamp;
    }
}

module.exports = Order;