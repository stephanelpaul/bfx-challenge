const Lock = require('./lock');
const Order = require('./order');
const Trade = require('./trade');

class OrderBook {
    constructor() {
        this._bids = [];
        this._asks = [];
        this._trades = [];
        this._orderLock = new Lock();
    }

    async addOrder(orderData) {
        const order = new Order(
            orderData.side,
            orderData.price,
            orderData.quantity,
            orderData.timestamp
        )

        await this._orderLock.acquire();

        try {
            if (order.side === 'buy') {
                this.addBuyOrder(order);
            } else if (order.side === 'sell') {
                this.addSellOrder(order);
            }
        } finally {
            this._orderLock.release();
        }
    }

    addBuyOrder(order) {
        if (this._bids.length === 0) {
            this._bids.push(order);
            return;
        }
    
        let i = this._bids.length - 1;
        while (i >= 0 && this._bids[i].price < order.price) {
            i--;
        }
    
        this._bids.splice(i + 1, 0, order);
    }

    addSellOrder(order) {
        if (this._asks.length === 0) {
            this._asks.push(order);
            return;
        }
    
        let i = 0;
        while (i < this._asks.length && this._asks[i].price < order.price) {
            i++;
        }
    
        this._asks.splice(i, 0, order);
    }

    async matchOrders() {
        let i = 0; 
        let j = 0;

        const sellOrderLock = new Lock();
        const buyOrderLock = new Lock();


        while ( i < this._asks.length && j < this._bids.length) {
            let askOrder, bidOrder;

            await Promise.all([
                sellOrderLock.acquire(),
                buyOrderLock.acquire()
            ]);

            if (i < this._asks.length && j < this._bids.length) {
                askOrder = this._asks[i];
                bidOrder = this._bids[j];
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
                    this._asks.splice(i, 1);
                }

                if (bidOrder.quantity === 0) {
                    this._bids.splice(j, 1)
                }

                sellOrderLock.release();
                buyOrderLock.release();

                const trade = new Trade(tradePrice, tradeQuantity, tradeTimestamp);

                this._trades.push(trade);
            } else {
                if (askOrder.price < bidOrder.price) {
                    i++;
                } else {
                    j++;
                }
            }
        }
    }

    get bids() {
        return this._bids;
    }

    get asks() {
        return this._asks;
    }
}

module.exports = OrderBook;