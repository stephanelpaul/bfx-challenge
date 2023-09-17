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
    link.announce('rpc_order_book', service.port, {})
}, 1000)

service.on('request', async (rid, key, payload, handler) => {
    if (payload.method === 'addOrder') {
        await orderBook.addOrder(payload.order);
        handler.reply(null, {msg: 'Order added successfully'});
    } else if (payload.method === 'matchOrders') {
        await orderBook.matchOrders();
        handler.reply(null, { msg: 'Orders matched successfully' });
    } else {
        handler.reply(null, { msg: 'Unknown method' });
    }
})