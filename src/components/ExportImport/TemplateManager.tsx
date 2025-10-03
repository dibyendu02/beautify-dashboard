import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  fetchExportFileTexts,
  fetchImportFileTexts,
  createExportFileText,
  createImportFileText,
  setSelectedEntityType
} from '../../store/slices/exportImportSlice';
import { exportImportService } from '../../services/exportImport';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import Button from '../ui/Button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Share,
  Eye,
  Copy,
  Settings,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface TemplateManagerProps {
  className?: string;
}

interface FileTextFormData {
  name: string;
  description: string;
  entityType: string;
  fields: string[];
  fieldMapping: Record<string, string>;
  validationRules: Record<string, any>;
  defaultFilters: Record<string, any>;
  isPublic: boolean;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ className }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    exports: { templates: exportFileTexts },
    imports: { templates: importFileTexts },
    supportedEntities,
    ui: { selectedEntityType }
  } = useSelector((state: RootState) => state.exportImport);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createMode, setCreateMode] = useState<'export' | 'import'>('export');
  const [editingFileText, setEditingFileText] = useState<any>(null);
  const [formData, setFormData] = useState<FileTextFormData>({
    name: '',
    description: '',
    entityType: selectedEntityType,
    fields: [],
    fieldMapping: {},
    validationRules: {},
    defaultFilters: {},
    isPublic: false
  });
  const [availableFields, setAvailableFields] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchExportFileTexts());
    dispatch(fetchImportFileTexts());
  }, [dispatch]);

  useEffect(() => {
    const fields = exportImportService.getEntityFields(formData.entityType);
    setAvailableFields(fields);
  }, [formData.entityType]);

  const handleCreateFileText = (mode: 'export' | 'import') => {
    setCreateMode(mode);
    setEditingFileText(null);
    setFormData({
      name: '',
      description: '',
      entityType: selectedEntityType,
      fields: [],
      fieldMapping: {},
      validationRules: {},
      defaultFilters: {},
      isPublic: false
    });
    setShowCreateDialog(true);
  };

  const handleEditFileText = (template: any, mode: 'export' | 'import') => {
    setCreateMode(mode);
    setEditingFileText(template);
    setFormData({
      name: template.name,
      description: template.description || '',
      entityType: template.entityType,
      fields: template.fields || [],
      fieldMapping: template.fieldMapping || {},
      validationRules: template.validationRules || {},
      defaultFilters: template.defaultFilters || {},
      isPublic: template.isPublic
    });
    setShowCreateDialog(true);
  };

  const handleSaveFileText = async () => {
    if (!formData.name.trim()) {
      toast.error('FileText name is required');
      return;
    }

    if (createMode === 'export' && formData.fields.length === 0) {
      toast.error('Please select at least one field for export template');
      return;
    }

    if (createMode === 'import' && Object.keys(formData.fieldMapping).length === 0) {
      toast.error('Please add at least one field mapping for import template');
      return;
    }

    try {
      if (createMode === 'export') {
        const template = {
          name: formData.name,
          description: formData.description,
          entityType: formData.entityType,
          fields: formData.fields,
          defaultFilters: formData.defaultFilters,
          isPublic: formData.isPublic
        };

        if (editingFileText) {
          await exportImportService.updateExportFileText(editingFileText.id, template);
          toast.success('Export template updated successfully');
        } else {
          await dispatch(createExportFileText(template)).unwrap();
          toast.success('Export template created successfully');
        }
      } else {
        const template = {
          name: formData.name,
          description: formData.description,
          entityType: formData.entityType,
          fieldMapping: formData.fieldMapping,
          validationRules: formData.validationRules,
          isPublic: formData.isPublic
        };

        if (editingFileText) {
          await exportImportService.updateImportFileText(editingFileText.id, template);
          toast.success('Import template updated successfully');
        } else {
          await dispatch(createImportFileText(template)).unwrap();
          toast.success('Import template created successfully');
        }
      }

      setShowCreateDialog(false);
      // Refresh templates
      dispatch(fetchExportFileTexts());
      dispatch(fetchImportFileTexts());
    } catch (error: any) {
      toast.error(error.message || 'Failed to save template');
    }
  };

  const handleDeleteFileText = async (templateId: string, mode: 'export' | 'import') => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      if (mode === 'export') {
        await exportImportService.deleteExportFileText(templateId);
      } else {
        await exportImportService.deleteImportFileText(templateId);
      }
      toast.success('FileText deleted successfully');
      
      // Refresh templates
      dispatch(fetchExportFileTexts());
      dispatch(fetchImportFileTexts());
    } catch (error) {
      toast.error('Failed to delete template');
    }
  };

  const handleFieldToggle = (field: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.includes(field)
        ? prev.fields.filter(f => f !== field)
        : [...prev.fields, field]
    }));
  };

  const addFieldMapping = () => {
    const newMapping = { ...formData.fieldMapping };
    newMapping[''] = '';
    setFormData(prev => ({ ...prev, fieldMapping: newMapping }));
  };

  const updateFieldMapping = (oldKey: string, newKey: string, value: string) => {
    const newMapping = { ...formData.fieldMapping };
    if (oldKey !== newKey && oldKey !== '') {
      delete newMapping[oldKey];
    }
    if (newKey !== '') {
      newMapping[newKey] = value;
    }
    setFormData(prev => ({ ...prev, fieldMapping: newMapping }));
  };

  const removeFieldMapping = (key: string) => {
    const newMapping = { ...formData.fieldMapping };
    delete newMapping[key];
    setFormData(prev => ({ ...prev, fieldMapping: newMapping }));
  };

  const addValidationRule = (field: string) => {
    const newRules = { ...formData.validationRules };
    newRules[field] = {
      required: false,
      type: 'string'
    };
    setFormData(prev => ({ ...prev, validationRules: newRules }));
  };

  const renderExportFileText = (template: any) => (
    <Card key={template.id} className="relative">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="h-5 w-5" />
              {template.name}
            </CardTitle>
            <CardDescription className="mt-1">
              {template.description || 'No description'}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            {template.isPublic && (
              <Badge variant="secondary" className="text-xs">
                <Share className="h-3 w-3 mr-1" />
                Public
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditFileText(template, 'export')}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteFileText(template.id, 'export')}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Entity Type:</span>
            <span className="ml-2 capitalize">{template.entityType}</span>
          </div>
          <div>
            <span className="font-medium">Fields:</span>
            <span className="ml-2">{template.fields.length} selected</span>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Selected Fields:</h4>
          <div className="flex flex-wrap gap-1">
            {template.fields.slice(0, 8).map((field: string) => (
              <Badge key={field} variant="outline" className="text-xs">
                {field}
              </Badge>
            ))}
            {template.fields.length > 8 && (
              <Badge variant="outline" className="text-xs">
                +{template.fields.length - 8} more
              </Badge>
            )}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Created {formatDistanceToNow(new Date(template.createdAt), { addSuffix: true })}
        </div>
      </CardContent>
    </Card>
  );

  const renderImportFileText = (template: any) => (
    <Card key={template.id} className="relative">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5" />
              {template.name}
            </CardTitle>
            <CardDescription className="mt-1">
              {template.description || 'No description'}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            {template.isPublic && (
              <Badge variant="secondary" className="text-xs">
                <Share className="h-3 w-3 mr-1" />
                Public
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditFileText(template, 'import')}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteFileText(template.id, 'import')}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Entity Type:</span>
            <span className="ml-2 capitalize">{template.entityType}</span>
          </div>
          <div>
            <span className="font-medium">Mappings:</span>
            <span className="ml-2">{Object.keys(template.fieldMapping).length} fields</span>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Field Mappings:</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {Object.entries(template.fieldMapping).slice(0, 5).map(([source, target]: [string, any]) => (
              <div key={source} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                <span className="font-medium">{source}</span>
                <span className="text-muted-foreground">→</span>
                <span className="text-blue-600">{target}</span>
              </div>
            ))}
            {Object.keys(template.fieldMapping).length > 5 && (
              <div className="text-xs text-muted-foreground text-center">
                +{Object.keys(template.fieldMapping).length - 5} more mappings
              </div>
            )}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Created {formatDistanceToNow(new Date(template.createdAt), { addSuffix: true })}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-6 w-6" />
                FileText Manager
              </CardTitle>
              <CardDescription>
                Create and manage reusable export and import templates
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="export">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="export">Export FileTexts</TabsTrigger>
              <TabsTrigger value="import">Import FileTexts</TabsTrigger>
            </TabsList>

            <TabsContent value="export" className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {exportFileTexts.length} export templates
                </p>
                <Button onClick={() => handleCreateFileText('export')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Export FileText
                </Button>
              </div>

              {exportFileTexts.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Download className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No export templates yet</p>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => handleCreateFileText('export')}
                    >
                      Create your first template
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exportFileTexts.map(renderExportFileText)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="import" className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {importFileTexts.length} import templates
                </p>
                <Button onClick={() => handleCreateFileText('import')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Import FileText
                </Button>
              </div>

              {importFileTexts.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No import templates yet</p>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => handleCreateFileText('import')}
                    >
                      Create your first template
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {importFileTexts.map(renderImportFileText)}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Create/Edit FileText Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFileText ? 'Edit' : 'Create'} {createMode === 'export' ? 'Export' : 'Import'} FileText
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">FileText Name</Label>
                <Input
                  id="template-name"
                  placeholder="Enter template name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entity-type">Entity Type</Label>
                <Select
                  value={formData.entityType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, entityType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe what this template is for"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            {createMode === 'export' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Fields to Export</Label>
                  <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border rounded">
                    {availableFields.map(field => (
                      <div key={field} className="flex items-center space-x-2">
                        <Checkbox
                          id={field}
                          checked={formData.fields.includes(field)}
                          onCheckedChange={() => handleFieldToggle(field)}
                        />
                        <Label htmlFor={field} className="text-sm">
                          {field}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Selected Fields ({formData.fields.length})</Label>
                  <div className="flex flex-wrap gap-1">
                    {formData.fields.map(field => (
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
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Field Mappings</Label>
                    <Button variant="outline" size="sm" onClick={addFieldMapping}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Mapping
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {Object.entries(formData.fieldMapping).map(([sourceField, targetField], index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-5">
                          <Input
                            placeholder="Source field name"
                            value={sourceField}
                            onChange={(e) => updateFieldMapping(sourceField, e.target.value, targetField as string)}
                          />
                        </div>
                        <div className="col-span-1 text-center">→</div>
                        <div className="col-span-5">
                          <Select
                            value={targetField as string}
                            onValueChange={(value) => updateFieldMapping(sourceField, sourceField, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Target field" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableFields.map(field => (
                                <SelectItem key={field} value={field}>
                                  {field}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFieldMapping(sourceField)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-public"
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: !!checked }))}
              />
              <Label htmlFor="is-public">Make this template public (accessible to all users)</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFileText}>
              {editingFileText ? 'Update' : 'Create'} FileText
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplateManager;