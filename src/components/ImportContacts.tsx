'use client';

import React, { useState } from 'react';
import { Contact } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Props interface for the ImportContacts component
interface ImportContactsProps {
  onContactsImported: (contacts: Contact[]) => void;
  existingContacts?: Contact[];
}

// Component for importing contacts from CSV file or manual entry
export default function ImportContacts({ onContactsImported, existingContacts = [] }: ImportContactsProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const [dragActive, setDragActive] = useState(false);
  
  // Manual contact entry state
  const [manualContact, setManualContact] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });

  // Handle file selection and parsing
  const handleFileUpload = async (file: File) => {
    setIsImporting(true);
    setImportError('');
    setImportSuccess('');

    try {
      // Validate file type
      if (!file.name.endsWith('.csv') && !file.type.includes('csv')) {
        throw new Error('Please upload a CSV file');
      }

      // Validate file size (max 1MB)
      if (file.size > 1024 * 1024) {
        throw new Error('File size must be less than 1MB');
      }

      // Read file content
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());

      if (lines.length === 0) {
        throw new Error('CSV file is empty');
      }

      // Parse CSV (expecting format: name,email,phone)
      const contacts: Contact[] = [];
      const errors: string[] = [];

      // Skip header row if it exists
      const startIndex = lines[0].toLowerCase().includes('name') || lines[0].toLowerCase().includes('email') ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));
        
        if (columns.length < 2) {
          errors.push(`Line ${i + 1}: Not enough columns (need at least name and email)`);
          continue;
        }

        const [name, email, phoneNumber = ''] = columns;

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          errors.push(`Line ${i + 1}: Invalid email format for ${name}`);
          continue;
        }

        // Check for duplicates
        const isDuplicate = existingContacts.some(contact => 
          contact.email.toLowerCase() === email.toLowerCase()
        ) || contacts.some(contact => 
          contact.email.toLowerCase() === email.toLowerCase()
        );

        if (!isDuplicate) {
          contacts.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: name || 'Unknown',
            email,
            phoneNumber: phoneNumber || undefined
          });
        }
      }

      if (contacts.length === 0) {
        throw new Error('No valid contacts found in the CSV file');
      }

      // Show success message with any errors
      let successMessage = `Successfully imported ${contacts.length} contacts`;
      if (errors.length > 0) {
        successMessage += ` (${errors.length} entries had errors)`;
      }
      
      setImportSuccess(successMessage);
      onContactsImported(contacts);

      // Log errors for debugging (in a real app, you might want to show these to the user)
      if (errors.length > 0) {
        console.warn('Import errors:', errors);
      }

    } catch (error) {
      console.error('Import error:', error);
      setImportError(error instanceof Error ? error.message : 'Failed to import contacts');
    } finally {
      setIsImporting(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Handle manual contact entry
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manualContact.name || !manualContact.email) {
      setImportError('Please fill in at least name and email');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(manualContact.email)) {
      setImportError('Please enter a valid email address');
      return;
    }

    // Check for duplicates
    const isDuplicate = existingContacts.some(contact => 
      contact.email.toLowerCase() === manualContact.email.toLowerCase()
    );

    if (isDuplicate) {
      setImportError('This contact already exists');
      return;
    }

    const newContact: Contact = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: manualContact.name.trim(),
      email: manualContact.email.trim(),
      phoneNumber: manualContact.phoneNumber.trim() || undefined
    };

    onContactsImported([newContact]);
    setImportSuccess(`Added ${newContact.name} to your contacts`);
    setManualContact({ name: '', email: '', phoneNumber: '' });
    setImportError('');
  };

  return (
    <div className="space-y-6">
      {/* CSV File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📁 Import from CSV File
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-4xl mb-4">📄</div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop your CSV file here or click to browse
            </p>
            <p className="text-sm text-gray-600 mb-4">
              CSV format: name, email, phone (optional)
            </p>
            
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
              disabled={isImporting}
            />
            
            <label htmlFor="csv-upload">
              <Button
                variant="outline"
                disabled={isImporting}
                className="cursor-pointer"
                asChild
              >
                <span>
                  {isImporting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Choose CSV File'
                  )}
                </span>
              </Button>
            </label>
          </div>

          {/* CSV Format Example */}
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm font-medium text-gray-700 mb-2">Expected CSV format:</p>
            <code className="text-xs text-gray-600 block">
              name,email,phone<br/>
              John Smith,john@example.com,(555) 123-4567<br/>
              Sarah Johnson,sarah@example.com,(555) 234-5678
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Manual Contact Entry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ✏️ Add Contact Manually
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="manual-name">Name *</Label>
                <Input
                  id="manual-name"
                  value={manualContact.name}
                  onChange={(e) => setManualContact(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter contact name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="manual-email">Email *</Label>
                <Input
                  id="manual-email"
                  type="email"
                  value={manualContact.email}
                  onChange={(e) => setManualContact(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="manual-phone">Phone Number (Optional)</Label>
              <Input
                id="manual-phone"
                value={manualContact.phoneNumber}
                onChange={(e) => setManualContact(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>

            <Button type="submit" className="w-full">
              Add Contact
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Status Messages */}
      {importError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Import Error</p>
          <p className="text-sm">{importError}</p>
        </div>
      )}

      {importSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          <p className="font-medium">Success!</p>
          <p className="text-sm">{importSuccess}</p>
        </div>
      )}

      {/* Existing Contacts Display */}
      {existingContacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Contacts ({existingContacts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 max-h-60 overflow-y-auto">
              {existingContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.email}</p>
                    {contact.phoneNumber && (
                      <p className="text-xs text-gray-500">{contact.phoneNumber}</p>
                    )}
                  </div>
                  <Badge variant="secondary">Contact</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="font-medium text-blue-800 mb-2">How it works:</p>
        <ul className="space-y-1 text-blue-700">
          <li>• Import your contacts to see which restaurants your friends have liked</li>
          <li>• We'll match your contacts with other FoodSwipe users by email</li>
          <li>• Your contact data is stored locally and never shared without permission</li>
          <li>• You can remove contacts anytime from your profile settings</li>
        </ul>
      </div>
    </div>
  );
}
