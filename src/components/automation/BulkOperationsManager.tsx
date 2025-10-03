'use client';

import React, { useState, useEffect } from 'react';
import {
  Zap,
  CheckSquare,
  Square,
  Play,
  Pause,
  Clock,
  Users,
  Calendar,
  Mail,
  MessageSquare,
  Filter,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Settings,
  Target,
  BarChart3,
  FileText,
  Trash2,
  Edit3,
  Plus,
  Search,
  ArrowRight,
  Database,
  Bot,
  Timer,
  Bell,
} from 'lucide-react';
import { formatDate, formatCurrency, cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

interface BulkOperation {
  _id: string;
  name: string;
  type: 'booking_update' | 'customer_communication' | 'data_export' | 'promotion_apply' | 'reminder_send';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'scheduled';
  targetCount: number;
  processedCount: number;
  successCount: number;
  failedCount: number;
  createdAt: string;
  scheduledAt?: string;
  completedAt?: string;
  description: string;
  parameters: Record<string, any>;
  progress: number;
  errors?: string[];
  results?: any;
}

interface AutomationRule {
  _id: string;
  name: string;
  trigger: 'new_booking' | 'booking_reminder' | 'customer_birthday' | 'no_show' | 'review_request' | 'follow_up';
  conditions: Array<{
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in_range';
    value: any;
  }>;
  actions: Array<{
    type: 'send_email' | 'send_sms' | 'update_status' | 'add_tag' | 'create_task' | 'apply_discount';
    parameters: Record<string, any>;
  }>;
  status: 'active' | 'inactive';
  lastTriggered?: string;
  triggerCount: number;
  successRate: number;
  createdAt: string;
}

interface ScheduledTask {
  _id: string;
  name: string;
  type: 'bulk_operation' | 'automation_rule' | 'report_generation';
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
    time: string;
    days?: string[];
    date?: string;
  };
  status: 'active' | 'paused';
  lastRun?: string;
  nextRun: string;
  runCount: number;
  successRate: number;
  parameters: Record<string, any>;
}

