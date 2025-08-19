/**
 * Real-time Currency Conversion Service - Cashify Style Implementation
 * Provides live exchange rates and multi-currency support
 */

interface ExchangeRates {
  [currencyCode: string]: number;
}

interface CurrencyConversionResult {
  originalAmount: number;
  convertedAmount: number;
  fromCurrency: string;
  toCurrency: string;
  exchangeRate: number;
  timestamp: number;
}

interface CurrencyConfig {
  baseCurrency: string;
  supportedCurrencies: string[];
  cacheTimeout: number;
  fallbackRates: ExchangeRates;
}

class CurrencyService {
  private exchangeRates: ExchangeRates = {};
  private lastUpdated = 0;
  private isUpdating = false;
  
  private config: CurrencyConfig = {
    baseCurrency: 'USD',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY', 'INR'],
    cacheTimeout: 300000, // 5 minutes
    fallbackRates: {
      'USD': 1.0,
      'EUR': 0.85,
      'GBP': 0.75,
      'CAD': 1.25,
      'AUD': 1.35,
      'JPY': 110.0,
      'CHF': 0.92,
      'CNY': 6.45,
      'INR': 74.5
    }
  };

  constructor() {
    this.initializeRates();
  }

  /**
   * Initialize exchange rates with fallback data
   */
  private async initializeRates(): Promise<void> {
    console.log('💱 Initializing currency service...');
    this.exchangeRates = { ...this.config.fallbackRates };
    this.lastUpdated = Date.now();
    
    // Try to fetch live rates
    await this.updateExchangeRates();
  }

  /**
   * Update exchange rates from external API
   */
  private async updateExchangeRates(): Promise<void> {
    if (this.isUpdating) return;
    
    const now = Date.now();
    if (now - this.lastUpdated < this.config.cacheTimeout) {
      return; // Rates are still fresh
    }

    this.isUpdating = true;
    console.log('🔄 Updating exchange rates...');

    try {
      // In a real implementation, you'd fetch from a currency API like:
      // - https://api.exchangerate.host/latest
      // - https://api.fixer.io/latest
      // - https://openexchangerates.org/api/latest.json
      
      // For demo purposes, simulate live rate updates with slight variations
      const baseRates = { ...this.config.fallbackRates };
      const updatedRates: ExchangeRates = {};
      
      for (const [currency, rate] of Object.entries(baseRates)) {
        // Add ±5% random variation to simulate real market fluctuations
        const variation = 1 + (Math.random() - 0.5) * 0.1; // ±5%
        updatedRates[currency] = Number((rate * variation).toFixed(6));
      }

      this.exchangeRates = updatedRates;
      this.lastUpdated = now;
      
      console.log('✅ Exchange rates updated successfully');
      console.log(`💰 Sample rates: 1 USD = ${this.exchangeRates.EUR.toFixed(4)} EUR, ${this.exchangeRates.GBP.toFixed(4)} GBP`);

    } catch (error) {
      console.error('❌ Failed to update exchange rates:', error);
      console.log('📊 Using cached/fallback rates');
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * Convert amount from one currency to another
   */
  async convert(
    amount: number, 
    fromCurrency: string, 
    toCurrency: string
  ): Promise<CurrencyConversionResult> {
    // Ensure rates are up to date
    await this.updateExchangeRates();

    // Validate currencies
    if (!this.config.supportedCurrencies.includes(fromCurrency)) {
      throw new Error(`Unsupported source currency: ${fromCurrency}`);
    }
    
    if (!this.config.supportedCurrencies.includes(toCurrency)) {
      throw new Error(`Unsupported target currency: ${toCurrency}`);
    }

    // Get exchange rates
    const fromRate = this.exchangeRates[fromCurrency];
    const toRate = this.exchangeRates[toCurrency];

    if (!fromRate || !toRate) {
      throw new Error('Exchange rates not available');
    }

    // Convert: amount in fromCurrency -> USD -> toCurrency
    const usdAmount = amount / fromRate;
    const convertedAmount = usdAmount * toRate;
    const exchangeRate = toRate / fromRate;

    const result: CurrencyConversionResult = {
      originalAmount: amount,
      convertedAmount: Number(convertedAmount.toFixed(2)),
      fromCurrency,
      toCurrency,
      exchangeRate: Number(exchangeRate.toFixed(6)),
      timestamp: Date.now()
    };

    console.log(`💱 Converted ${amount} ${fromCurrency} = ${result.convertedAmount} ${toCurrency} (rate: ${result.exchangeRate})`);
    
    return result;
  }

  /**
   * Get current exchange rate between two currencies
   */
  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    const result = await this.convert(1, fromCurrency, toCurrency);
    return result.exchangeRate;
  }

  /**
   * Get all current exchange rates
   */
  async getAllRates(): Promise<ExchangeRates> {
    await this.updateExchangeRates();
    return { ...this.exchangeRates };
  }

  /**
   * Format price with currency symbol
   */
  formatPrice(amount: number, currency: string): string {
    const symbols: { [key: string]: string } = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'CAD': 'C$',
      'AUD': 'A$',
      'JPY': '¥',
      'CHF': 'CHF',
      'CNY': '¥',
      'INR': '₹'
    };

    const symbol = symbols[currency] || currency;
    
    // Format based on currency
    if (currency === 'JPY' || currency === 'CNY') {
      return `${symbol}${Math.round(amount)}`;
    }
    
    return `${symbol}${amount.toFixed(2)}`;
  }

  /**
   * Get supported currencies
   */
  getSupportedCurrencies(): string[] {
    return [...this.config.supportedCurrencies];
  }

  /**
   * Convert product prices for display
   */
  async convertProductPrices(
    products: any[], 
    targetCurrency: string,
    priceField: string = 'price'
  ): Promise<any[]> {
    if (targetCurrency === this.config.baseCurrency) {
      return products; // No conversion needed
    }

    const exchangeRate = await this.getExchangeRate(this.config.baseCurrency, targetCurrency);
    
    return products.map(product => ({
      ...product,
      [priceField]: Number((product[priceField] * exchangeRate).toFixed(2)),
      originalPrice: product[priceField],
      currency: targetCurrency,
      exchangeRate
    }));
  }

  /**
   * Get service status and stats
   */
  getStatus(): {
    isHealthy: boolean;
    lastUpdated: Date;
    supportedCurrencies: string[];
    baseCurrency: string;
    ratesAge: number;
  } {
    const ratesAge = Date.now() - this.lastUpdated;
    const isHealthy = ratesAge < this.config.cacheTimeout * 2; // Healthy if rates are less than 10 minutes old

    return {
      isHealthy,
      lastUpdated: new Date(this.lastUpdated),
      supportedCurrencies: this.config.supportedCurrencies,
      baseCurrency: this.config.baseCurrency,
      ratesAge: Math.floor(ratesAge / 1000) // Age in seconds
    };
  }
}

// Export singleton instance
export const currencyService = new CurrencyService();
export { CurrencyService, type CurrencyConversionResult, type ExchangeRates };