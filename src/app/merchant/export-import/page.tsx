'use client';

import React from 'react';
import { ExportImportDashboard } from '../../../components/ExportImport';

export default function MerchantExportImportPage() {
  return (
    <div className="container mx-auto py-6">
      <ExportImportDashboard userRole="merchant" />
    </div>
  );
}