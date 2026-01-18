'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, X, ArrowRight, Check } from 'lucide-react';
import Papa from 'papaparse';
import { createImport, processImport, type FieldMapping, type ParsedRow } from '@/actions/imports';

type Step = 'upload' | 'mapping' | 'processing' | 'complete';

const CONTACT_FIELDS = [
  { value: 'firstName', label: 'First Name' },
  { value: 'lastName', label: 'Last Name' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'title', label: 'Title' },
];

const ACCOUNT_FIELDS = [
  { value: 'name', label: 'Company Name' },
  { value: 'industry', label: 'Industry' },
  { value: 'website', label: 'Website' },
  { value: 'employees', label: 'Employees' },
  { value: 'revenue', label: 'Revenue' },
];

export function ImportUploader() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<ParsedRow[]>([]);
  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const [result, setResult] = useState<{ success: number; errors: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setError(null);
    setFile(selectedFile);

    // Check file size (1MB limit for V1)
    if (selectedFile.size > 1024 * 1024) {
      setError('File size must be less than 1MB');
      return;
    }

    // Parse CSV
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError('Error parsing CSV: ' + results.errors[0].message);
          return;
        }

        const headers = results.meta.fields || [];
        setCsvHeaders(headers);
        setCsvData(results.data as ParsedRow[]);

        // Auto-map fields based on header names
        const autoMappings: FieldMapping[] = [];
        headers.forEach((header) => {
          const lowerHeader = header.toLowerCase().trim();

          // Contact field matching
          if (lowerHeader.includes('first') && lowerHeader.includes('name')) {
            autoMappings.push({ csvField: header, dbField: 'firstName', type: 'contact' });
          } else if (lowerHeader.includes('last') && lowerHeader.includes('name')) {
            autoMappings.push({ csvField: header, dbField: 'lastName', type: 'contact' });
          } else if (lowerHeader === 'email' || lowerHeader.includes('email')) {
            autoMappings.push({ csvField: header, dbField: 'email', type: 'contact' });
          } else if (lowerHeader === 'phone' || lowerHeader.includes('phone')) {
            autoMappings.push({ csvField: header, dbField: 'phone', type: 'contact' });
          } else if (lowerHeader === 'title' || lowerHeader.includes('job title')) {
            autoMappings.push({ csvField: header, dbField: 'title', type: 'contact' });
          }
          // Account field matching
          else if (lowerHeader === 'company' || lowerHeader.includes('company')) {
            autoMappings.push({ csvField: header, dbField: 'name', type: 'account' });
          } else if (lowerHeader === 'industry') {
            autoMappings.push({ csvField: header, dbField: 'industry', type: 'account' });
          } else if (lowerHeader === 'website') {
            autoMappings.push({ csvField: header, dbField: 'website', type: 'account' });
          }
        });

        setMappings(autoMappings);
        setStep('mapping');
      },
      error: (err) => {
        setError('Error reading file: ' + err.message);
      },
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && droppedFile.type === 'text/csv') {
        handleFileSelect(droppedFile);
      } else {
        setError('Please upload a CSV file');
      }
    },
    [handleFileSelect]
  );

  const updateMapping = (csvField: string, dbField: string, type: 'contact' | 'account') => {
    setMappings((prev) => {
      // Remove existing mapping for this CSV field
      const filtered = prev.filter((m) => m.csvField !== csvField);
      if (dbField) {
        return [...filtered, { csvField, dbField, type }];
      }
      return filtered;
    });
  };

  const handleImport = async () => {
    if (!file || csvData.length === 0) return;

    setStep('processing');

    try {
      // Create import record
      const importRecord = await createImport(
        file.name,
        file.size,
        csvData.length,
        mappings
      );

      // Process the data
      const result = await processImport(importRecord.id, csvData, mappings);
      setResult(result);
      setStep('complete');
      router.refresh();
    } catch (err) {
      setError('Import failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
      setStep('mapping');
    }
  };

  const reset = () => {
    setStep('upload');
    setFile(null);
    setCsvHeaders([]);
    setCsvData([]);
    setMappings([]);
    setResult(null);
    setError(null);
  };

  // Upload Step
  if (step === 'upload') {
    return (
      <div>
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-zinc-700 rounded-xl p-8 text-center hover:border-zinc-600 transition-colors"
        >
          <Upload className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-white mb-2">Drag and drop your CSV file here</p>
          <p className="text-zinc-500 text-sm mb-4">or</p>
          <label className="btn btn-secondary cursor-pointer">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />
            Browse Files
          </label>
          <p className="text-zinc-600 text-xs mt-4">Maximum file size: 1MB</p>
        </div>
      </div>
    );
  }

  // Mapping Step
  if (step === 'mapping') {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-white text-sm font-medium">{file?.name}</p>
              <p className="text-zinc-500 text-xs">{csvData.length} rows found</p>
            </div>
          </div>
          <button onClick={reset} className="p-2 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
          {csvHeaders.map((header) => {
            const mapping = mappings.find((m) => m.csvField === header);
            return (
              <div key={header} className="flex items-center gap-3">
                <div className="flex-1 p-2 bg-surface rounded text-sm text-zinc-300">
                  {header}
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600" />
                <select
                  value={mapping ? `${mapping.type}:${mapping.dbField}` : ''}
                  onChange={(e) => {
                    const [type, field] = e.target.value.split(':');
                    updateMapping(header, field, type as 'contact' | 'account');
                  }}
                  className="input flex-1"
                >
                  <option value="">Skip this field</option>
                  <optgroup label="Contact Fields">
                    {CONTACT_FIELDS.map((f) => (
                      <option key={f.value} value={`contact:${f.value}`}>
                        {f.label}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Account Fields">
                    {ACCOUNT_FIELDS.map((f) => (
                      <option key={f.value} value={`account:${f.value}`}>
                        {f.label}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleImport}
          disabled={mappings.length === 0}
          className="btn btn-primary w-full"
        >
          Import {csvData.length} Records
        </button>
      </div>
    );
  }

  // Processing Step
  if (step === 'processing') {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white">Processing import...</p>
        <p className="text-zinc-500 text-sm">This may take a moment</p>
      </div>
    );
  }

  // Complete Step
  if (step === 'complete' && result) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-brand-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-brand-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Import Complete!</h3>
        <p className="text-zinc-400 mb-4">
          Successfully imported {result.success} records
          {result.errors.length > 0 && ` with ${result.errors.length} errors`}
        </p>
        {result.errors.length > 0 && (
          <div className="text-left bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4 max-h-32 overflow-y-auto">
            <p className="text-red-400 text-sm font-medium mb-2">Errors:</p>
            {result.errors.slice(0, 5).map((err, i) => (
              <p key={i} className="text-red-400/80 text-xs">
                {err}
              </p>
            ))}
            {result.errors.length > 5 && (
              <p className="text-red-400/60 text-xs mt-1">
                ...and {result.errors.length - 5} more
              </p>
            )}
          </div>
        )}
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn btn-secondary">
            Import Another
          </button>
          <a href="/contacts" className="btn btn-primary">
            View Contacts
          </a>
        </div>
      </div>
    );
  }

  return null;
}