export default function BulkOperationsManager() {
  const [currentView, setCurrentView] = useState<'operations' | 'automation' | 'scheduled'>('operations');
  const [bulkOperations, setBulkOperations] = useState<BulkOperation[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Mock API calls - replace with actual API
      const [operationsRes, rulesRes, tasksRes] = await Promise.allSettled([
        fetch('/api/bulk-operations').then(r => r.json()).catch(() => generateMockOperations()),
        fetch('/api/automation-rules').then(r => r.json()).catch(() => generateMockRules()),
        fetch('/api/scheduled-tasks').then(r => r.json()).catch(() => generateMockTasks()),
      ]);

      if (operationsRes.status === 'fulfilled') setBulkOperations(operationsRes.value);
      if (rulesRes.status === 'fulfilled') setAutomationRules(rulesRes.value);
      if (tasksRes.status === 'fulfilled') setScheduledTasks(tasksRes.value);

    } catch (error) {
      console.error('Error loading data:', error);
      
      // Load mock data as fallback
      setBulkOperations(generateMockOperations());
      setAutomationRules(generateMockRules());
      setScheduledTasks(generateMockTasks());
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockOperations = (): BulkOperation[] => [
    {
      _id: '1',
      name: 'Send Appointment Reminders',
      type: 'customer_communication',
      status: 'completed',
      targetCount: 45,
      processedCount: 45,
      successCount: 42,
      failedCount: 3,
      createdAt: '2024-09-23T08:00:00Z',
      completedAt: '2024-09-23T08:15:00Z',
      description: 'Send SMS reminders to customers with appointments tomorrow',
      parameters: {
        template: 'appointment_reminder',
        channel: 'sms',
        timeframe: '24_hours',
      },
      progress: 100,
      results: {
        sent: 42,
        failed: 3,
        deliveryRate: 93.3,
      }
    },
    {
      _id: '2',
      name: 'Update Booking Status',
      type: 'booking_update',
      status: 'running',
      targetCount: 23,
      processedCount: 15,
      successCount: 15,
      failedCount: 0,
      createdAt: '2024-09-23T09:00:00Z',
      description: 'Mark completed bookings as completed',
      parameters: {
        status: 'completed',
        dateRange: '2024-09-22',
      },
      progress: 65,
    },
    {
      _id: '3',
      name: 'Export Customer Data',
      type: 'data_export',
      status: 'scheduled',
      targetCount: 340,
      processedCount: 0,
      successCount: 0,
      failedCount: 0,
      createdAt: '2024-09-23T07:00:00Z',
      scheduledAt: '2024-09-24T02:00:00Z',
      description: 'Weekly customer data export for analytics',
      parameters: {
        format: 'csv',
        fields: ['all'],
        dateRange: 'last_7_days',
      },
      progress: 0,
    },
  ];

  const generateMockRules = (): AutomationRule[] => [
    {
      _id: '1',
      name: 'New Booking Confirmation',
      trigger: 'new_booking',
      conditions: [
        { field: 'status', operator: 'equals', value: 'confirmed' }
      ],
      actions: [
        {
          type: 'send_email',
          parameters: {
            template: 'booking_confirmation',
            delay: 0,
          }
        }
      ],
      status: 'active',
      lastTriggered: '2024-09-23T10:30:00Z',
      triggerCount: 156,
      successRate: 98.7,
      createdAt: '2024-08-01T00:00:00Z',
    },
    {
      _id: '2',
      name: 'Birthday Promotion',
      trigger: 'customer_birthday',
      conditions: [
        { field: 'loyalty_tier', operator: 'not_equals', value: 'inactive' }
      ],
      actions: [
        {
          type: 'send_email',
          parameters: {
            template: 'birthday_offer',
            delay: 0,
          }
        },
        {
          type: 'apply_discount',
          parameters: {
            code: 'BIRTHDAY20',
            discount: 20,
            validity: 30,
          }
        }
      ],
      status: 'active',
      lastTriggered: '2024-09-22T09:00:00Z',
      triggerCount: 23,
      successRate: 100,
      createdAt: '2024-07-15T00:00:00Z',
    },
    {
      _id: '3',
      name: 'No Show Follow Up',
      trigger: 'no_show',
      conditions: [
        { field: 'booking_value', operator: 'greater_than', value: 50 }
      ],
      actions: [
        {
          type: 'send_sms',
          parameters: {
            template: 'no_show_followup',
            delay: 60,
          }
        },
        {
          type: 'add_tag',
          parameters: {
            tag: 'no_show_risk',
          }
        }
      ],
      status: 'active',
      lastTriggered: '2024-09-20T15:45:00Z',
      triggerCount: 8,
      successRate: 87.5,
      createdAt: '2024-08-10T00:00:00Z',
    },
  ];

  const generateMockTasks = (): ScheduledTask[] => [
    {
      _id: '1',
      name: 'Daily Revenue Report',
      type: 'report_generation',
      schedule: {
        frequency: 'daily',
        time: '08:00',
      },
      status: 'active',
      lastRun: '2024-09-23T08:00:00Z',
      nextRun: '2024-09-24T08:00:00Z',
      runCount: 45,
      successRate: 100,
      parameters: {
        reportType: 'revenue',
        recipients: ['owner@salon.com'],
        format: 'pdf',
      },
    },
    {
      _id: '2',
      name: 'Weekly Customer Backup',
      type: 'bulk_operation',
      schedule: {
        frequency: 'weekly',
        time: '02:00',
        days: ['sunday'],
      },
      status: 'active',
      lastRun: '2024-09-22T02:00:00Z',
      nextRun: '2024-09-29T02:00:00Z',
      runCount: 12,
      successRate: 91.7,
      parameters: {
        operation: 'export_customers',
        destination: 'cloud_storage',
      },
    },
  ];

  const createBulkOperation = async (operationData: any) => {
    try {
      toast.loading('Creating bulk operation...', { id: 'create' });
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newOperation: BulkOperation = {
        _id: Date.now().toString(),
        name: operationData.name,
        type: operationData.type,
        status: 'pending',
        targetCount: operationData.targetCount || 0,
        processedCount: 0,
        successCount: 0,
        failedCount: 0,
        createdAt: new Date().toISOString(),
        description: operationData.description,
        parameters: operationData.parameters,
        progress: 0,
      };
      
      setBulkOperations(prev => [newOperation, ...prev]);
      
      toast.success('Bulk operation created successfully', { id: 'create' });
      setShowCreateModal(false);
    } catch (error) {
      toast.error('Failed to create bulk operation', { id: 'create' });
    }
  };

  const runBulkOperation = async (operationId: string) => {
    try {
      toast.loading('Starting bulk operation...', { id: 'run' });
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBulkOperations(prev => prev.map(op => 
        op._id === operationId 
          ? { ...op, status: 'running' as const, progress: 0 }
          : op
      ));
      
      // Simulate progress updates
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          setBulkOperations(prev => prev.map(op => 
            op._id === operationId 
              ? { 
                  ...op, 
                  status: 'completed' as const, 
                  progress: 100,
                  processedCount: op.targetCount,
                  successCount: Math.floor(op.targetCount * 0.95),
                  failedCount: Math.ceil(op.targetCount * 0.05),
                  completedAt: new Date().toISOString(),
                }
              : op
          ));
          
          toast.success('Bulk operation completed', { id: 'run' });
        } else {
          setBulkOperations(prev => prev.map(op => 
            op._id === operationId 
              ? { 
                  ...op, 
                  progress,
                  processedCount: Math.floor((progress / 100) * op.targetCount),
                }
              : op
          ));
        }
      }, 500);
      
    } catch (error) {
      toast.error('Failed to start bulk operation', { id: 'run' });
    }
  };

  const toggleAutomationRule = async (ruleId: string) => {
    try {
      const rule = automationRules.find(r => r._id === ruleId);
      const newStatus = rule?.status === 'active' ? 'inactive' : 'active';
      
      toast.loading(`${newStatus === 'active' ? 'Activating' : 'Deactivating'} rule...`, { id: 'toggle' });
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setAutomationRules(prev => prev.map(r => 
        r._id === ruleId ? { ...r, status: newStatus as 'active' | 'inactive' } : r
      ));
      
      toast.success(`Rule ${newStatus === 'active' ? 'activated' : 'deactivated'}`, { id: 'toggle' });
    } catch (error) {
      toast.error('Failed to toggle rule status', { id: 'toggle' });
    }
  };

  const pauseScheduledTask = async (taskId: string) => {
    try {
      const task = scheduledTasks.find(t => t._id === taskId);
      const newStatus = task?.status === 'active' ? 'paused' : 'active';
      
      toast.loading(`${newStatus === 'active' ? 'Resuming' : 'Pausing'} task...`, { id: 'pause' });
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setScheduledTasks(prev => prev.map(t => 
        t._id === taskId ? { ...t, status: newStatus as 'active' | 'paused' } : t
      ));
      
      toast.success(`Task ${newStatus === 'active' ? 'resumed' : 'paused'}`, { id: 'pause' });
    } catch (error) {
      toast.error('Failed to update task status', { id: 'pause' });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'running': return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'scheduled': return <Clock className="w-5 h-5 text-purple-600" />;
      case 'active': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'inactive': case 'paused': return <Pause className="w-5 h-5 text-gray-600" />;
      default: return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': case 'active': return 'text-green-600 bg-green-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'scheduled': return 'text-purple-600 bg-purple-100';
      case 'inactive': case 'paused': return 'text-gray-600 bg-gray-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getOperationTypeIcon = (type: string) => {
    switch (type) {
      case 'booking_update': return <Calendar className="w-4 h-4" />;
      case 'customer_communication': return <MessageSquare className="w-4 h-4" />;
      case 'data_export': return <Download className="w-4 h-4" />;
      case 'promotion_apply': return <Target className="w-4 h-4" />;
      case 'reminder_send': return <Bell className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bulk Operations & Automation</h1>
          <p className="text-gray-600">Manage bulk operations, automation rules, and scheduled tasks</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: 'operations', label: 'Bulk Operations', icon: Database },
              { key: 'automation', label: 'Automation', icon: Bot },
              { key: 'scheduled', label: 'Scheduled', icon: Timer },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setCurrentView(key as any)}
                className={cn(
                  'flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  currentView === key
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create {currentView === 'operations' ? 'Operation' : currentView === 'automation' ? 'Rule' : 'Task'}</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Active Operations</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {bulkOperations.filter(op => op.status === 'running').length}
              </p>
              <p className="text-sm text-blue-600 mt-2">Currently running</p>
            </div>
            <div className="p-3 rounded-full bg-blue-500">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Automation Rules</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {automationRules.filter(rule => rule.status === 'active').length}
              </p>
              <p className="text-sm text-green-600 mt-2">Active rules</p>
            </div>
            <div className="p-3 rounded-full bg-green-500">
              <Bot className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Scheduled Tasks</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {scheduledTasks.filter(task => task.status === 'active').length}
              </p>
              <p className="text-sm text-purple-600 mt-2">Active schedules</p>
            </div>
            <div className="p-3 rounded-full bg-purple-500">
              <Timer className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">94.2%</p>
              <p className="text-sm text-orange-600 mt-2">Overall performance</p>
            </div>
            <div className="p-3 rounded-full bg-orange-500">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {currentView === 'operations' && (
        <div className="space-y-6">
          {/* Bulk Operations */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Bulk Operations</h3>
              <div className="flex items-center space-x-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="running">Running</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {bulkOperations
                .filter(op => filterStatus === 'all' || op.status === filterStatus)
                .map((operation) => (
                <div key={operation._id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary-100">
                        {getOperationTypeIcon(operation.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{operation.name}</h4>
                        <p className="text-sm text-gray-500">{operation.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                        getStatusColor(operation.status)
                      )}>
                        {getStatusIcon(operation.status)}
                        <span className="ml-1">{operation.status}</span>
                      </span>
                      {operation.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => runBulkOperation(operation._id)}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Run
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {operation.status === 'running' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium text-gray-900">{Math.round(operation.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${operation.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Target</p>
                      <p className="font-semibold text-gray-900">{operation.targetCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Processed</p>
                      <p className="font-semibold text-gray-900">{operation.processedCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Success</p>
                      <p className="font-semibold text-green-600">{operation.successCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Failed</p>
                      <p className="font-semibold text-red-600">{operation.failedCount}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Created {formatDate(operation.createdAt)}</span>
                    {operation.completedAt && (
                      <span>Completed {formatDate(operation.completedAt)}</span>
                    )}
                    {operation.scheduledAt && (
                      <span>Scheduled for {formatDate(operation.scheduledAt)}</span>
                    )}
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentView === 'automation' && (
        <div className="space-y-6">
          {/* Automation Rules */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Automation Rules</h3>
            
            <div className="space-y-4">
              {automationRules.map((rule) => (
                <div key={rule._id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-green-100">
                        <Bot className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{rule.name}</h4>
                        <p className="text-sm text-gray-500 capitalize">
                          Trigger: {rule.trigger.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                        getStatusColor(rule.status)
                      )}>
                        {rule.status}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAutomationRule(rule._id)}
                      >
                        {rule.status === 'active' ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Conditions</p>
                      <p className="font-medium text-gray-900">{rule.conditions.length} condition(s)</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Actions</p>
                      <p className="font-medium text-gray-900">{rule.actions.length} action(s)</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Success Rate</p>
                      <p className="font-medium text-gray-900">{rule.successRate}%</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Actions:</p>
                    <div className="flex flex-wrap gap-2">
                      {rule.actions.map((action, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {action.type.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Triggered {rule.triggerCount} times</span>
                    {rule.lastTriggered && (
                      <span>Last triggered {formatDate(rule.lastTriggered)}</span>
                    )}
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentView === 'scheduled' && (
        <div className="space-y-6">
          {/* Scheduled Tasks */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Scheduled Tasks</h3>
            
            <div className="space-y-4">
              {scheduledTasks.map((task) => (
                <div key={task._id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-purple-100">
                        <Timer className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{task.name}</h4>
                        <p className="text-sm text-gray-500 capitalize">
                          {task.type.replace('_', ' ')} • {task.schedule.frequency}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                        getStatusColor(task.status)
                      )}>
                        {task.status}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => pauseScheduledTask(task._id)}
                      >
                        {task.status === 'active' ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Schedule</p>
                      <p className="font-medium text-gray-900">
                        {task.schedule.frequency} at {task.schedule.time}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Run Count</p>
                      <p className="font-medium text-gray-900">{task.runCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Success Rate</p>
                      <p className="font-medium text-gray-900">{task.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Next Run</p>
                      <p className="font-medium text-gray-900">{formatDate(task.nextRun)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    {task.lastRun && (
                      <span>Last run {formatDate(task.lastRun)}</span>
                    )}
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}