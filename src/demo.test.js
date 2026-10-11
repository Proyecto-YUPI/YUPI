import test from 'node:test';
import assert from 'node:assert/strict';
import { catalogs, confirmOrder } from './demo.js';
test('confirmed orders decrement only the selected item and calculate the total', () => { for (const { products } of Object.values(catalogs)) { const result = confirmOrder(products, products[0].id, 2); assert.equal(result.products[0].stock, products[0].stock - 2); assert.equal(result.total, products[0].price * 2); assert.deepEqual(result.products[1], products[1]); assert.notEqual(result.products, products); } });
test('invalid orders cannot change stock', () => { const products = catalogs.ferreteria.products; for (const quantity of [0, -1, 1.5, 99, NaN]) assert.ok(confirmOrder(products, 'f1', quantity).error); assert.ok(confirmOrder(products, 'f3', 1).error); assert.ok(confirmOrder(products, 'missing', 1).error); assert.equal(products[0].stock, 8); });
test('consecutive orders cannot oversell', () => { const first = confirmOrder(catalogs.ferreteria.products, 'f2', 3); assert.equal(first.products[1].stock, 0); assert.ok(confirmOrder(first.products, 'f2', 1).error); });
