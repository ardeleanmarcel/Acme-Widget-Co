import { useState, useCallback } from 'react';
import { Basket, defaultProducts, defaultDeliveryRules, defaultOffers, Product } from './lib/basket';
import { ProductCatalog } from './components/ProductCatalog';
import { ShoppingBasket } from './components/ShoppingBasket';
import './App.css';

const basketConfig = {
  products: defaultProducts,
  deliveryRules: defaultDeliveryRules,
  offers: defaultOffers,
};

export default function App() {
  const [basket] = useState(() => new Basket(basketConfig));
  const [, forceUpdate] = useState({});

  const refresh = useCallback(() => forceUpdate({}), []);

  const handleAddProduct = useCallback((code: string) => {
    basket.add(code);
    refresh();
  }, [basket, refresh]);

  const handleRemoveProduct = useCallback((code: string) => {
    basket.remove(code);
    refresh();
  }, [basket, refresh]);

  const handleClearBasket = useCallback(() => {
    basket.clear();
    refresh();
  }, [basket, refresh]);

  const productMap = new Map<string, Product>(defaultProducts.map(p => [p.code, p]));

  return (
    <div className="app">
      <header className="header">
        <h1>Acme Widget Co</h1>
        <p className="tagline">Quality widgets for every need</p>
      </header>

      <main className="main">
        <ProductCatalog
          products={defaultProducts}
          offers={defaultOffers}
          onAddProduct={handleAddProduct}
        />

        <ShoppingBasket
          items={basket.getItems()}
          productMap={productMap}
          subtotal={basket.getSubtotal()}
          delivery={basket.getDelivery()}
          total={basket.total()}
          onRemoveProduct={handleRemoveProduct}
          onClearBasket={handleClearBasket}
        />
      </main>

      <footer className="footer">
        <p>Free delivery on orders $90+</p>
      </footer>
    </div>
  );
}
