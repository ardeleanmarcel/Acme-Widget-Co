export interface Product {
  code: string;
  name: string;
  price: number; // in cents to avoid floating point issues
}

export interface DeliveryRule {
  threshold: number; // minimum order amount in cents
  cost: number; // delivery cost in cents
}

export interface Offer {
  productCode: string;
  type: 'buy_one_get_second_half_price';
}

export interface BasketConfig {
  products: Product[];
  deliveryRules: DeliveryRule[];
  offers: Offer[];
}

export class Basket {
  private items: string[] = [];
  private productMap: Map<string, Product>;
  private deliveryRules: DeliveryRule[];
  private offers: Offer[];

  constructor(config: BasketConfig) {
    this.productMap = new Map(config.products.map(p => [p.code, p]));
    // Sort delivery rules by threshold descending for easy lookup
    this.deliveryRules = [...config.deliveryRules].sort((a, b) => b.threshold - a.threshold);
    this.offers = config.offers;
  }

  add(productCode: string): void {
    if (!this.productMap.has(productCode)) {
      throw new Error(`Unknown product code: ${productCode}`);
    }
    this.items.push(productCode);
  }

  remove(productCode: string): boolean {
    const index = this.items.indexOf(productCode);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  clear(): void {
    this.items = [];
  }

  getItems(): string[] {
    return [...this.items];
  }

  getItemCounts(): Map<string, number> {
    const counts = new Map<string, number>();
    for (const code of this.items) {
      counts.set(code, (counts.get(code) || 0) + 1);
    }
    return counts;
  }

  private calculateSubtotal(): number {
    const counts = this.getItemCounts();
    let subtotal = 0;

    for (const [code, count] of counts) {
      const product = this.productMap.get(code)!;
      const offer = this.offers.find(o => o.productCode === code);

      if (offer && offer.type === 'buy_one_get_second_half_price') {
        // For every pair, one is full price and one is half price
        const pairs = Math.floor(count / 2);
        const singles = count % 2;
        const halfPrice = Math.floor(product.price / 2);
        subtotal += pairs * (product.price + halfPrice) + singles * product.price;
      } else {
        subtotal += count * product.price;
      }
    }

    return subtotal;
  }

  private calculateDelivery(subtotal: number): number {
    for (const rule of this.deliveryRules) {
      if (subtotal >= rule.threshold) {
        return rule.cost;
      }
    }
    // Should not reach here if rules are properly configured
    return this.deliveryRules[this.deliveryRules.length - 1]?.cost || 0;
  }

  getSubtotal(): number {
    return this.calculateSubtotal() / 100;
  }

  getDelivery(): number {
    const subtotal = this.calculateSubtotal();
    return this.calculateDelivery(subtotal) / 100;
  }

  total(): number {
    const subtotal = this.calculateSubtotal();
    const delivery = this.calculateDelivery(subtotal);
    return (subtotal + delivery) / 100;
  }
}

// Default configuration for Acme Widget Co
export const defaultProducts: Product[] = [
  { code: 'R01', name: 'Red Widget', price: 3295 },
  { code: 'G01', name: 'Green Widget', price: 2495 },
  { code: 'B01', name: 'Blue Widget', price: 795 },
];

export const defaultDeliveryRules: DeliveryRule[] = [
  { threshold: 9000, cost: 0 },     // $90+ = free delivery
  { threshold: 5000, cost: 295 },   // $50-$89.99 = $2.95
  { threshold: 0, cost: 495 },      // Under $50 = $4.95
];

export const defaultOffers: Offer[] = [
  { productCode: 'R01', type: 'buy_one_get_second_half_price' },
];

export function createDefaultBasket(): Basket {
  return new Basket({
    products: defaultProducts,
    deliveryRules: defaultDeliveryRules,
    offers: defaultOffers,
  });
}
