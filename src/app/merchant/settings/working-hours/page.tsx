'use client';

import { useState, useEffect } from 'react';
import {
  Clock,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  Check,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { merchantService } from '@/services/api';
import toast from 'react-hot-toast';

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface WorkingHours {
  [key: string]: {
    isOpen: boolean;
    slots: TimeSlot[];
  };
}

const DEFAULT_WORKING_HOURS: WorkingHours = {
  monday: { isOpen: true, slots: [{ startTime: '09:00', endTime: '17:00' }] },
  tuesday: { isOpen: true, slots: [{ startTime: '09:00', endTime: '17:00' }] },
  wednesday: { isOpen: true, slots: [{ startTime: '09:00', endTime: '17:00' }] },
  thursday: { isOpen: true, slots: [{ startTime: '09:00', endTime: '17:00' }] },
  friday: { isOpen: true, slots: [{ startTime: '09:00', endTime: '17:00' }] },
  saturday: { isOpen: true, slots: [{ startTime: '10:00', endTime: '16:00' }] },
  sunday: { isOpen: false, slots: [] },
};

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

export default function WorkingHoursPage() {
  const [workingHours, setWorkingHours] = useState<WorkingHours>(DEFAULT_WORKING_HOURS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkingHours();
  }, []);

  const fetchWorkingHours = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await merchantService.getProfile();
      
      if (response.success && response.data?.workingHours) {
        setWorkingHours(response.data.workingHours);
      } else {
        // Use default working hours if none set
        setWorkingHours(DEFAULT_WORKING_HOURS);
      }
    } catch (err: any) {
      console.error('Error fetching working hours:', err);
      setError('Failed to load working hours');
      setWorkingHours(DEFAULT_WORKING_HOURS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDayToggle = (dayKey: string) => {
    const updatedHours = {
      ...workingHours,
      [dayKey]: {
        ...workingHours[dayKey],
        isOpen: !workingHours[dayKey].isOpen,
        slots: !workingHours[dayKey].isOpen ? [{ startTime: '09:00', endTime: '17:00' }] : [],
      },
    };
    setWorkingHours(updatedHours);
    setHasChanges(true);
  };

  const handleTimeSlotChange = (dayKey: string, slotIndex: number, field: 'startTime' | 'endTime', value: string) => {
    const updatedHours = { ...workingHours };
    updatedHours[dayKey].slots[slotIndex][field] = value;
    setWorkingHours(updatedHours);
    setHasChanges(true);
  };

  const addTimeSlot = (dayKey: string) => {
    const updatedHours = { ...workingHours };
    const lastSlot = updatedHours[dayKey].slots[updatedHours[dayKey].slots.length - 1];
    const newStartTime = lastSlot ? lastSlot.endTime : '09:00';
    
    updatedHours[dayKey].slots.push({
      startTime: newStartTime,
      endTime: '17:00',
    });
    
    setWorkingHours(updatedHours);
    setHasChanges(true);
  };

  const removeTimeSlot = (dayKey: string, slotIndex: number) => {
    if (workingHours[dayKey].slots.length <= 1) {
      toast.error('At least one time slot is required when the day is open');
      return;
    }
    
    const updatedHours = { ...workingHours };
    updatedHours[dayKey].slots.splice(slotIndex, 1);
    setWorkingHours(updatedHours);
    setHasChanges(true);
  };

  const validateTimeSlots = () => {
    for (const dayKey of Object.keys(workingHours)) {
      const day = workingHours[dayKey];
      if (!day.isOpen) continue;

      for (const slot of day.slots) {
        if (slot.startTime >= slot.endTime) {
          toast.error(`Invalid time slot for ${DAYS_OF_WEEK.find(d => d.key === dayKey)?.label}: End time must be after start time`);
          return false;
        }
      }

      // Check for overlapping slots
      const sortedSlots = [...day.slots].sort((a, b) => a.startTime.localeCompare(b.startTime));
      for (let i = 0; i < sortedSlots.length - 1; i++) {
        if (sortedSlots[i].endTime > sortedSlots[i + 1].startTime) {
          toast.error(`Overlapping time slots for ${DAYS_OF_WEEK.find(d => d.key === dayKey)?.label}`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateTimeSlots()) return;

    try {
      setIsSaving(true);
      
      const response = await merchantService.update('profile', {
        workingHours,
      });
      
      if (response.success) {
        toast.success('Working hours updated successfully');
        setHasChanges(false);
      } else {
        toast.error('Failed to update working hours');
      }
    } catch (err: any) {
      console.error('Error saving working hours:', err);
      toast.error('Failed to update working hours');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setWorkingHours(DEFAULT_WORKING_HOURS);
    setHasChanges(true);
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (const minute of ['00', '30']) {
        const time = `${hour.toString().padStart(2, '0')}:${minute}`;
        options.push(time);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Working Hours</h1>
            <p className="text-gray-600 mt-1">Configure your business operating hours</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4" />
            <p className="text-gray-600">Loading working hours...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Working Hours</h1>
            <p className="text-gray-600 mt-1">Configure your business operating hours</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading working hours</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchWorkingHours} className="bg-primary-500 hover:bg-primary-600 text-white">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Working Hours</h1>
          <p className="text-gray-600 mt-1">Configure your business operating hours</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isSaving}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="bg-primary-600 hover:bg-primary-700 text-white"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-800">You have unsaved changes</p>
              <p className="text-sm text-yellow-700">Don't forget to save your working hours configuration.</p>
            </div>
          </div>
        </div>
      )}

      {/* Working Hours Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Weekly Schedule</h2>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Set your operating hours for each day of the week. You can add multiple time slots for lunch breaks or split schedules.
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day.key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={workingHours[day.key].isOpen}
                        onChange={() => handleDayToggle(day.key)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-3"
                      />
                      <span className="font-medium text-gray-900">{day.label}</span>
                    </label>
                  </div>
                  {!workingHours[day.key].isOpen && (
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      Closed
                    </span>
                  )}
                </div>

                {workingHours[day.key].isOpen && (
                  <div className="space-y-3">
                    {workingHours[day.key].slots.map((slot, slotIndex) => (
                      <div key={slotIndex} className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <select
                            value={slot.startTime}
                            onChange={(e) => handleTimeSlotChange(day.key, slotIndex, 'startTime', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            {timeOptions.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                          <span className="text-gray-500">to</span>
                          <select
                            value={slot.endTime}
                            onChange={(e) => handleTimeSlotChange(day.key, slotIndex, 'endTime', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            {timeOptions.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {workingHours[day.key].slots.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeTimeSlot(day.key, slotIndex)}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addTimeSlot(day.key)}
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Time Slot
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Schedule Preview</h2>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            This is how your working hours will appear to customers
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day.key}
                className={cn(
                  'p-3 rounded-lg border',
                  workingHours[day.key].isOpen
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{day.label}</span>
                  {workingHours[day.key].isOpen ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <span className="text-xs text-gray-500 px-2 py-1 bg-gray-200 rounded">CLOSED</span>
                  )}
                </div>
                {workingHours[day.key].isOpen && (
                  <div className="mt-1 space-y-1">
                    {workingHours[day.key].slots.map((slot, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        {slot.startTime} - {slot.endTime}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}