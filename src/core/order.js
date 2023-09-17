class Order {
    
    constructor(side, price, quantity, timestamp) {
        this.id = this._generateRandomOrderId(timestamp);
        this.side = side;
        this.price = price;
        this.quantity = quantity;
        this.timestamp = timestamp;
    }

    _generateRandomOrderId(timestamp) {
        const randomNumber = Math.floor(Math.random() * 1000000);
        const orderId = `${timestamp}${randomNumber}`;
        return orderId;
    }    
}

module.exports = Order;