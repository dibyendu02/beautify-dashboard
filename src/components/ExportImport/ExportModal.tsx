import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  setExportModal,
  setSelectedEntityType,
  setSelectedFormat,
  createExport,
  fetchExportFileTexts
} from '../../store/slices/exportImportSlice';
import { exportImportService } from '../../services/exportImport';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import Button from '../ui/Button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Download,
  FileSpreadsheet,
  FileText,
  Database,
  FileImage,
  Filter,
  Settings,
  Mail,
  Calendar,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface FilterCriteria {
  field: string;
  operator: string;
  value: any;
}

interface ExportModalProps {
  onClose?: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    ui: { exportModal, selectedEntityType, selectedFormat },
    exports: { templates, loading },
    supportedEntities,
    supportedFormats
  } = useSelector((state: RootState) => state.exportImport);

  const [exportName, setExportName] = useState('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterCriteria[]>([]);
  const [emailDelivery, setEmailDelivery] = useState(false);
  const [selectedFileText, setSelectedFileText] = useState<string>('');
  const [customFilters, setCustomFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    if (exportModal) {
      // Fetch templates for selected entity type
      dispatch(fetchExportFileTexts(selectedEntityType));
      
      // Get available fields for the entity type
      const fields = exportImportService.getEntityFields(selectedEntityType);
      setAvailableFields(fields);
      setSelectedFields(fields.slice(0, 5)); // Select first 5 fields by default
    }
  }, [exportModal, selectedEntityType, dispatch]);

  useEffect(() => {
    if (selectedFileText) {
      const template = templates.find(t => t.id === selectedFileText);
      if (template) {
        setSelectedFields(template.fields);
        setCustomFilters(template.defaultFilters || {});
        setExportName(template.name);
      }
    }
  }, [selectedFileText, templates]);

  const handleClose = () => {
    dispatch(setExportModal(false));
    setExportName('');
    setSelectedFields([]);
    setFilters([]);
    setEmailDelivery(false);
    setSelectedFileText('');
    setCustomFilters({});
    onClose?.();
  };

  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev =>
      prev.includes(field)
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const addFilter = () => {
    setFilters(prev => [...prev, { field: availableFields[0], operator: 'equals', value: '' }]);
  };

  const updateFilter = (index: number, key: keyof FilterCriteria, value: any) => {
    setFilters(prev => prev.map((filter, i) => 
      i === index ? { ...filter, [key]: value } : filter
    ));
  };

  const removeFilter = (index: number) => {
    setFilters(prev => prev.filter((_, i) => i !== index));
  };

  const buildFilters = () => {
    const filterObj = { ...customFilters };
    
    filters.forEach(filter => {
      if (filter.field && filter.value) {
        switch (filter.operator) {
          case 'equals':
            filterObj[filter.field] = filter.value;
            break;
          case 'contains':
            filterObj[filter.field] = { $regex: filter.value, $options: 'i' };
            break;
          case 'gt':
            filterObj[filter.field] = { $gt: filter.value };
            break;
          case 'lt':
            filterObj[filter.field] = { $lt: filter.value };
            break;
          case 'gte':
            filterObj[filter.field] = { $gte: filter.value };
            break;
          case 'lte':
            filterObj[filter.field] = { $lte: filter.value };
            break;
        }
      }
    });

    return filterObj;
  };

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      toast.error('Please select at least one field to export');
      return;
    }

    try {
      const exportParams = {
        entityType: selectedEntityType,
        format: selectedFormat as 'csv' | 'excel' | 'json' | 'pdf',
        fields: selectedFields,
        filters: buildFilters(),
        emailDelivery,
        customName: exportName || undefined,
        templateId: selectedFileText || undefined
      };

      await dispatch(createExport(exportParams)).unwrap();
      toast.success('Export started successfully! You will be notified when it\'s ready.');
      handleClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to start export');
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'csv': return <FileText className="h-4 w-4" />;
      case 'excel': return <FileSpreadsheet className="h-4 w-4" />;
      case 'json': return <Database className="h-4 w-4" />;
      case 'pdf': return <FileImage className="h-4 w-4" />;
      default: return <Download className="h-4 w-4" />;
    }
  };

  const operatorOptions = [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'gt', label: 'Greater than' },
    { value: 'lt', label: 'Less than' },
    { value: 'gte', label: 'Greater than or equal' },
    { value: 'lte', label: 'Less than or equal' }
  ];

  return (
    <Dialog open={exportModal} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Data
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="fields">Fields</TabsTrigger>
            <TabsTrigger value="filters">Filters</TabsTrigger>
            <TabsTrigger value="options">Options</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entity-type">Entity Type</Label>
                <Select
                  value={selectedEntityType}
                  onValueChange={(value) => dispatch(setSelectedEntityType(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedEntities.map(entity => (
                      <SelectItem key={entity} value={entity}>
                        {entity.charAt(0).toUpperCase() + entity.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="format">Export Format</Label>
                <Select
                  value={selectedFormat}
                  onValueChange={(value) => dispatch(setSelectedFormat(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedFormats.map(format => (
                      <SelectItem key={format} value={format}>
                        <div className="flex items-center gap-2">
                          {getFormatIcon(format)}
                          {format.toUpperCase()}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="export-name">Export Name (Optional)</Label>
              <Input
                id="export-name"
                placeholder="Enter custom export name"
                value={exportName}
                onChange={(e) => setExportName(e.target.value)}
              />
            </div>

            {templates.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="template">Use FileText (Optional)</Label>
                <Select value={selectedFileText} onValueChange={setSelectedFileText}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {template.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </TabsContent>

          <TabsContent value="fields" className="space-y-4">
            <div className="space-y-2">
              <Label>Select Fields to Export</Label>
              <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border rounded">
                {availableFields.map(field => (
                  <div key={field} className="flex items-center space-x-2">
                    <Checkbox
                      id={field}
                      checked={selectedFields.includes(field)}
                      onCheckedChange={() => handleFieldToggle(field)}
                    />
                    <Label htmlFor={field} className="text-sm">
                      {field}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFields(availableFields)}
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFields([])}
                >
                  Deselect All
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Selected Fields ({selectedFields.length})</Label>
              <div className="flex flex-wrap gap-1">
                {selectedFields.map(field => (
                  <Badge key={field} variant="secondary" className="text-xs">
                    {field}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => handleFieldToggle(field)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="filters" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Data Filters</Label>
                <Button variant="outline" size="sm" onClick={addFilter}>
                  <Filter className="h-4 w-4 mr-2" />
                  Add Filter
                </Button>
              </div>

              {filters.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      No filters applied. All {selectedEntityType} records will be exported.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {filters.map((filter, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-3">
                            <Select
                              value={filter.field}
                              onValueChange={(value) => updateFilter(index, 'field', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {availableFields.map(field => (
                                  <SelectItem key={field} value={field}>{field}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-3">
                            <Select
                              value={filter.operator}
                              onValueChange={(value) => updateFilter(index, 'operator', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {operatorOptions.map(op => (
                                  <SelectItem key={op.value} value={op.value}>
                                    {op.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-5">
                            <Input
                              placeholder="Value"
                              value={filter.value}
                              onChange={(e) => updateFilter(index, 'value', e.target.value)}
                            />
                          </div>
                          <div className="col-span-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFilter(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="options" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email-delivery"
                  checked={emailDelivery}
                  onCheckedChange={setEmailDelivery}
                />
                <Label htmlFor="email-delivery" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email download link when ready
                </Label>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Export Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Entity Type:</span>
                    <span className="font-medium">{selectedEntityType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Format:</span>
                    <span className="font-medium">{selectedFormat.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Fields Selected:</span>
                    <span className="font-medium">{selectedFields.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Filters Applied:</span>
                    <span className="font-medium">{filters.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">GDPR Compliance</CardTitle>
                  <CardDescription>
                    This export will respect user privacy settings and data retention policies.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Settings className="h-4 w-4" />
                    <span>Personal data will be sanitized according to your privacy settings</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={loading || selectedFields.length === 0}>
            {loading ? 'Starting Export...' : 'Start Export'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;