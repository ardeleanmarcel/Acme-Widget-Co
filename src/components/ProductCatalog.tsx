import { Product, Offer } from '../lib/basket';

interface ProductCatalogProps {
  products: Product[];
  offers: Offer[];
  onAddProduct: (code: string) => void;
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function getColorClass(code: string): string {
  if (code.startsWith('R')) return 'red';
  if (code.startsWith('G')) return 'green';
  if (code.startsWith('B')) return 'blue';
  return '';
}

export function ProductCatalog({ products, offers, onAddProduct }: ProductCatalogProps) {
  const offerCodes = new Set(offers.map(o => o.productCode));

  return (
    <section className="catalog">
      <h2>Our Products</h2>
      <div className="product-list">
        {products.map(product => (
          <div key={product.code} className={`product-card ${getColorClass(product.code)}`}>
            <div className="product-info">
              <span className="product-name">{product.name}</span>
              <span className="product-code">{product.code}</span>
              {offerCodes.has(product.code) && (
                <span className="offer-badge">Buy 1 get 2nd half price!</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="product-price">{formatPrice(product.price)}</span>
              <button
                className="add-btn"
                onClick={() => onAddProduct(product.code)}
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
