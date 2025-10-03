import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  setBulkOperationModal,
  bulkExport,
  bulkImport
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
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import {
  Package,
  Download,
  Upload,
  Plus,
  X,
  FileSpreadsheet,
  FileText,
  Database,
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface BulkFile {
  id: string;
  entityType: string;
  file: File;
  templateId?: string;
  status: 'pending' | 'uploading' | 'validating' | 'valid' | 'invalid';
  validation?: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
}

interface BulkOperationsProps {
  onClose?: () => void;
}

const BulkOperations: React.FC<BulkOperationsProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    ui: { bulkOperationModal },
    supportedEntities,
    supportedFormats,
    exports: { loading: exportsLoading },
    imports: { loading: importsLoading, templates: importFileTexts }
  } = useSelector((state: RootState) => state.exportImport);

  // Export state
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<string>('csv');

  // Import state
  const [bulkFiles, setBulkFiles] = useState<BulkFile[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const handleClose = () => {
    dispatch(setBulkOperationModal(false));
    setSelectedEntities([]);
    setExportFormat('csv');
    setBulkFiles([]);
    onClose?.();
  };

  const handleEntityToggle = (entity: string) => {
    setSelectedEntities(prev =>
      prev.includes(entity)
        ? prev.filter(e => e !== entity)
        : [...prev, entity]
    );
  };

  const handleBulkExport = async () => {
    if (selectedEntities.length === 0) {
      toast.error('Please select at least one entity type to export');
      return;
    }

    try {
      await dispatch(bulkExport({
        entityTypes: selectedEntities,
        format: exportFormat
      })).unwrap();
      
      toast.success('Bulk export started successfully! You will be notified when complete.');
      handleClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to start bulk export');
    }
  };

  const validateFile = async (file: File): Promise<{ isValid: boolean; errors: string[]; warnings: string[] }> => {
    const validation = { isValid: true, errors: [], warnings: [] };

    // File size validation (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      validation.errors.push('File size exceeds 50MB limit');
      validation.isValid = false;
    }

    // File type validation
    const allowedExtensions = ['.csv', '.xls', '.xlsx', '.json'];
    const hasValidExtension = allowedExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );

    if (!hasValidExtension) {
      validation.errors.push('Unsupported file format. Please use CSV, Excel, or JSON files.');
      validation.isValid = false;
    }

    return validation;
  };

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await processFiles(files);
  };

  const processFiles = async (files: File[]) => {
    const newFiles: BulkFile[] = [];

    for (const file of files) {
      const id = Math.random().toString(36).substr(2, 9);
      const bulkFile: BulkFile = {
        id,
        entityType: 'customers', // Default entity type
        file,
        status: 'validating'
      };

      newFiles.push(bulkFile);
    }

    setBulkFiles(prev => [...prev, ...newFiles]);

    // Validate files asynchronously
    for (const bulkFile of newFiles) {
      try {
        const validation = await validateFile(bulkFile.file);
        setBulkFiles(prev => prev.map(f => 
          f.id === bulkFile.id 
            ? { 
                ...f, 
                status: validation.isValid ? 'valid' : 'invalid',
                validation 
              }
            : f
        ));
      } catch (error) {
        setBulkFiles(prev => prev.map(f => 
          f.id === bulkFile.id 
            ? { 
                ...f, 
                status: 'invalid',
                validation: {
                  isValid: false,
                  errors: ['Failed to validate file'],
                  warnings: []
                }
              }
            : f
        ));
      }
    }
  };

  const updateFileEntityType = (fileId: string, entityType: string) => {
    setBulkFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, entityType } : f
    ));
  };

  const updateFileFileText = (fileId: string, templateId: string) => {
    setBulkFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, templateId: templateId || undefined } : f
    ));
  };

  const removeFile = (fileId: string) => {
    setBulkFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleBulkImport = async () => {
    const validFiles = bulkFiles.filter(f => f.status === 'valid');
    
    if (validFiles.length === 0) {
      toast.error('Please add at least one valid file to import');
      return;
    }

    try {
      const importFiles = validFiles.map(f => ({
        entityType: f.entityType,
        file: f.file,
        templateId: f.templateId
      }));

      await dispatch(bulkImport(importFiles)).unwrap();
      
      toast.success('Bulk import started successfully! You will be notified when complete.');
      handleClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to start bulk import');
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.toLowerCase().endsWith('.csv')) return <FileText className="h-6 w-6" />;
    if (fileName.toLowerCase().endsWith('.xlsx') || fileName.toLowerCase().endsWith('.xls')) return <FileSpreadsheet className="h-6 w-6" />;
    if (fileName.toLowerCase().endsWith('.json')) return <Database className="h-6 w-6" />;
    return <Upload className="h-6 w-6" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'uploading':
      case 'validating':
        return <Clock className="h-4 w-4 text-yellow-600 animate-spin" />;
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'invalid':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validFilesCount = bulkFiles.filter(f => f.status === 'valid').length;
  const invalidFilesCount = bulkFiles.filter(f => f.status === 'invalid').length;

  return (
    <Dialog open={bulkOperationModal} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Bulk Operations
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">Bulk Export</TabsTrigger>
            <TabsTrigger value="import">Bulk Import</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Multiple Entity Types
                </CardTitle>
                <CardDescription>
                  Export data from multiple entity types in a single operation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedFormats.map(format => (
                        <SelectItem key={format} value={format}>
                          {format.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Select Entity Types ({selectedEntities.length} selected)</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {supportedEntities.map(entity => (
                      <div key={entity} className="flex items-center space-x-2">
                        <Checkbox
                          id={entity}
                          checked={selectedEntities.includes(entity)}
                          onCheckedChange={() => handleEntityToggle(entity)}
                        />
                        <Label htmlFor={entity} className="capitalize">
                          {entity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedEntities.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Entities</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntities.map(entity => (
                        <Badge key={entity} variant="default" className="capitalize">
                          {entity}
                          <X
                            className="h-3 w-3 ml-2 cursor-pointer"
                            onClick={() => handleEntityToggle(entity)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Database className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="font-medium text-blue-900">Export Information</h4>
                        <p className="text-sm text-blue-700">
                          This will create separate {exportFormat.toUpperCase()} files for each selected entity type.
                          All files will be packaged into a single ZIP archive for download.
                        </p>
                        <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                          <li>Each entity type will be exported with all available fields</li>
                          <li>GDPR compliance rules will be applied to all exports</li>
                          <li>You'll receive email notification when the export is complete</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={handleBulkExport}
                disabled={exportsLoading || selectedEntities.length === 0}
                className="flex items-center gap-2"
              >
                {exportsLoading ? (
                  <Clock className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Start Bulk Export
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Import Multiple Files
                </CardTitle>
                <CardDescription>
                  Upload and import multiple files for different entity types simultaneously
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Drop Zone */}
                <div
                  className={`
                    border-2 border-dashed rounded-lg p-8 text-center transition-colors
                    ${dragOver ? 'border-primary bg-primary/5' : 'border-gray-300'}
                  `}
                  onDrop={handleFileDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
                >
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="font-medium mb-2">Drop your files here</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse (CSV, Excel, JSON files)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".csv,.xlsx,.xls,.json"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="bulk-file-input"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('bulk-file-input')?.click()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Files
                  </Button>
                </div>

                {/* File Summary */}
                {bulkFiles.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{bulkFiles.length}</div>
                      <div className="text-sm text-muted-foreground">Total Files</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{validFilesCount}</div>
                      <div className="text-sm text-muted-foreground">Valid</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{invalidFilesCount}</div>
                      <div className="text-sm text-muted-foreground">Invalid</div>
                    </div>
                  </div>
                )}

                {/* File List */}
                {bulkFiles.length > 0 && (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {bulkFiles.map((bulkFile) => (
                      <Card key={bulkFile.id} className="relative">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              {getFileIcon(bulkFile.file.name)}
                            </div>
                            
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">{bulkFile.file.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {formatFileSize(bulkFile.file.size)}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(bulkFile.status)}
                                    <span className="text-sm capitalize">{bulkFile.status}</span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(bulkFile.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              {bulkFile.status === 'valid' && (
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <Label className="text-xs">Entity Type</Label>
                                    <Select
                                      value={bulkFile.entityType}
                                      onValueChange={(value) => updateFileEntityType(bulkFile.id, value)}
                                    >
                                      <SelectTrigger className="h-8">
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
                                  
                                  <div className="space-y-1">
                                    <Label className="text-xs">FileText (Optional)</Label>
                                    <Select
                                      value={bulkFile.templateId || ''}
                                      onValueChange={(value) => updateFileFileText(bulkFile.id, value)}
                                    >
                                      <SelectTrigger className="h-8">
                                        <SelectValue placeholder="Auto-map" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="">Auto-map fields</SelectItem>
                                        {importFileTexts
                                          .filter(t => t.entityType === bulkFile.entityType)
                                          .map(template => (
                                            <SelectItem key={template.id} value={template.id}>
                                              {template.name}
                                            </SelectItem>
                                          ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}

                              {bulkFile.validation && !bulkFile.validation.isValid && (
                                <div className="space-y-1">
                                  <h5 className="text-sm font-medium text-red-600">Validation Errors:</h5>
                                  {bulkFile.validation.errors.map((error, index) => (
                                    <p key={index} className="text-sm text-red-600">• {error}</p>
                                  ))}
                                </div>
                              )}

                              {bulkFile.validation && bulkFile.validation.warnings.length > 0 && (
                                <div className="space-y-1">
                                  <h5 className="text-sm font-medium text-yellow-600">Warnings:</h5>
                                  {bulkFile.validation.warnings.map((warning, index) => (
                                    <p key={index} className="text-sm text-yellow-600">• {warning}</p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {bulkFiles.length > 0 && (
              <div className="flex justify-end">
                <Button
                  onClick={handleBulkImport}
                  disabled={importsLoading || validFilesCount === 0}
                  className="flex items-center gap-2"
                >
                  {importsLoading ? (
                    <Clock className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Start Bulk Import ({validFilesCount} files)
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkOperations;