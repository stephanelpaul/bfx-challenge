const Lock = require('./lock');
const Order = require('./order');

class OrderBook {
    constructor() {
        this.bids = [];
        this.asks = [];
        this.orderLock = new Lock();
    }

    async addOrder(orderData) {
        const order = new Order(
            orderData.id,
            orderData.side,
            orderData.price,
            orderData.quantity,
            orderData.timestamp
        )

        await this.orderLock.acquire();

        try {
            if (order.side === 'buy') {
                this.addBuyOrder(order);
            } else if (order.side === 'sell') {
                this.addSellOrder(order);
            }
        } finally {
            this.orderLock.release();
        }
    }

    addBuyOrder(order) {
        let i = this.bids.length - 1;
        while (i >= 0 && this.bids[i].price < order.price) {
            i--;
        }
        this.bids.replace(i + 1, 0, order);
    }

    addSellOrder() {
        let i = 0;
        while(i < this.asks.length && this.asks[i].price < order.price) {
            i++;
        }

        this.asks.splice(i, 0, order);
    }

    async matchOrders() {
        let i = 0; 
        let j = 0;

        const sellOrderLock = new Lock();
        const buyOrderLock = new Lock();


        while ( i < this.asks.length && j < this.bids.length) {
            let askOrder, bidOrder;

            await Promise.all([
                sellOrderLock.acquire(),
                buyOrderLock.acquire()
            ]);

            if (i < this.asks.length && j < this.bids.length) {
                askOrder = this.asks[i];
                bidOrder = this.bids[j];
            }

            sellOrderLock.release();
            buyOrderLock.release();

            if (!askOrder || !bidOrder) {
                break;
            }

            if (askOrder.price <= bidOrder.price) {
                const tradePrice = askOrder.price;
                const tradeQuantity = Math.min(askOrder.quantity, bidOrder.quantity);
                const tradeTimestamp = Date.now();

                await Promise.all([
                    sellOrderLock.acquire(),
                    buyOrderLock.acquire(),
                ])
                
                askOrder.quantity -= tradeQuantity;
                bidOrder.quantity -= tradeQuantity;

                if (askOrder.quantity === 0) {
                    this.asks.splice(i, 1);
                }

                if (bidOrder.quantity === 0) {
                    this.bids.splice(j, 1)
                }

                sellOrderLock.release();
                buyOrderLock.release();

                const trade = new Trade(tradePrice, tradeQuantity, tradeTimestamp);
            } else {
                if (askOrder.price < bidOrder.price) {
                    i++;
                } else {
                    j++;
                }
            }
        }
    }
}

module.exports = OrderBook;