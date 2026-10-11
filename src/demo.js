export const catalogs = {
  ferreteria: { label: 'Ferretería', products: [{ id: 'f1', name: 'Taladro inalámbrico', price: 450, stock: 8 }, { id: 'f2', name: 'Martillo', price: 65, stock: 3 }, { id: 'f3', name: 'Caja de tornillos', price: 25, stock: 0 }] },
  farmacia: { label: 'Farmacia', products: [{ id: 'p1', name: 'Protector solar', price: 95, stock: 10 }, { id: 'p2', name: 'Kit de primeros auxilios', price: 80, stock: 2 }, { id: 'p3', name: 'Termómetro digital', price: 45, stock: 0 }] },
  restaurante: { label: 'Restaurante', products: [{ id: 'r1', name: 'Hamburguesa de la casa', price: 35, stock: 20 }, { id: 'r2', name: 'Pizza margarita', price: 55, stock: 3 }, { id: 'r3', name: 'Limonada', price: 12, stock: 15 }] },
  tienda: { label: 'Tienda', products: [{ id: 't1', name: 'Camiseta básica', price: 85, stock: 12 }, { id: 't2', name: 'Jean clásico', price: 180, stock: 2 }, { id: 't3', name: 'Gorra urbana', price: 60, stock: 0 }] },
};
export const money = value => `Bs ${value.toFixed(2)}`;
export function confirmOrder(products, productId, quantity) {
  const product = products.find(p => p.id === productId);
  if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > product.stock) return { error: 'No hay existencias suficientes para esa cantidad.' };
  return { products: products.map(p => p.id === productId ? { ...p, stock: p.stock - quantity } : p), total: product.price * quantity };
}
