import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  setImportModal,
  setSelectedEntityType,
  createImport,
  fetchImportFileTexts
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import {
  Upload,
  FileSpreadsheet,
  FileText,
  Database,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Info,
  Eye
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ImportModalProps {
  onClose?: () => void;
}

interface FileValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fileInfo?: {
    name: string;
    size: number;
    type: string;
    rows?: number;
    columns?: string[];
  };
}

const ImportModal: React.FC<ImportModalProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    ui: { importModal, selectedEntityType },
    imports: { templates, loading },
    supportedEntities
  } = useSelector((state: RootState) => state.exportImport);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileText, setSelectedFileText] = useState<string>('');
  const [validateOnly, setValidateOnly] = useState(false);
  const [fileValidation, setFileValidation] = useState<FileValidation | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (importModal) {
      dispatch(fetchImportFileTexts(selectedEntityType));
    }
  }, [importModal, selectedEntityType, dispatch]);

  const handleClose = () => {
    dispatch(setImportModal(false));
    setSelectedFile(null);
    setSelectedFileText('');
    setValidateOnly(false);
    setFileValidation(null);
    setPreviewData([]);
    setShowPreview(false);
    onClose?.();
  };

  const validateFile = async (file: File): Promise<FileValidation> => {
    const validation: FileValidation = {
      isValid: true,
      errors: [],
      warnings: [],
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type
      }
    };

    // File size validation (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      validation.errors.push('File size exceeds 50MB limit');
      validation.isValid = false;
    }

    // File type validation
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/json'
    ];

    const allowedExtensions = ['.csv', '.xls', '.xlsx', '.json'];
    const hasValidExtension = allowedExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );

    if (!allowedTypes.includes(file.type) && !hasValidExtension) {
      validation.errors.push('Unsupported file format. Please use CSV, Excel, or JSON files.');
      validation.isValid = false;
    }

    // Try to read file for preview and basic validation
    if (validation.isValid) {
      try {
        if (file.name.toLowerCase().endsWith('.csv') || file.type === 'text/csv') {
          const text = await file.text();
          const lines = text.split('\n').filter(line => line.trim());
          if (lines.length === 0) {
            validation.errors.push('File appears to be empty');
            validation.isValid = false;
          } else {
            validation.fileInfo!.rows = lines.length - 1; // Exclude header
            validation.fileInfo!.columns = lines[0].split(',').map(col => col.trim().replace(/"/g, ''));
            
            // Set preview data (first 5 rows)
            const previewLines = lines.slice(0, 6); // Header + 5 rows
            if (previewLines.length > 1) {
              const headers = previewLines[0].split(',').map(h => h.trim().replace(/"/g, ''));
              const rows = previewLines.slice(1).map(line => {
                const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
                const row: any = {};
                headers.forEach((header, index) => {
                  row[header] = values[index] || '';
                });
                return row;
              });
              setPreviewData(rows);
            }
          }
        } else if (file.name.toLowerCase().endsWith('.json') || file.type === 'application/json') {
          const text = await file.text();
          const data = JSON.parse(text);
          if (!Array.isArray(data)) {
            validation.errors.push('JSON file must contain an array of objects');
            validation.isValid = false;
          } else {
            validation.fileInfo!.rows = data.length;
            validation.fileInfo!.columns = data.length > 0 ? Object.keys(data[0]) : [];
            setPreviewData(data.slice(0, 5));
          }
        }
      } catch (error) {
        validation.errors.push('Failed to read or parse file. Please check file format.');
        validation.isValid = false;
      }
    }

    // FileText-specific validation
    if (selectedFileText && validation.isValid) {
      const template = templates.find(t => t.id === selectedFileText);
      if (template && validation.fileInfo?.columns) {
        const templateFields = Object.keys(template.fieldMapping);
        const missingFields = templateFields.filter(field => 
          !validation.fileInfo!.columns!.some(col => 
            col.toLowerCase() === field.toLowerCase() ||
            Object.values(template.fieldMapping).includes(col)
          )
        );
        
        if (missingFields.length > 0) {
          validation.warnings.push(`Missing expected fields: ${missingFields.join(', ')}`);
        }
      }
    }

    return validation;
  };

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    const validation = await validateFile(file);
    setFileValidation(validation);
    
    if (!validation.isValid) {
      toast.error('File validation failed');
    } else if (validation.warnings.length > 0) {
      toast.error('File has warnings');
    } else {
      toast.success('File validated successfully');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const downloadFileText = async () => {
    try {
      await exportImportService.generateImportFileText(selectedEntityType);
      toast.success('FileText downloaded successfully');
    } catch (error) {
      toast.error('Failed to download template');
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to import');
      return;
    }

    if (!fileValidation?.isValid) {
      toast.error('Please resolve file validation errors before importing');
      return;
    }

    try {
      const importParams = {
        entityType: selectedEntityType,
        file: selectedFile,
        templateId: selectedFileText || undefined,
        validateOnly
      };

      await dispatch(createImport(importParams)).unwrap();
      
      if (validateOnly) {
        toast.success('File validation completed! Check the results below.');
      } else {
        toast.success('Import started successfully! You will be notified when it\'s complete.');
        handleClose();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to start import');
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.toLowerCase().endsWith('.csv')) return <FileText className="h-8 w-8" />;
    if (fileName.toLowerCase().endsWith('.xlsx') || fileName.toLowerCase().endsWith('.xls')) return <FileSpreadsheet className="h-8 w-8" />;
    if (fileName.toLowerCase().endsWith('.json')) return <Database className="h-8 w-8" />;
    return <Upload className="h-8 w-8" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={importModal} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Data
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="mapping">Mapping</TabsTrigger>
            <TabsTrigger value="preview" disabled={!selectedFile || !fileValidation?.isValid}>
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
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
                <Label>Download FileText</Label>
                <Button
                  variant="outline"
                  onClick={downloadFileText}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Get FileText
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Upload File</Label>
              
              {/* File Drop Zone */}
              <div
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center transition-colors
                  ${isDragOver ? 'border-primary bg-primary/5' : 'border-gray-300'}
                  ${selectedFile ? 'bg-green-50 border-green-300' : ''}
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center">
                      {getFileIcon(selectedFile.name)}
                    </div>
                    <h3 className="font-medium">{selectedFile.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>
                    {fileValidation && (
                      <div className="flex items-center justify-center gap-2">
                        {fileValidation.isValid ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Valid
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Invalid
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="font-medium">Drop your file here</h3>
                    <p className="text-sm text-muted-foreground">
                      or click to browse (CSV, Excel, JSON)
                    </p>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls,.json"
                      onChange={handleFileInput}
                      className="hidden"
                      id="file-input"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('file-input')?.click()}
                    >
                      Choose File
                    </Button>
                  </div>
                )}
              </div>

              {/* File Validation Results */}
              {fileValidation && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      {fileValidation.isValid ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      File Validation Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {fileValidation.fileInfo && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">File Name:</span>
                          <span className="ml-2">{fileValidation.fileInfo.name}</span>
                        </div>
                        <div>
                          <span className="font-medium">File Size:</span>
                          <span className="ml-2">{formatFileSize(fileValidation.fileInfo.size)}</span>
                        </div>
                        {fileValidation.fileInfo.rows && (
                          <div>
                            <span className="font-medium">Rows:</span>
                            <span className="ml-2">{fileValidation.fileInfo.rows}</span>
                          </div>
                        )}
                        {fileValidation.fileInfo.columns && (
                          <div>
                            <span className="font-medium">Columns:</span>
                            <span className="ml-2">{fileValidation.fileInfo.columns.length}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {fileValidation.errors.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-red-600 flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          Errors
                        </h4>
                        {fileValidation.errors.map((error, index) => (
                          <p key={index} className="text-sm text-red-600 ml-5">
                            • {error}
                          </p>
                        ))}
                      </div>
                    )}

                    {fileValidation.warnings.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-yellow-600 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          Warnings
                        </h4>
                        {fileValidation.warnings.map((warning, index) => (
                          <p key={index} className="text-sm text-yellow-600 ml-5">
                            • {warning}
                          </p>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="mapping" className="space-y-4">
            {templates.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="template">Import FileText (Optional)</Label>
                <Select value={selectedFileText} onValueChange={setSelectedFileText}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template or use auto-mapping" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Auto-map fields</SelectItem>
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

            {selectedFileText && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">FileText Field Mapping</CardTitle>
                  <CardDescription>
                    This template will map your file columns to database fields
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const template = templates.find(t => t.id === selectedFileText);
                    if (!template) return null;
                    
                    return (
                      <div className="space-y-2">
                        {Object.entries(template.fieldMapping).map(([fileField, dbField]) => (
                          <div key={fileField} className="flex items-center justify-between text-sm">
                            <span className="font-medium">{fileField}</span>
                            <span className="text-muted-foreground">→</span>
                            <span className="text-blue-600">{dbField}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="validate-only"
                  checked={validateOnly}
                  onCheckedChange={setValidateOnly}
                />
                <Label htmlFor="validate-only" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Validate only (don't import data)
                </Label>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                Check data quality and mapping without actually importing records
              </p>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            {previewData.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Data Preview</CardTitle>
                  <CardDescription>
                    First 5 rows of your data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          {Object.keys(previewData[0]).map(header => (
                            <th key={header} className="text-left p-2 font-medium">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((row, index) => (
                          <tr key={index} className="border-b">
                            {Object.values(row).map((value: any, cellIndex) => (
                              <td key={cellIndex} className="p-2">
                                {String(value).substring(0, 50)}
                                {String(value).length > 50 && '...'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    <Info className="h-8 w-8 mx-auto mb-2" />
                    <p>No preview data available</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={loading || !selectedFile || !fileValidation?.isValid}
          >
            {loading ? 'Processing...' : validateOnly ? 'Validate Data' : 'Start Import'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportModal;