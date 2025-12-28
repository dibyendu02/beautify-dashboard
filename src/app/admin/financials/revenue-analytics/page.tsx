'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Download,
  Filter,
  BarChart,
  PieChart,
  Users,
  Store,
  CreditCard,
  Target
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface RevenueData {
  period: string;
  totalRevenue: number;
  commission: number;
  netRevenue: number;
  growth: number;
  transactions: number;
}

interface MerchantRevenue {
  merchantName: string;
  revenue: number;
  growth: number;
  transactions: number;
}

const mockRevenueData: RevenueData[] = [
  {
    period: 'Jan 2024',
    totalRevenue: 125000,
    commission: 6250,
    netRevenue: 118750,
    growth: 12.5,
    transactions: 850
  },
  {
    period: 'Dec 2023',
    totalRevenue: 110000,
    commission: 5500,
    netRevenue: 104500,
    growth: 8.2,
    transactions: 720
  },
  {
    period: 'Nov 2023',
    totalRevenue: 102000,
    commission: 5100,
    netRevenue: 96900,
    growth: 15.3,
    transactions: 680
  },
  {
    period: 'Oct 2023',
    totalRevenue: 88500,
    commission: 4425,
    netRevenue: 84075,
    growth: -2.1,
    transactions: 590
  }
];

const mockTopMerchants: MerchantRevenue[] = [
  {
    merchantName: 'Glamour Spa',
    revenue: 25000,
    growth: 18.5,
    transactions: 180
  },
  {
    merchantName: 'Beauty Boutique',
    revenue: 22000,
    growth: 12.3,
    transactions: 156
  },
  {
    merchantName: 'Hair Studio Pro',
    revenue: 18500,
    growth: 8.7,
    transactions: 142
  },
  {
    merchantName: 'Nails & More',
    revenue: 15200,
    growth: 15.2,
    transactions: 128
  },
  {
    merchantName: 'Wellness Center',
    revenue: 14800,
    growth: 6.9,
    transactions: 98
  }
];

export default function AdminRevenueAnalyticsPage() {
  const [dateRange, setDateRange] = useState('monthly');
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  const currentRevenue = mockRevenueData[0];
  const previousRevenue = mockRevenueData[1];
  const revenueGrowth = ((currentRevenue.totalRevenue - previousRevenue.totalRevenue) / previousRevenue.totalRevenue) * 100;
  const totalMerchants = 45;
  const avgRevenuePerMerchant = currentRevenue.totalRevenue / totalMerchants;

  return (
    <>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revenue Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive revenue insights and performance metrics</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentRevenue.totalRevenue)}</p>
              <div className="flex items-center mt-2">
                {revenueGrowth >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(revenueGrowth).toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Platform Commission</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentRevenue.commission)}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">
                  {((currentRevenue.commission / currentRevenue.totalRevenue) * 100).toFixed(1)}% of total
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{currentRevenue.transactions.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">
                  Avg: {formatCurrency(currentRevenue.totalRevenue / currentRevenue.transactions)}
                </span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg per Merchant</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgRevenuePerMerchant)}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">
                  {totalMerchants} active merchants
                </span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Store className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Total Revenue</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Net Revenue</span>
            </div>
          </div>
        </div>
        
        {/* Simplified chart representation */}
        <div className="space-y-4">
          {mockRevenueData.map((data, index) => (
            <div key={data.period} className="flex items-center space-x-4">
              <div className="w-16 text-sm text-gray-600">{data.period}</div>
              <div className="flex-1 bg-gray-100 rounded-full h-8 relative">
                <div 
                  className="bg-blue-500 h-full rounded-full relative"
                  style={{ width: `${(data.totalRevenue / 125000) * 100}%` }}
                >
                  <div 
                    className="bg-green-500 h-full rounded-full"
                    style={{ width: `${(data.netRevenue / data.totalRevenue) * 100}%` }}
                  ></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-end pr-4">
                  <span className="text-sm font-medium text-white">{formatCurrency(data.totalRevenue)}</span>
                </div>
              </div>
              <div className={`text-sm font-medium ${data.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.growth >= 0 ? '+' : ''}{data.growth}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Merchants */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Merchants</h3>
          <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
            View All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-500">Merchant</th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">Revenue</th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">Growth</th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">Transactions</th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">Avg Transaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockTopMerchants.map((merchant, index) => (
                <tr key={merchant.merchantName} className="hover:bg-gray-50">
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{merchant.merchantName}</div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(merchant.revenue)}</div>
                  </td>
                  <td className="py-4">
                    <div className={`flex items-center text-sm font-medium ${merchant.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {merchant.growth >= 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {Math.abs(merchant.growth)}%
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="text-sm text-gray-900">{merchant.transactions}</div>
                  </td>
                  <td className="py-4">
                    <div className="text-sm text-gray-900">{formatCurrency(merchant.revenue / merchant.transactions)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Service Category</h3>
          <div className="space-y-3">
            {[
              { category: 'Hair Services', amount: 45000, percentage: 36 },
              { category: 'Spa & Wellness', amount: 35000, percentage: 28 },
              { category: 'Nail Services', amount: 25000, percentage: 20 },
              { category: 'Facial Treatments', amount: 20000, percentage: 16 }
            ].map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 bg-gray-100 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-900">{item.category}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{formatCurrency(item.amount)}</div>
                  <div className="text-xs text-gray-500">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method Distribution</h3>
          <div className="space-y-3">
            {[
              { method: 'Credit Cards', amount: 87500, percentage: 70 },
              { method: 'Digital Wallets', amount: 25000, percentage: 20 },
              { method: 'Bank Transfers', amount: 10000, percentage: 8 },
              { method: 'Cash', amount: 2500, percentage: 2 }
            ].map((item) => (
              <div key={item.method} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 bg-gray-100 rounded-full h-2 mr-3">
                    <div 
                      className="bg-green-500 h-full rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-900">{item.method}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{formatCurrency(item.amount)}</div>
                  <div className="text-xs text-gray-500">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}