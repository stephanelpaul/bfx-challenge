const Order = require('../src/core/order')

describe('Order', () => {
    it('should create an order object with the provided properties', () => {
      const order = new Order('buy', 100.0, 10, Date.now());
  
      expect(order.side).toBe('buy');
      expect(order.price).toBe(100.0);
      expect(order.quantity).toBe(10);
      expect(order.timestamp).toBeGreaterThan(0);
    });
  
});