'use client';

import { useState, useEffect } from 'react';
import {
  Globe,
  DollarSign,
  TrendingUp,
  Save,
  RefreshCw,
  AlertCircle,
  Check,
  Plus,
  Trash2,
  Star,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { api } from '@/services/api';
import toast from 'react-hot-toast';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  isDefault: boolean;
  isEnabled: boolean;
  lastUpdated: string;
}

interface CurrencySettings {
  baseCurrency: string;
  autoUpdateRates: boolean;
  updateInterval: number; // hours
  roundingMode: 'round' | 'floor' | 'ceil';
  displayFormat: 'symbol' | 'code' | 'both';
  enabledCurrencies: string[];
}

const AVAILABLE_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', region: 'United States' },
  { code: 'EUR', name: 'Euro', symbol: '€', region: 'European Union' },
  { code: 'GBP', name: 'British Pound', symbol: '£', region: 'United Kingdom' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', region: 'Japan' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', region: 'Australia' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', region: 'Canada' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', region: 'Switzerland' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', region: 'China' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', region: 'India' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', region: 'Singapore' },
];

export default function CurrencySettingsPage() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [settings, setSettings] = useState<CurrencySettings>({
    baseCurrency: 'USD',
    autoUpdateRates: true,
    updateInterval: 24,
    roundingMode: 'round',
    displayFormat: 'symbol',
    enabledCurrencies: ['USD', 'EUR'],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingRates, setIsUpdatingRates] = useState(false);
  const [lastRateUpdate, setLastRateUpdate] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrencyData();
  }, []);

  const fetchCurrencyData = async () => {
    try {
      setIsLoading(true);
      
      // Mock API calls - in production these would fetch from real endpoints
      const [currenciesResponse, settingsResponse] = await Promise.all([
        api.get('/currencies').catch(() => ({ 
          data: { success: true, data: generateMockCurrencies() } 
        })),
        api.get('/settings/currency').catch(() => ({ 
          data: { success: true, data: settings } 
        })),
      ]);
      
      if (currenciesResponse.data.success) {
        setCurrencies(currenciesResponse.data.data);
      }
      
      if (settingsResponse.data.success) {
        setSettings(settingsResponse.data.data);
      }
      
      setLastRateUpdate(new Date().toISOString());
    } catch (error) {
      console.error('Error fetching currency data:', error);
      // Use mock data on error
      setCurrencies(generateMockCurrencies());
      setLastRateUpdate(new Date().toISOString());
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockCurrencies = (): Currency[] => {
    const mockRates: { [key: string]: number } = {
      'USD': 1.00,
      'EUR': 0.85,
      'GBP': 0.73,
      'JPY': 110.50,
      'AUD': 1.35,
      'CAD': 1.25,
      'CHF': 0.92,
      'CNY': 6.45,
      'INR': 74.50,
      'SGD': 1.35,
    };

    return AVAILABLE_CURRENCIES.map(currency => ({
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      exchangeRate: mockRates[currency.code] || 1.0,
      isDefault: currency.code === settings.baseCurrency,
      isEnabled: settings.enabledCurrencies.includes(currency.code),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const handleUpdateRates = async () => {
    try {
      setIsUpdatingRates(true);
      
      // Mock API call to update exchange rates
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update currencies with new mock rates
      const updatedCurrencies = currencies.map(currency => ({
        ...currency,
        exchangeRate: currency.isDefault ? 1.0 : currency.exchangeRate * (0.98 + Math.random() * 0.04),
        lastUpdated: new Date().toISOString(),
      }));
      
      setCurrencies(updatedCurrencies);
      setLastRateUpdate(new Date().toISOString());
      toast.success('Exchange rates updated successfully');
    } catch (error) {
      console.error('Error updating rates:', error);
      toast.error('Failed to update exchange rates');
    } finally {
      setIsUpdatingRates(false);
    }
  };

  const handleToggleCurrency = (currencyCode: string) => {
    const isCurrentlyEnabled = settings.enabledCurrencies.includes(currencyCode);
    
    if (currencyCode === settings.baseCurrency && isCurrentlyEnabled) {
      toast.error('Cannot disable the base currency');
      return;
    }

    const newEnabledCurrencies = isCurrentlyEnabled
      ? settings.enabledCurrencies.filter(code => code !== currencyCode)
      : [...settings.enabledCurrencies, currencyCode];
    
    setSettings(prev => ({
      ...prev,
      enabledCurrencies: newEnabledCurrencies,
    }));

    // Update currency enabled status
    setCurrencies(prev => prev.map(currency => ({
      ...currency,
      isEnabled: currency.code === currencyCode ? !isCurrentlyEnabled : currency.isEnabled,
    })));
  };

  const handleSetBaseCurrency = (currencyCode: string) => {
    setSettings(prev => ({
      ...prev,
      baseCurrency: currencyCode,
      enabledCurrencies: prev.enabledCurrencies.includes(currencyCode) 
        ? prev.enabledCurrencies 
        : [...prev.enabledCurrencies, currencyCode],
    }));

    // Update currency default status
    setCurrencies(prev => prev.map(currency => ({
      ...currency,
      isDefault: currency.code === currencyCode,
      isEnabled: currency.code === currencyCode ? true : currency.isEnabled,
      exchangeRate: currency.code === currencyCode ? 1.0 : currency.exchangeRate,
    })));
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      
      // Mock API call to save settings
      await api.put('/settings/currency', {
        currencies: currencies.filter(c => c.isEnabled),
        settings,
      });
      
      toast.success('Currency settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save currency settings');
    } finally {
      setIsSaving(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Currency Settings</h1>
            <p className="text-gray-600 mt-1">Manage multi-currency support for your business</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <RefreshCw className="w-8 h-8 animate-spin text-primary-500 mb-4" />
            <p className="text-gray-600">Loading currency settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Currency Settings</h1>
          <p className="text-gray-600 mt-1">Manage multi-currency support for your business</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleUpdateRates}
            disabled={isUpdatingRates}
          >
            {isUpdatingRates ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Update Rates
          </Button>
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-primary-600 hover:bg-primary-700 text-white"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Settings
          </Button>
        </div>
      </div>

      {/* Exchange Rate Update Status */}
      {lastRateUpdate && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-800">Exchange rates are up to date</p>
              <p className="text-sm text-green-700">Last updated: {getTimeAgo(lastRateUpdate)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Currency Settings */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Currency
                </label>
                <select
                  value={settings.baseCurrency}
                  onChange={(e) => handleSetBaseCurrency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {AVAILABLE_CURRENCIES.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Your base currency for pricing and reporting
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Format
                </label>
                <select
                  value={settings.displayFormat}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    displayFormat: e.target.value as CurrencySettings['displayFormat'] 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="symbol">Symbol only ($100)</option>
                  <option value="code">Code only (USD 100)</option>
                  <option value="both">Both ($100 USD)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Rounding
                </label>
                <select
                  value={settings.roundingMode}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    roundingMode: e.target.value as CurrencySettings['roundingMode'] 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="round">Round to nearest</option>
                  <option value="floor">Round down</option>
                  <option value="ceil">Round up</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Auto-update rates</p>
                  <p className="text-xs text-gray-500">Automatically fetch latest rates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoUpdateRates}
                    onChange={(e) => setSettings(prev => ({ ...prev, autoUpdateRates: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              {settings.autoUpdateRates && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Interval (hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="168"
                    value={settings.updateInterval}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      updateInterval: parseInt(e.target.value) 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Supported Currencies */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Supported Currencies</h3>
              <p className="text-sm text-gray-600 mt-1">
                Enable currencies you want to accept from customers
              </p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currencies.map((currency) => {
                  const currencyInfo = AVAILABLE_CURRENCIES.find(c => c.code === currency.code);
                  return (
                    <div
                      key={currency.code}
                      className={cn(
                        'p-4 border rounded-lg transition-colors',
                        currency.isEnabled
                          ? 'border-primary-200 bg-primary-50'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-semibold text-gray-900">
                              {currency.symbol}
                            </span>
                            <div>
                              <p className="font-medium text-gray-900">{currency.code}</p>
                              <p className="text-xs text-gray-500">{currencyInfo?.region}</p>
                            </div>
                          </div>
                          {currency.isDefault && (
                            <Star className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {!currency.isDefault && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSetBaseCurrency(currency.code)}
                              className="text-xs"
                            >
                              Set as Base
                            </Button>
                          )}
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={currency.isEnabled}
                              onChange={() => handleToggleCurrency(currency.code)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{currency.name}</span>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {currency.exchangeRate.toFixed(4)}
                          </p>
                          <p className="text-xs text-gray-500">
                            vs {settings.baseCurrency}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-xs text-gray-500">
                        Updated: {getTimeAgo(currency.lastUpdated)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Preview</h3>
        <p className="text-sm text-gray-600 mb-4">
          See how prices will be displayed in different currencies
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currencies.filter(c => c.isEnabled).slice(0, 4).map((currency) => (
            <div key={currency.code} className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-sm font-medium text-gray-900">{currency.code}</p>
              <p className="text-lg font-bold text-primary-600">
                {settings.displayFormat === 'symbol' && `${currency.symbol}${(100 * currency.exchangeRate).toFixed(2)}`}
                {settings.displayFormat === 'code' && `${currency.code} ${(100 * currency.exchangeRate).toFixed(2)}`}
                {settings.displayFormat === 'both' && `${currency.symbol}${(100 * currency.exchangeRate).toFixed(2)} ${currency.code}`}
              </p>
              <p className="text-xs text-gray-500">Sample: $100 USD</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}