# Distributed Exchange Server and Client

This project provides a simplified implementation of a distributed exchange with a server and client. The server allows clients to add buy and sell orders to an order book, and it can match buy and sell orders. The client provides a command-line interface for interacting with the server.

## Server

### Installation

Before running the server, ensure that you have Node.js installed on your system. You'll also need the Grenache framework for communication. Follow these steps to set up the server:

1. Install Grenache Grape (a Grape server is required for communication):

```
npm install -g grenache-grape
```

2. Start two Grape servers:

```
grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'
grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'
```

3. Install the project dependencies:

```
npm install
```

### Usage

Run the server using the following command:

```
npm start
```

The server will start, and you can leave it running in the background.

## Client

### Usage
Run the client REPL (Read-Eval-Print Loop) using the following command:

The client REPL will prompt you to enter commands. Available commands are:

- `addOrder <id> <side> <price> <quantity>`: Add a buy or sell order to the exchange.
  - `<id>`: A unique order identifier.
  - `<side>`: 'buy' or 'sell'.
  - `<price>`: The price of the order.
  - `<quantity>`: The quantity of the asset to buy/sell.
- `matchOrders`: Match buy and sell orders in the order book.


### Example Commands

- To add a buy order:
    - addOrder 1 buy 100.0 10
- To add a sell order:
    - addOrder 2 sell 105.0 8
- To match orders:
    - matchOrders
- To exit the REPL:
    - CTRL+C

## Important Notes

- This is a simplified implementation
- Ensure that the server is running before using the client.

Happy trading!