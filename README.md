# PRZMO Athletic Lifestyle App

> Modern e-commerce platform for premium athletic wear with Nike-style aesthetics and full-stack TypeScript architecture.

![PRZMO Logo](./attached_assets/PRZMO_20250812_222429_0000_1755021196697.png)

## 🏃‍♂️ Overview

PRZMO is a premium athletic lifestyle e-commerce platform that showcases performance-driven athletic wear with a focus on street-style aesthetics. Built with modern web technologies, it features a fully functional shopping experience with product cards, cart management, wishlist functionality, and inventory tracking.

## ✨ Features

### 🛍️ E-Commerce Core
- **Nike-style Product Grid**: Professional product cards with hover effects and double layout
- **Shopping Cart**: Full cart management with quantity updates and persistence
- **Wishlist System**: Save favorite products for later purchase
- **Inventory Management**: Real-time stock status and availability
- **Size Selection**: Complete size options with validation
- **Price Display**: Original and discounted pricing with proper formatting

### 🎨 Design & UX
- **Responsive Design**: Mobile-first approach with seamless desktop experience
- **Loading Animations**: Smooth loading screens with progress indicators
- **Brand Identity**: Custom PRZMO branding with premium styling
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA labels
- **Performance**: Optimized images, lazy loading, and efficient rendering

### 🔧 Technical Features
- **Type Safety**: Full TypeScript coverage across frontend and backend
- **Database Ready**: PostgreSQL integration with Drizzle ORM
- **Session Management**: Secure user sessions with PostgreSQL storage
- **API Architecture**: RESTful endpoints with proper error handling
- **Testing Suite**: Comprehensive unit and integration tests
- **Error Boundaries**: Graceful error handling with recovery options

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- npm or yarn package manager

### Installation

1. **Clone and Install**
   ```bash
   # All dependencies are already installed in the Replit environment
   npm install  # Only if running locally
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5000`

3. **Run Tests** (Optional)
   ```bash
   npm run test
   npm run test:coverage  # With coverage report
   ```

### Environment Setup

The app runs seamlessly in the Replit environment with pre-configured:
- ✅ All dependencies installed
- ✅ Development server running
- ✅ Database connection ready
- ✅ Build tools configured

## 🏗️ Project Structure

```
PRZMO/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/       # shadcn/ui component library
│   │   │   ├── enhanced/ # Production-ready components
│   │   │   └── *.tsx     # Feature-specific components
│   │   ├── pages/        # Application pages
│   │   ├── hooks/        # Custom React hooks
│   │   ├── utils/        # Utility functions
│   │   └── lib/          # Core libraries and configurations
│   ├── index.html        # HTML template
│   └── src/main.tsx     # React application entry
├── server/               # Backend Express.js application
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API route definitions
│   ├── storage.ts       # Database abstraction layer
│   └── vite.ts         # Development server configuration
├── shared/              # Shared types and schemas
│   └── schema.ts       # Database schema and validation
├── __tests__/          # Test suites
│   ├── components/     # Component tests
│   ├── utils/         # Utility tests
│   └── setup.ts       # Test configuration
├── attached_assets/    # Static assets and images
└── docs/              # Documentation files
```

## 🎯 Usage Examples

### Product Display
```tsx
import { ProductCard } from '@/components/enhanced/product-card';

<ProductCard
  product={productData}
  onQuickView={handleQuickView}
  onAddToWishlist={handleWishlist}
  isWishlisted={isInWishlist}
/>
```

### Cart Management
```tsx
import { useCart } from '@/components/cart-context';

const { addToCart, removeFromCart, getTotalItems, getTotalPrice } = useCart();

// Add product to cart
addToCart(product, selectedSize);

// Get cart summary
const itemCount = getTotalItems();
const total = getTotalPrice();
```

### Form Validation
```tsx
import { useFormValidation, loginFormSchema } from '@/utils/validation';

const { validate, validateField } = useFormValidation(loginFormSchema);

const handleSubmit = (data) => {
  const { isValid, errors } = validate(data);
  if (isValid) {
    // Process form
  }
};
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests for CI
npm run test:ci
```

### Test Coverage Areas
- ✅ **Component Testing**: All UI components with user interactions
- ✅ **Hook Testing**: Custom hooks with state management
- ✅ **Utility Testing**: Validation, performance, and helper functions
- ✅ **Integration Testing**: Cart functionality and form submissions
- ✅ **Error Handling**: Error boundaries and API error states

