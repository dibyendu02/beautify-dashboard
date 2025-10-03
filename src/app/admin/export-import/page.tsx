'use client';

import React from 'react';
import { ExportImportDashboard } from '../../../components/ExportImport';

export default function AdminExportImportPage() {
  return (
    <div className="container mx-auto py-6">
      <ExportImportDashboard userRole="admin" />
    </div>
  );
}