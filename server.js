const { PeerRPCServer }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const OrderBook = require('./src/core/order_book');

const link = new Link({
    grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCServer(link, {
    timeout: 300000
})
peer.init()

const port = 1024 + Math.floor(Math.random() * 1000)
const service = peer.transport('server')
service.listen(port);
console.info(`service started on ${port}`)

const orderBook = new OrderBook();

setInterval(function () {
    link.announce('order_book:service', service.port, {})
}, 1000)

service.on('request', async (rid, _key, payload, handler) => {
    if (payload.method === 'addOrder') {
        await orderBook.addOrder(payload.order);
        handler.reply(null, {requestId: rid,  bids: orderBook.bids, asks: orderBook.asks});
    } else if (payload.method === 'matchOrders') {
        await orderBook.matchOrders();
        handler.reply(null, { orderBook });
        handler.reply(null, {requestId: rid,  trades: orderBook.trades});
    } else {
        handler.reply(null, { msg: 'Unknown method' });
    }
})

process.on('uncaughtException', function (err) {
    console.error(err);
}); 