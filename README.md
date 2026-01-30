# Acme Widget Co - Shopping Basket

A proof of concept sales system for Acme Widget Co, implementing a shopping basket with dynamic pricing, delivery tiers, and special offers.

## Features

- **Product Catalog**: Three widget types (Red, Green, Blue) with individual pricing
- **Dynamic Delivery Pricing**: Tiered delivery costs based on order total
- **Special Offers**: "Buy one red widget, get the second half price" promotion
- **Clean React UI**: Simple, responsive interface for adding products and viewing basket totals

## Product Catalog

| Product       | Code | Price  |
|---------------|------|--------|
| Red Widget    | R01  | $32.95 |
| Green Widget  | G01  | $24.95 |
| Blue Widget   | B01  | $7.95  |

## Delivery Rules

| Order Total   | Delivery Cost |
|---------------|---------------|
| Under $50     | $4.95         |
| $50 - $89.99  | $2.95         |
| $90 or more   | Free          |

## Special Offers

- **Red Widget Deal**: Buy one red widget, get the second half price

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Architecture

### Basket Class (`src/lib/basket.ts`)

The core basket logic is implemented as a `Basket` class with:

- **Initialization**: Takes product catalog, delivery rules, and offers as configuration
- **`add(productCode)`**: Adds a product to the basket
- **`remove(productCode)`**: Removes one instance of a product from the basket
- **`total()`**: Returns the total cost including delivery and offer discounts

#### Price Calculation

- All prices are stored internally as cents (integers) to avoid floating-point precision issues
- The "buy one get second half price" offer uses floor division for the half price calculation
- Delivery is calculated after applying all offers

### React Components

- **`App.tsx`**: Main component managing basket state
- **`ProductCatalog.tsx`**: Displays available products with add buttons
- **`ShoppingBasket.tsx`**: Shows basket contents, subtotal, delivery, and total

## Test Cases

The implementation passes all provided test cases:

| Products                    | Expected Total |
|-----------------------------|----------------|
| B01, G01                    | $37.85         |
| R01, R01                    | $54.37         |
| R01, G01                    | $60.85         |
| B01, B01, R01, R01, R01     | $98.27         |

Run the tests with:

```bash
npx tsx src/lib/basket.test.ts
```

## Assumptions

1. **Price Precision**: All prices are handled in cents internally to avoid floating-point errors. The half-price discount uses floor division (e.g., $32.95 / 2 = $16.47, not $16.48).

2. **Offer Application**: The "buy one get second half price" offer applies to pairs of red widgets. With 3 red widgets, one pair gets the discount and one is full price.

3. **Delivery Calculation**: Delivery cost is based on the subtotal after offers are applied.

4. **Extensibility**: The system is designed to accept different products, delivery rules, and offers through configuration, making it easy to extend.

## Tech Stack

- TypeScript
- React 19
- Vite 7