### Writing Tests
```tsx
// Example component test
import { render, screen, userEvent } from '@/test-utils';
import { ProductCard } from '@/components/enhanced/product-card';

test('should add product to cart when quick add clicked', async () => {
  const user = userEvent.setup();
  render(<ProductCard product={mockProduct} />);
  
  await user.click(screen.getByTestId('button-quick-add-1'));
  
  expect(screen.getByText('Added to Cart')).toBeInTheDocument();
});
```

## 🔧 Configuration

### TypeScript Configuration
- **Strict Mode**: Enabled for maximum type safety
- **Path Mapping**: Clean imports with `@/` prefix
- **Shared Types**: Common types in `shared/` directory

### Styling Configuration
- **Tailwind CSS**: Utility-first styling with custom design system
- **shadcn/ui**: Professional component library
- **Custom Fonts**: Montserrat, Playfair Display, Cormorant Garamond
- **Color System**: PRZMO red (#EF4444) and neutral palette

### Database Configuration
- **Drizzle ORM**: Type-safe database operations
- **PostgreSQL**: Production-ready with Neon Database
- **Migrations**: Automated schema management
- **Storage Interface**: Flexible storage abstraction

## 🚢 Deployment

### Production Build
```bash
npm run build
```

### Deployment Checklist
- ✅ Environment variables configured
- ✅ Database migrations applied
- ✅ Static assets optimized
- ✅ Error monitoring setup
- ✅ Performance monitoring enabled

### Replit Deployment
The app is optimized for Replit's deployment platform:
- Pre-configured build process
- Automatic environment setup
- Database integration ready
- Zero-config deployment

## 📊 Performance & Monitoring

### Performance Features
- **Image Optimization**: Lazy loading and proper sizing
- **Code Splitting**: Optimized bundle sizes
- **Caching Strategy**: Efficient API and asset caching
- **Performance Monitoring**: Built-in tracking utilities

### Monitoring Tools
```tsx
import { performanceMonitor, memoryMonitor } from '@/utils/performance';

// Track component render times
const trackRender = performanceMonitor.trackComponentRender('MyComponent');

// Monitor memory usage (development)
memoryMonitor.logUsage('After heavy operation');

// Track async operations
await performanceMonitor.trackAsyncOperation('API_CALL', fetchData);
```

## 🛡️ Security

### Security Features
- ✅ **Input Validation**: Comprehensive Zod schemas
- ✅ **XSS Protection**: Sanitized user inputs
- ✅ **CORS Configuration**: Proper cross-origin setup
- ✅ **Session Security**: Secure session management
- ✅ **Error Handling**: No sensitive data exposure

### Security Best Practices
- Use environment variables for sensitive data
- Validate all user inputs server-side
- Implement proper authentication flows
- Regular dependency security audits

## 🤝 Contributing

### Development Workflow
1. **Setup**: Follow installation instructions
2. **Development**: Use `npm run dev` for live reloading
3. **Testing**: Write tests for new features
4. **Code Quality**: Follow TypeScript and ESLint rules
5. **Documentation**: Update README and inline docs

### Code Style
- **TypeScript**: Strict typing required
- **Components**: Functional components with hooks
- **Naming**: Descriptive names with proper conventions
- **Comments**: JSDoc for public APIs
- **Testing**: Test-driven development approach

## 📚 API Reference

### Cart API
```typescript
interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (id: number, size: string) => void;
  updateQuantity: (id: number, size: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
```

### Product API
```typescript
interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  colors: number;
  image: string;
  alt: string;
  inStock: boolean;
  sizes: string[];
  badge?: string;
}
```

## 🔄 Changelog

### Version 1.0.0 (Current)
- ✅ Initial release with full e-commerce functionality
- ✅ Nike-style product grid with hover effects
- ✅ Complete cart and wishlist system
- ✅ Responsive design with mobile optimization
- ✅ Comprehensive testing suite
- ✅ Production-ready error handling
- ✅ Performance monitoring and optimization

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Issues**: Create an issue in the repository
- **Documentation**: Check inline code documentation
- **Community**: Join development discussions

---

**PRZMO Athletic Lifestyle** - *More Choice. More Running.*

Built with ❤️ using React, TypeScript, and modern web technologies.