import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

interface TOCSection {
  title: string;
  cleanTitle: string;
  level: number;
  pageStart: number;
  pageEnd: number;
  semanticType: 'chapter' | 'section' | 'subsection' | 'paragraph';
  processed: boolean;
}

interface TOCAnalysis {
  id: string;
  materialId: string;
  materialTitle: string;
  materialStatus: string;
  tocPages: string;
  sections: TOCSection[];
  totalSections: number;
  processedSections: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface TOCAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  materialId: string;
  onProcessingStarted?: () => void;
}

const TOCAnalysisModal: React.FC<TOCAnalysisModalProps> = ({
  isOpen,
  onClose,
  materialId,
  onProcessingStarted
}) => {
  const [tocAnalysis, setTocAnalysis] = useState<TOCAnalysis | null>(null);
  const [editedSections, setEditedSections] = useState<TOCSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load TOC analysis when modal opens
  useEffect(() => {
    if (isOpen && materialId) {
      loadTOCAnalysis();
    }
  }, [isOpen, materialId]);

  const loadTOCAnalysis = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/ingestion/toc-analysis/${materialId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load TOC analysis: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setTocAnalysis(data.tocAnalysis);
        setEditedSections([...data.tocAnalysis.sections]);
      } else {
        throw new Error(data.message || 'Failed to load TOC analysis');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load TOC analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const saveTOCAnalysis = async () => {
    if (!tocAnalysis) return;
    
    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`/api/ingestion/toc-analysis/${materialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({
          sections: editedSections
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save TOC analysis: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setSuccess(`TOC analysis updated with ${data.updatedSections} sections`);
        // Reload to get fresh data
        await loadTOCAnalysis();
      } else {
        throw new Error(data.message || 'Failed to save TOC analysis');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save TOC analysis');
    } finally {
      setIsSaving(false);
    }
  };

  const continueProcessing = async () => {
    setIsContinuing(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`/api/ingestion/continue-after-toc/${materialId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to continue processing: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setSuccess('Processing continued successfully - using reviewed TOC data');
        onProcessingStarted?.();
        // Close modal after successful start
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error(data.message || 'Failed to continue processing');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to continue processing');
    } finally {
      setIsContinuing(false);
    }
  };

  const updateSection = (index: number, field: keyof TOCSection, value: any) => {
    const updated = [...editedSections];
    updated[index] = { ...updated[index], [field]: value };
    setEditedSections(updated);
  };

  const addSection = () => {
    const newSection: TOCSection = {
      title: 'Nova sekcija',
      cleanTitle: 'Nova sekcija',
      level: 1,
      pageStart: 1,
      pageEnd: 1,
      semanticType: 'section',
      processed: false
    };
    setEditedSections([...editedSections, newSection]);
  };

  const removeSection = (index: number) => {
    const updated = editedSections.filter((_, i) => i !== index);
    setEditedSections(updated);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'toc_ready':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Ready for Review</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Pending</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Loading TOC Analysis...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!tocAnalysis) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>TOC Analysis</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-red-600">{error || 'No TOC analysis found for this material'}</p>
            <Button onClick={onClose} className="mt-4">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            TOC Analysis - {tocAnalysis.materialTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-600">Material Status</label>
              <div className="mt-1">{getStatusBadge(tocAnalysis.materialStatus)}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">TOC Pages</label>
              <p className="text-sm font-mono">{tocAnalysis.tocPages}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Sections</label>
              <p className="text-sm">{editedSections.length} sections</p>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              {success}
            </div>
          )}

          {/* Sections Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Sections</h3>
              <Button onClick={addSection} variant="outline" size="sm">
                Add Section
              </Button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto border rounded-lg">
              <div className="sticky top-0 bg-gray-100 px-4 py-2 grid grid-cols-12 gap-2 text-sm font-medium text-gray-600 border-b">
                <div className="col-span-4">Title</div>
                <div className="col-span-1">Level</div>
                <div className="col-span-1">Start</div>
                <div className="col-span-1">End</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Clean Title</div>
                <div className="col-span-1">Actions</div>
              </div>

              {editedSections.map((section, index) => (
                <div key={index} className="px-4 py-3 grid grid-cols-12 gap-2 items-center border-b hover:bg-gray-50">
                  <div className="col-span-4">
                    <Input
                      value={section.title}
                      onChange={(e) => updateSection(index, 'title', e.target.value)}
                      className="text-sm"
                      placeholder="Section title"
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="number"
                      value={section.level}
                      onChange={(e) => updateSection(index, 'level', parseInt(e.target.value) || 1)}
                      className="text-sm"
                      min="1"
                      max="5"
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="number"
                      value={section.pageStart}
                      onChange={(e) => updateSection(index, 'pageStart', parseInt(e.target.value) || 1)}
                      className="text-sm"
                      min="1"
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="number"
                      value={section.pageEnd}
                      onChange={(e) => updateSection(index, 'pageEnd', parseInt(e.target.value) || 1)}
                      className="text-sm"
                      min="1"
                    />
                  </div>
                  <div className="col-span-2">
                    <select
                      value={section.semanticType}
                      onChange={(e) => updateSection(index, 'semanticType', e.target.value)}
                      className="w-full text-sm border border-gray-300 rounded-md px-2 py-1"
                    >
                      <option value="chapter">Chapter</option>
                      <option value="section">Section</option>
                      <option value="subsection">Subsection</option>
                      <option value="paragraph">Paragraph</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <Input
                      value={section.cleanTitle}
                      onChange={(e) => updateSection(index, 'cleanTitle', e.target.value)}
                      className="text-sm"
                      placeholder="Clean title"
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      onClick={() => removeSection(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex gap-3">
              <Button
                onClick={saveTOCAnalysis}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>

              {tocAnalysis.materialStatus === 'toc_ready' && (
                <Button
                  onClick={continueProcessing}
                  disabled={isContinuing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isContinuing ? 'Starting...' : 'Continue Process'}
                </Button>
              )}
            </div>

            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TOCAnalysisModal;