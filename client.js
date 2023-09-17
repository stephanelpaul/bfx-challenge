// client.js

const readline = require('readline');
const { PeerRPCClient } = require('grenache-nodejs-http');
const Link = require('grenache-nodejs-link');

const link = new Link({
  grape: 'http://127.0.0.1:30001',
});
link.start();

const peer = new PeerRPCClient(link, {});
peer.init();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Enter command (e.g., addOrder or matchOrders): ',
});

async function sendOrder(orderData) {
  const addOrderPayload = {
    method: 'addOrder',
    order: orderData,
  };

  return new Promise((resolve, reject) => {
    peer.request('order_book:service', addOrderPayload, { timeout: 10000 }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

async function matchOrders() {
  const matchOrderPayload = {
    method: 'matchOrders',
  };

  return new Promise((resolve, reject) => {
    peer.request('order_book:service', matchOrderPayload, { timeout: 10000 }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

rl.prompt();

rl.on('line', async (line) => {
  const [command, ...args] = line.trim().split(' ');

  if (command === 'addOrder') {
    if (args.length !== 3) {
      console.log('Usage: addOrder <side> <price> <quantity>');
    } else {
      const [side, price, quantity] = args;
      const orderData = {
        side,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
        timestamp: Date.now(),
      };

      try {
        const response = await sendOrder(orderData);
        console.log('Order added:', response);
      } catch (err) {
        console.error('Error adding order:', err);
      }
    }
  } else if (command === 'matchOrders') {
    try {
      const response = await matchOrders();
      console.log('Orders matched:', response);
    } catch (err) {
      console.error('Error matching orders:', err);
    }
  } else {
    console.log('Unknown command');
  }

  rl.prompt();
}).on('close', () => {
  console.log('Exiting REPL.');
  process.exit(0);
});


process.on('uncaughtException', function (err) {
  console.error(err);
}); 