import { Product } from '../lib/basket';

interface ShoppingBasketProps {
  items: string[];
  productMap: Map<string, Product>;
  subtotal: number;
  delivery: number;
  total: number;
  onRemoveProduct: (code: string) => void;
  onClearBasket: () => void;
}

function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function ShoppingBasket({
  items,
  productMap,
  subtotal,
  delivery,
  total,
  onRemoveProduct,
  onClearBasket,
}: ShoppingBasketProps) {
  // Group items by product code
  const itemCounts = new Map<string, number>();
  for (const code of items) {
    itemCounts.set(code, (itemCounts.get(code) || 0) + 1);
  }

  const isEmpty = items.length === 0;

  return (
    <section className="basket">
      <div className="basket-header">
        <h2>Your Basket</h2>
        {!isEmpty && (
          <button className="clear-btn" onClick={onClearBasket}>
            Clear All
          </button>
        )}
      </div>

      <div className="basket-items">
        {isEmpty ? (
          <p className="basket-empty">Your basket is empty</p>
        ) : (
          Array.from(itemCounts.entries()).map(([code, count]) => {
            const product = productMap.get(code)!;
            return (
              <div key={code} className="basket-item">
                <div className="item-info">
                  <span className="item-count">{count}x</span>
                  <span className="item-name">{product.name}</span>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => onRemoveProduct(code)}
                  title="Remove one"
                >
                  -
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="basket-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="summary-row">
          <span>Delivery</span>
          <span className={delivery === 0 ? 'free-delivery' : ''}>
            {delivery === 0 ? 'FREE' : formatPrice(delivery)}
          </span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </section>
  );
}
