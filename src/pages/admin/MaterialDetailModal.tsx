import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/admin/AdminAuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../components/ui/pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ShimmerButton } from '../../components/ui/shimmer-button';
import { motion, AnimatePresence } from 'motion/react';

interface Material {
  _id: string;
  title: string;
  type: 'book' | 'pdf' | 'link' | 'video' | 'notes';
  status?: 'uploaded' | 'processing' | 'ready' | 'failed' | 'toc_ready';
  r2Key?: string;
  bucket?: string;
  url?: string;
  note?: string;
  subjectId: string | { _id: string; name: string };
  facultyId: string;
  departmentId: string;
  year: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface DocumentSection {
  _id: string;
  docId: string;
  sectionId: string;
  title: string;
  content?: string;
  pageStart: number;
  pageEnd: number;
  charStart: number;
  charEnd: number;
  level: number;
  path: string;
  parentSectionId?: string;
  semanticType?: 'chapter' | 'section' | 'subsection' | 'paragraph';
  vectorId?: string;
  totalParts?: number;
  partNumber?: number;
  isMainPart?: boolean;
  shortAbstract?: string;
  keywords?: string[];
  queries?: string[];
  analyzed?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MaterialAnalysis {
  _id: string;
  materialId: string;
  summary: string;
  keyTopics: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedReadingTime: number;
  createdAt: string;
  updatedAt: string;
}

interface TocSection {
  title: string;
  cleanTitle: string;
  level: number;
  pageStart: number;
  pageEnd: number;
  parentSectionId?: string;
  semanticType: 'chapter' | 'section' | 'subsection' | 'paragraph';
  processed?: boolean;
}

interface TocAnalysis {
  _id: string;
  docId: string;
  subjectId: string;
  facultyId: string;
  departmentId: string;
  year: number;
  tocPages: string;
  sections: TocSection[];
  totalSections: number;
  processedSections: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  createdAt: string;
  updatedAt: string;
}

interface MaterialDetailModalProps {
  material: Material;
  isOpen: boolean;
  onClose: () => void;
  onMaterialUpdate?: (material: Material) => void;
  onMaterialDelete?: (materialId: string) => void;
}

const MaterialDetailModal: React.FC<MaterialDetailModalProps> = ({ 
  material, 
  isOpen, 
  onClose,
  onMaterialUpdate,
  onMaterialDelete 
}) => {
  const { isAuthenticated } = useAdminAuth();

  // Material detail view states
  const [materialSections, setMaterialSections] = useState<DocumentSection[]>([]);
  const [materialAnalysis, setMaterialAnalysis] = useState<MaterialAnalysis | null>(null);
  const [materialTocAnalysis, setMaterialTocAnalysis] = useState<TocAnalysis | null>(null);
  const [loadingMaterialData, setLoadingMaterialData] = useState(false);
  const [editingFields, setEditingFields] = useState<{[key: string]: boolean}>({});
  const [editValues, setEditValues] = useState<{[key: string]: string}>({});
  
  // Search and pagination for sections
  const [sectionsSearchQuery, setSectionsSearchQuery] = useState('');
  const [sectionsPage, setSectionsPage] = useState(1);
  const [sectionsPerPage] = useState(10);
  
  // Section editing states
  const [editingSections, setEditingSections] = useState<{[sectionId: string]: {[field: string]: boolean}}>({});
  const [sectionEditValues, setSectionEditValues] = useState<{[sectionId: string]: {[field: string]: any}}>({});
  const [expandedSections, setExpandedSections] = useState<{[sectionId: string]: boolean}>({});
  
  // AI Analytics search and pagination states
  const [analyticsSearchQuery, setAnalyticsSearchQuery] = useState('');
  const [analyticsPage, setAnalyticsPage] = useState(1);
  const [analyticsPerPage] = useState(10);
  
  // Advanced filtering and bulk actions
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set());
  const [selectedAnalytics, setSelectedAnalytics] = useState<Set<string>>(new Set());
  const [quickFilters, setQuickFilters] = useState({
    sections: { analyzed: false, unanalyzed: false, hasKeywords: false, hasQueries: false },
    analytics: { hasAbstract: false, hasKeywords: false, level: 'all' }
  });
  const [sortBy, setSortBy] = useState({ sections: 'title', analytics: 'title', direction: 'asc' });
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('compact');
  const [splitView, setSplitView] = useState(false);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  
  // Analysis states
  const [analyzingMaterial, setAnalyzingMaterial] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<any>({});
  const [isContinuingProcess, setIsContinuingProcess] = useState(false);

  // Page selection modal states for proper section extraction
  const [isPageSelectionModalOpen, setIsPageSelectionModalOpen] = useState(false);
  const [pageSelectionMaterial, setPageSelectionMaterial] = useState<{id: string, subjectId: string, title: string} | null>(null);
  const [tocPage, setTocPage] = useState<number | undefined>(undefined);
  const [tocToPage, setTocToPage] = useState<number | undefined>(undefined);
  
  // Load material data when modal opens
  useEffect(() => {
    if (isOpen && material) {
      loadMaterialData();
    }
  }, [isOpen, material]);

  const loadMaterialData = async () => {
    if (!material || !isAuthenticated) return;
    
    setLoadingMaterialData(true);
    try {
      // Load all material-related data
      await Promise.all([
        loadMaterialSections(material._id),
        loadMaterialAnalysis(material._id),
        loadMaterialTocAnalysis(material._id)
      ]);
    } catch (error) {
      console.error('Error loading material data:', error);
    } finally {
      setLoadingMaterialData(false);
    }
  };

  const loadMaterialSections = async (materialId: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/materials/${materialId}/sections`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMaterialSections(data.sections || []);
      }
    } catch (error) {
      console.error('Error loading material sections:', error);
    }
  };

  const loadMaterialAnalysis = async (materialId: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/materials/${materialId}/analysis`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMaterialAnalysis(data.analysis);
      }
    } catch (error) {
      console.error('Error loading material analysis:', error);
    }
  };

  const loadMaterialTocAnalysis = async (materialId: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ingestion/toc-analysis/${materialId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMaterialTocAnalysis(data.tocAnalysis);
      }
    } catch (error) {
      console.error('Error loading TOC analysis:', error);
    }
  };

  // Material field editing
  const handleEditField = (fieldKey: string, currentValue: string) => {
    setEditingFields(prev => ({ ...prev, [fieldKey]: true }));
    setEditValues(prev => ({ ...prev, [fieldKey]: currentValue }));
  };

  const handleSaveField = async (fieldKey: string) => {
    if (!material) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/materials/${material._id}/field`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          },
          body: JSON.stringify({
            field: fieldKey,
            value: editValues[fieldKey]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        onMaterialUpdate?.(data.material);
        setEditingFields(prev => ({ ...prev, [fieldKey]: false }));
      }
    } catch (error) {
      console.error('Error saving field:', error);
    }
  };

  const handleCancelEdit = (fieldKey: string) => {
    setEditingFields(prev => ({ ...prev, [fieldKey]: false }));
    setEditValues(prev => ({ 
      ...prev, 
      [fieldKey]: fieldKey === 'title' ? material.title : material.note || ''
    }));
  };

  // Material analysis
  const handleAnalyzeMaterial = async (materialId: string) => {
    setAnalyzingMaterial(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/materials/${materialId}/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysisStatus((prev: any) => ({ ...prev, [materialId]: data }));
        // Reload analysis after a short delay
        setTimeout(() => loadMaterialAnalysis(materialId), 2000);
      }
    } catch (error) {
      console.error('Error analyzing material:', error);
    } finally {
      setAnalyzingMaterial(false);
    }
  };

  // Material deletion
  const handleDeleteMaterial = async (materialId: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/materials/${materialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        onMaterialDelete?.(materialId);
        onClose();
      }
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  };

  // Continue processing after TOC
  const continueProcessing = async () => {
    if (!material) return;
    
    setIsContinuingProcess(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ingestion/continue-after-toc/${material._id}`, {
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
        alert('Processing continued successfully - using reviewed TOC data');
        // Refresh material data
        await loadMaterialTocAnalysis(material._id);
      } else {
        throw new Error(data.message || 'Failed to continue processing');
      }
    } catch (err) {
      console.error('Error continuing processing:', err);
      alert('Failed to continue processing: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsContinuingProcess(false);
    }
  };

  // Handle initial processing with page selection
  const handleStartProcessing = async () => {
    if (!pageSelectionMaterial) return;

    console.log(`Starting processing for material: ${pageSelectionMaterial.id}, tocPage: ${tocPage}, tocToPage: ${tocToPage}`);

    try {
      const token = localStorage.getItem('adminToken');
      const url = `${process.env.REACT_APP_API_URL}/api/ingestion/process/${pageSelectionMaterial.id}`;
      console.log('Making request to:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          tocPage: tocPage,
          tocToPage: tocToPage,
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        alert('Processing started successfully');
        
        // Close modal and reset state
        setIsPageSelectionModalOpen(false);
        setPageSelectionMaterial(null);
        setTocPage(undefined);
        setTocToPage(undefined);
        
        // Refresh material data to show new status
        await loadMaterialData();
        
        // Update parent component if callback provided
        if (onMaterialUpdate) {
          onMaterialUpdate({ ...material, status: 'processing' });
        }
      } else {
        throw new Error(data.message || 'Failed to start processing');
      }
    } catch (error: any) {
      console.error('Error starting processing:', error);
      alert('Failed to start processing: ' + error.message);
    }
  };

  // Section editing functions
  const handleEditSection = (sectionId: string, field: string, value: any) => {
    setEditingSections(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [field]: true }
    }));
    setSectionEditValues(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [field]: value }
    }));
  };

  const handleSaveSection = async (sectionId: string, field: string) => {
    try {
      const value = sectionEditValues[sectionId]?.[field];
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/materials/section/${sectionId}/field`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          field: field,
          value: value
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update local sections
        setMaterialSections(prev => 
          prev.map(section => 
            section._id === sectionId 
              ? { ...section, [field]: value }
              : section
          )
        );
        
        setEditingSections(prev => ({
          ...prev,
          [sectionId]: { ...prev[sectionId], [field]: false }
        }));
      }
    } catch (error) {
      console.error('Error saving section:', error);
    }
  };

  const handleCancelSectionEdit = (sectionId: string, field: string) => {
    const section = materialSections.find(s => s._id === sectionId);
    if (!section) return;
    
    setEditingSections(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [field]: false }
    }));
    
    setSectionEditValues(prev => ({
      ...prev,
      [sectionId]: { 
        ...prev[sectionId], 
        [field]: field === 'keywords' || field === 'queries' 
          ? (section as any)[field] || [] 
          : (section as any)[field] || ''
      }
    }));
  };

  // Filtering and pagination helpers
  const getFilteredSections = () => {
    let filtered = materialSections.filter(section => 
      section.title.toLowerCase().includes(sectionsSearchQuery.toLowerCase())
    );

    if (quickFilters.sections.analyzed) {
      filtered = filtered.filter(s => s.analyzed);
    }
    if (quickFilters.sections.unanalyzed) {
      filtered = filtered.filter(s => !s.analyzed);
    }
    if (quickFilters.sections.hasKeywords) {
      filtered = filtered.filter(s => s.keywords && s.keywords.length > 0);
    }
    if (quickFilters.sections.hasQueries) {
      filtered = filtered.filter(s => s.queries && s.queries.length > 0);
    }

    return filtered.sort((a, b) => {
      const direction = sortBy.direction === 'asc' ? 1 : -1;
      if (sortBy.sections === 'title') {
        return a.title.localeCompare(b.title) * direction;
      }
      return (a.pageStart - b.pageStart) * direction;
    });
  };

  const getPaginatedSections = () => {
    const filtered = getFilteredSections();
    const start = (sectionsPage - 1) * sectionsPerPage;
    return filtered.slice(start, start + sectionsPerPage);
  };

  // AI Analytics helpers
  const getAiAnalyticsBySection = () => {
    let filtered = materialSections.filter(s => s.analyzed && s.isMainPart !== false);
    
    // Apply search filter
    if (analyticsSearchQuery.trim()) {
      const query = analyticsSearchQuery.toLowerCase();
      filtered = filtered.filter(section => 
        section.title.toLowerCase().includes(query) ||
        section.shortAbstract?.toLowerCase().includes(query) ||
        section.keywords?.some(keyword => keyword.toLowerCase().includes(query))
      );
    }
    
    // Apply quick filters
    if (quickFilters.analytics.hasAbstract) {
      filtered = filtered.filter(s => s.shortAbstract && s.shortAbstract.length > 0);
    }
    
    if (quickFilters.analytics.hasKeywords) {
      filtered = filtered.filter(s => s.keywords && s.keywords.length > 0);
    }

    if (quickFilters.analytics.level !== 'all') {
      const level = parseInt(quickFilters.analytics.level);
      filtered = filtered.filter(s => s.level === level);
    }

    return filtered.sort((a, b) => {
      const direction = sortBy.direction === 'asc' ? 1 : -1;
      if (sortBy.analytics === 'title') {
        return a.title.localeCompare(b.title) * direction;
      }
      return (a.pageStart - b.pageStart) * direction;
    });
  };

  const getPaginatedAiAnalytics = () => {
    const filtered = getAiAnalyticsBySection();
    const startIndex = (analyticsPage - 1) * analyticsPerPage;
    const endIndex = startIndex + analyticsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const getAnalyticsTotalPages = () => {
    return Math.ceil(getAiAnalyticsBySection().length / analyticsPerPage);
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[98vw] h-[98vh] max-w-[98vw] max-h-[98vh] overflow-hidden p-0 bg-white [&>button]:hidden flex flex-col">
        {/* Header */}
        <motion.div
          className="flex-shrink-0 bg-white z-10 border-b border-gray-200 px-6 py-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.h1
                className="text-2xl font-bold text-gray-900"
                layoutId={`material-title-${material._id}`}
              >
                {material.title}
              </motion.h1>
              <Badge variant="outline" className="capitalize">{material.type}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-gray-100 text-black mr-4"
              >
                ← Nazad
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAnalyzeMaterial(material._id)}
                disabled={analyzingMaterial}
                className="bg-blue-50 hover:bg-blue-100 text-black border-blue-200"
              >
                {analyzingMaterial ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Analiziram...
                  </>
                ) : (
                  'Analiziraj'
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteMaterial(material._id)}
                className="bg-red-50 hover:bg-red-100 text-black border-red-200"
              >
                Obriši
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-gray-100 text-black"
              >
                ✕
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-h-0 flex flex-col">
          <Tabs defaultValue="overview" className="h-full flex flex-col">
            {/* Navigation Bar - Fixed at top */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200">
              <div className="px-6 py-2">
                <TabsList className="bg-gray-50 p-1 rounded-lg">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-black text-black">
                    Pregled
                  </TabsTrigger>
                  <TabsTrigger value="toc" className="data-[state=active]:bg-white data-[state=active]:text-black text-black">
                    TOC Analiza
                  </TabsTrigger>
                  <TabsTrigger value="sections" className="data-[state=active]:bg-white data-[state=active]:text-black text-black">
                    Sekcije ({materialSections.length})
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="data-[state=active]:bg-white data-[state=active]:text-black text-black">
                    AI Analitika
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 min-h-0 overflow-y-auto">

            {/* Overview Tab */}
            <TabsContent value="overview" className="h-full p-6 space-y-6">
              {/* Basic Information */}
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <path d="M8 9h8M8 13h8M8 17h5"/>
                  </svg>
                  Osnovne informacije
                </h2>

                <div className="space-y-4">
                  {/* Title */}
                  <div className="flex items-center gap-4 group">
                    {editingFields.title ? (
                      <div className="flex-1 flex gap-2">
                        <Input
                          value={editValues.title || ''}
                          onChange={(e) => setEditValues(prev => ({ ...prev, title: e.target.value }))}
                          className="flex-1"
                          placeholder="Naziv materijala"
                        />
                        <Button size="sm" onClick={() => handleSaveField('title')} className="text-black">Sačuvaj</Button>
                        <Button size="sm" variant="outline" onClick={() => handleCancelEdit('title')} className="text-black">Otkaži</Button>
                      </div>
                    ) : (
                      <>
                        <span className="text-black flex-1">{material.title}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-black"
                          onClick={() => handleEditField('title', material.title)}
                        >
                          Uredi
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Type and Status */}
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-sm font-medium text-black">Tip:</span>
                      <Badge variant="outline" className="ml-2 capitalize text-black">{material.type}</Badge>
                    </div>
                    {material.status && (
                      <div>
                        <span className="text-sm font-medium text-black">Status:</span>
                        <Badge variant="secondary" className="ml-2 text-black">{material.status}</Badge>
                      </div>
                    )}
                  </div>

                  {/* URL if exists */}
                  {material.url && (
                    <div>
                      <span className="text-sm font-medium text-black block mb-1">URL:</span>
                      <a href={material.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm break-all">
                        {material.url}
                      </a>
                    </div>
                  )}

                  {/* Notes */}
                  <div className="flex items-start gap-4 group">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-black block mb-2">Beleške:</span>
                      {editingFields.note ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editValues.note || ''}
                            onChange={(e) => setEditValues(prev => ({ ...prev, note: e.target.value }))}
                            className="min-h-[100px]"
                            placeholder="Dodajte beleške..."
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleSaveField('note')} className="text-black">Sačuvaj</Button>
                            <Button size="sm" variant="outline" onClick={() => handleCancelEdit('note')} className="text-black">Otkaži</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <span className="text-black flex-1 text-sm">{material.note || 'Nema beleške'}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-black"
                            onClick={() => handleEditField('note', material.note || '')}
                          >
                            Uredi
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1 text-black">
                    <div><span className="font-medium text-black">ID:</span> {material._id}</div>
                    <div><span className="font-medium text-black">Subject ID:</span> {typeof material.subjectId === 'object' ? material.subjectId._id : material.subjectId}</div>
                    <div><span className="font-medium text-black">Faculty ID:</span> {material.facultyId}</div>
                    <div><span className="font-medium text-black">Department ID:</span> {material.departmentId}</div>
                    <div><span className="font-medium text-black">Godina:</span> {material.year}</div>
                    <div><span className="font-medium text-black">Redosled:</span> {material.order}</div>
                    {material.r2Key && <div><span className="font-medium text-black">R2 Key:</span> {material.r2Key}</div>}
                    {material.bucket && <div><span className="font-medium text-black">Bucket:</span> {material.bucket}</div>}
                    <div><span className="font-medium text-black">Kreiran:</span> {new Date(material.createdAt).toLocaleDateString('sr-RS')}</div>
                    <div><span className="font-medium text-black">Ažuriran:</span> {new Date(material.updatedAt).toLocaleDateString('sr-RS')}</div>
                  </div>

                  {/* Processing Actions */}
                  {material.type === 'pdf' && (material.status === 'uploaded' || material.status === 'ready') && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">⚡</span>
                        </div>
                        <div>
                          <h4 className="text-black font-semibold">PDF spreman za obradu</h4>
                          <p className="text-sm text-gray-700">Pokrenite AI analizu sadržaja i izdvajanje sekcija</p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => {
                          setPageSelectionMaterial({
                            id: material._id,
                            subjectId: typeof material.subjectId === 'object' ? material.subjectId._id : material.subjectId,
                            title: material.title
                          });
                          setIsPageSelectionModalOpen(true);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base"
                      >
                        🚀 Pokreni AI obradu dokumenta
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </TabsContent>

            {/* TOC Analysis Tab */}
            <TabsContent value="toc" className="h-full p-0 m-0">
              <div className="h-full overflow-y-auto p-6">
                {/* Section 2: AI TOC Analysis */}
                <motion.div 
                  className="col-span-full lg:col-span-1 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 p-6 shadow-sm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <h2 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-600">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <path d="M8 9h8M8 13h8M8 17h5"/>
                    </svg>
                    AI TOC Analiza
                  </h2>
                  {materialTocAnalysis ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-black mb-1 block">Status</label>
                          <Badge 
                            variant={materialTocAnalysis.status === 'completed' ? 'default' : 
                                    materialTocAnalysis.status === 'processing' ? 'secondary' : 'destructive'}
                            className="text-black"
                          >
                            {materialTocAnalysis.status}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-black mb-1 block">TOC Stranice</label>
                          <span className="text-sm text-black">{materialTocAnalysis.tocPages || 'Nije specificirano'}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-black mb-1 block">Ukupno sekcija</label>
                          <span className="text-2xl font-bold text-orange-600">{materialTocAnalysis.totalSections}</span>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-black mb-1 block">Obrađeno sekcija</label>
                          <span className="text-2xl font-bold text-green-600">{materialTocAnalysis.processedSections}</span>
                        </div>
                      </div>

                      {materialTocAnalysis.sections && materialTocAnalysis.sections.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-black mb-2 block">Sekcije TOC-a</label>
                          <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                  <th className="text-left p-2 font-medium text-black">Naslov</th>
                                  <th className="text-left p-2 font-medium text-black">Nivo</th>
                                  <th className="text-left p-2 font-medium text-black">Stranice</th>
                                  <th className="text-left p-2 font-medium text-black">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {materialTocAnalysis.sections.map((section, index) => (
                                  <tr key={index} className="border-t border-gray-100">
                                    <td className="p-2 text-black" style={{ paddingLeft: `${8 + section.level * 12}px` }}>
                                      {section.title}
                                    </td>
                                    <td className="p-2 text-black">{section.level}</td>
                                    <td className="p-2 text-black">{section.pageStart}-{section.pageEnd}</td>
                                    <td className="p-2">
                                      <Badge 
                                        variant={section.processed ? 'default' : 'secondary'}
                                        className="text-xs text-black"
                                      >
                                        {section.processed ? 'Obrađeno' : 'Na čekanju'}
                                      </Badge>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Continue Processing Button - Always Available */}
                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">🚀</span>
                          </div>
                          <div>
                            <h4 className="text-black font-semibold">Nastavak obrade dokumenta</h4>
                            <p className="text-sm text-black">Pokrenite ekstraktovanje sekcija iz dokumenta</p>
                          </div>
                        </div>
                        <Button 
                          onClick={continueProcessing}
                          disabled={isContinuingProcess}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-base"
                        >
                          {isContinuingProcess ? '🚀 Pokretanje obrade...' : '🚀 Nastavi sa obradom dokumenta'}
                        </Button>
                      </div>

                      {materialTocAnalysis.error && (
                        <div className="bg-red-50 border border-red-200 text-black px-3 py-2 rounded text-sm">
                          <span className="font-medium">Greška:</span> {materialTocAnalysis.error}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center py-8">
                        <div className="text-gray-400 mb-2">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <path d="M8 9h8M8 13h8M8 17h5"/>
                          </svg>
                        </div>
                        <p className="text-sm text-black">Nema TOC analize</p>
                        <p className="text-xs text-black mt-1">Pokrenite obradu dokumenta</p>
                      </div>

                      {/* Continue Processing Button - Always Available */}
                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">🚀</span>
                          </div>
                          <div>
                            <h4 className="text-black font-semibold">Pokreni obradu dokumenta</h4>
                            <p className="text-sm text-black">Ekstraktuj sekcije iz dokumenta</p>
                          </div>
                        </div>
                        <Button 
                          onClick={continueProcessing}
                          disabled={isContinuingProcess}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-base"
                        >
                          {isContinuingProcess ? '🚀 Pokretanje obrade...' : '🚀 Pokreni obradu dokumenta'}
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </TabsContent>

            {/* Document Sections Tab */}
            <TabsContent value="sections" className="h-full p-0 m-0">
              <div className="h-full overflow-y-auto p-6">
                {/* Simple Document Sections Display */}
                <motion.div 
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  {/* Section Header and Controls */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold text-black flex items-center gap-2">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 2-2V8z"/>
                            <polyline points="14,2 14,8 20,8"/>
                          </svg>
                          Sekcije dokumenta ({getFilteredSections().length})
                        </h2>
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="secondary" className="bg-green-100 text-black">
                            {getFilteredSections().filter(s => s.analyzed).length} analizirano
                          </Badge>
                          <Badge variant="outline" className="text-black">
                            {getFilteredSections().filter(s => !s.analyzed).length} neanalizirano
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex-1 min-w-[300px]">
                        <Input
                          type="text"
                          placeholder="Pretraži sekcije..."
                          value={sectionsSearchQuery}
                          onChange={(e) => setSectionsSearchQuery(e.target.value)}
                          className="bg-white"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant={quickFilters.sections.analyzed ? "default" : "outline"}
                          size="sm"
                          onClick={() => setQuickFilters(prev => ({
                            ...prev,
                            sections: { ...prev.sections, analyzed: !prev.sections.analyzed, unanalyzed: false }
                          }))}
                          className="text-xs text-black"
                        >
                          Analizirano
                        </Button>
                        <Button
                          variant={quickFilters.sections.unanalyzed ? "default" : "outline"}
                          size="sm"
                          onClick={() => setQuickFilters(prev => ({
                            ...prev,
                            sections: { ...prev.sections, unanalyzed: !prev.sections.unanalyzed, analyzed: false }
                          }))}
                          className="text-xs text-black"
                        >
                          Neanalizirano
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Sections List */}
                  {getFilteredSections().length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                      {getPaginatedSections().map((section, index) => (
                        <motion.div
                          key={section._id}
                          className={`bg-white rounded-lg border border-green-200 p-4 shadow-sm transition-all duration-300 ${
                            expandedSections[section._id] 
                              ? 'md:col-span-2 xl:col-span-4' 
                              : 'col-span-1'
                          }`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          layout
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                                  Nivo {section.level}
                                </span>
                                <span className="bg-gray-100 text-black text-xs font-medium px-2 py-1 rounded-full">
                                  str. {section.pageStart}-{section.pageEnd}
                                </span>
                                {section.semanticType && (
                                  <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full capitalize">
                                    {section.semanticType === 'chapter' ? 'Poglavlje' :
                                     section.semanticType === 'section' ? 'Sekcija' :
                                     section.semanticType === 'subsection' ? 'Podsekcija' : 'Pasus'}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-base font-semibold text-black mb-1 leading-tight">
                                {section.title}
                              </h4>
                              <p className="text-xs text-gray-500 mb-2">
                                ID: {section.sectionId} • Path: {section.path}
                              </p>
                            </div>
                          
                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpandedSections(prev => ({
                                  ...prev,
                                  [section._id]: !prev[section._id]
                                }))}
                                className="text-black"
                              >
                                {expandedSections[section._id] ? '↑' : '↓'}
                              </Button>
                            </div>
                          </div>

                          {/* Expanded Content - Only Basic Section Content */}
                          {expandedSections[section._id] && (
                            <motion.div
                              className="mt-4 pt-4 border-t border-gray-100"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              transition={{ duration: 0.3 }}
                            >
                              <div>
                                <label className="text-sm font-medium text-black block mb-2">Sadržaj sekcije:</label>
                                {editingSections[section._id]?.content ? (
                                  <div className="space-y-2">
                                    <Textarea
                                      value={sectionEditValues[section._id]?.content || ''}
                                      onChange={(e) => setSectionEditValues(prev => ({
                                        ...prev,
                                        [section._id]: { ...prev[section._id], content: e.target.value }
                                      }))}
                                      className="min-h-[200px] text-sm leading-relaxed bg-white text-black border-gray-300"
                                      placeholder="Sadržaj sekcije..."
                                      autoFocus
                                    />
                                    <div className="flex gap-2">
                                      <Button size="sm" onClick={() => handleSaveSection(section._id, 'content')} className="text-black">
                                        Sačuvaj
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={() => handleCancelSectionEdit(section._id, 'content')} className="text-black">
                                        Otkaži
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="group relative">
                                    <div 
                                      className="text-sm text-black bg-gray-50 p-3 rounded border cursor-pointer hover:bg-gray-100 transition-colors min-h-[100px]"
                                      onClick={() => handleEditSection(section._id, 'content', section.content || '')}
                                    >
                                      {section.content ? (
                                        expandedSections[section._id] ? section.content : 
                                        `${section.content.substring(0, 300)}${section.content.length > 300 ? '...' : ''}`
                                      ) : (
                                        <span className="text-gray-400 italic">Nema sadržaja - kliknite da dodate</span>
                                      )}
                                    </div>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button 
                                        size="sm" 
                                        variant="ghost"
                                        onClick={() => handleEditSection(section._id, 'content', section.content || '')}
                                        className="h-6 w-6 p-1 bg-white shadow-sm text-black"
                                      >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                          <path d="m18.5 2.5-6 6"/>
                                        </svg>
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                          </motion.div>
                        )}
                        </motion.div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {getFilteredSections().length > sectionsPerPage && (
                      <div className="mt-6">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => setSectionsPage(prev => Math.max(1, prev - 1))}
                                className={sectionsPage === 1 ? "pointer-events-none opacity-50 text-black" : "cursor-pointer text-black"}
                              />
                            </PaginationItem>
                            
                            {Array.from({ length: Math.ceil(getFilteredSections().length / sectionsPerPage) }, (_, i) => (
                              <PaginationItem key={i + 1}>
                                <PaginationLink
                                  onClick={() => setSectionsPage(i + 1)}
                                  isActive={sectionsPage === i + 1}
                                  className="cursor-pointer text-black"
                                >
                                  {i + 1}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                            
                            <PaginationItem>
                              <PaginationNext 
                                onClick={() => setSectionsPage(prev => 
                                  Math.min(Math.ceil(getFilteredSections().length / sectionsPerPage), prev + 1)
                                )}
                                className={
                                  sectionsPage === Math.ceil(getFilteredSections().length / sectionsPerPage) 
                                    ? "pointer-events-none opacity-50 text-black" 
                                    : "cursor-pointer text-black"
                                }
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-2">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <path d="M8 9h8M8 13h8M8 17h5"/>
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500">Nema izdvojenih sekcija</p>
                      <p className="text-xs text-gray-400 mt-1">Pokrenite AI analizu da izdvojite sekcije</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </TabsContent>

            {/* AI Analytics Tab */}
            <TabsContent value="analysis" className="h-full p-0 m-0">
              <div className="h-full overflow-y-auto p-6">
                <motion.div 
                  className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {/* Advanced AI Analytics Toolbar */}
                  <div className="space-y-4 mb-6">
                    {/* Header with Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold text-black flex items-center gap-2">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-600">
                            <path d="M9 19c-5 0-7-2-7-5v-4c0-3 2-5 7-5 2 0 3.5.5 4.5 1.5C16 8.5 17.5 10 17.5 12s-1.5 3.5-4 2.5c-1-0.5-2.5-1-4.5-1z"/>
                            <path d="M15 9.5c.5-1 1.5-1.5 2.5-1.5 3 0 5 2 5 5s-2 5-5 5c-1 0-2-.5-2.5-1.5"/>
                          </svg>
                          AI Analytics ({getAiAnalyticsBySection().length})
                        </h2>
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="secondary" className="bg-purple-100 text-black">
                            {getAiAnalyticsBySection().filter(s => s.shortAbstract).length} sa sažetkom
                          </Badge>
                          <Badge variant="outline" className="bg-white text-black border-gray-300">
                            {getAiAnalyticsBySection().filter(s => s.keywords && s.keywords.length > 0).length} sa ključnim rečima
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setViewMode(viewMode === 'compact' ? 'list' : 'compact')}
                          className="text-xs bg-white text-black border-gray-300 hover:bg-gray-50"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                            <rect x="3" y="4" width="18" height="4"/>
                            <rect x="3" y="12" width="18" height="4"/>
                            <rect x="3" y="20" width="18" height="4"/>
                          </svg>
                          {viewMode === 'compact' ? 'Lista' : 'Kompakt'}
                        </Button>
                        <Button
                          size="sm"
                          variant={bulkEditMode ? 'default' : 'outline'}
                          onClick={() => setBulkEditMode(!bulkEditMode)}
                          className={bulkEditMode ? 'text-white bg-purple-600' : 'text-black border-gray-300 hover:bg-gray-50 bg-white'}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                            <path d="M9 12l2 2 4-4"/>
                          </svg>
                          Multi-select
                        </Button>
                      </div>
                    </div>
                    
                    {/* Enhanced Search and Quick Filters */}
                    <div className="flex flex-col lg:flex-row gap-3">
                      <div className="flex-1 relative">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <circle cx="11" cy="11" r="8"/>
                          <path d="m21 21-4.35-4.35"/>
                        </svg>
                        <Input
                          value={analyticsSearchQuery}
                          onChange={(e) => {
                            setAnalyticsSearchQuery(e.target.value);
                            setAnalyticsPage(1);
                          }}
                          placeholder="Pretraži po naslovu, sažetku, ključnim rečima..."
                          className="pl-10 bg-white text-black border-gray-300 focus:border-purple-500"
                        />
                        {analyticsSearchQuery && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setAnalyticsSearchQuery('');
                              setAnalyticsPage(1);
                            }}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 text-black"
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant={quickFilters.analytics.hasAbstract ? "default" : "outline"}
                          size="sm"
                          onClick={() => setQuickFilters(prev => ({
                            ...prev,
                            analytics: { ...prev.analytics, hasAbstract: !prev.analytics.hasAbstract }
                          }))}
                          className="text-xs text-black"
                        >
                          Sa sažetkom
                        </Button>
                        <Button
                          variant={quickFilters.analytics.hasKeywords ? "default" : "outline"}
                          size="sm"
                          onClick={() => setQuickFilters(prev => ({
                            ...prev,
                            analytics: { ...prev.analytics, hasKeywords: !prev.analytics.hasKeywords }
                          }))}
                          className="text-xs text-black"
                        >
                          Sa ključnim rečima
                        </Button>
                        <select
                          value={quickFilters.analytics.level}
                          onChange={(e) => setQuickFilters(prev => ({
                            ...prev,
                            analytics: { ...prev.analytics, level: e.target.value }
                          }))}
                          className="text-xs px-3 py-1 border border-gray-300 rounded bg-white text-black"
                        >
                          <option value="all">Svi nivoi</option>
                          <option value="1">Nivo 1</option>
                          <option value="2">Nivo 2</option>
                          <option value="3">Nivo 3</option>
                          <option value="4">Nivo 4</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {getAiAnalyticsBySection().length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto">
                          <path d="M9 19c-5 0-7-2-7-5v-4c0-3 2-5 7-5 2 0 3.5.5 4.5 1.5C16 8.5 17.5 10 17.5 12s-1.5 3.5-4 2.5c-1-0.5-2.5-1-4.5-1z"/>
                          <path d="M15 9.5c.5-1 1.5-1.5 2.5-1.5 3 0 5 2 5 5s-2 5-5 5c-1 0-2-.5-2.5-1.5"/>
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-black mb-2">Nema AI Analytics podataka</h3>
                      <p className="text-sm text-black mb-4">Sekcije moraju biti analizirane da bi se prikazali AI podaci</p>
                      <Button
                        variant="outline"
                        onClick={() => handleAnalyzeMaterial(material._id)}
                        disabled={analyzingMaterial}
                        className="bg-white text-black border-gray-300 hover:bg-gray-50"
                      >
                        {analyzingMaterial ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2 animate-spin">
                            <path d="M21 12a9 9 0 11-6.219-8.56"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                          </svg>
                        )}
                        Pokreni AI analizu
                      </Button>
                    </div>
                  ) : (
                    <>
                      {/* Results Summary */}
                      <div className="flex justify-center gap-8 mb-6 py-4 bg-white rounded-lg border border-purple-100">
                        <div className="text-center">
                          <span className="text-2xl font-bold text-purple-600">{getAiAnalyticsBySection().length}</span>
                          <p className="text-sm text-black">analiziranih sekcija sa AI podacima</p>
                        </div>
                        {analyticsSearchQuery && (
                          <div className="text-center flex-1">
                            <span className="text-lg font-semibold text-black">{getPaginatedAiAnalytics().length}</span>
                            <p className="text-sm text-black">rezultata pretrage</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Analytics Results */}
                      <div className={viewMode === 'compact' ? 'space-y-2' : 'space-y-4'}>
                        {getPaginatedAiAnalytics().map((section, index) => (
                          <div key={section._id} className={`bg-white rounded-lg border border-purple-200 shadow-sm hover:shadow-md transition-shadow ${viewMode === 'compact' ? 'p-3' : 'p-4'}`}>
                            {viewMode === 'compact' ? (
                              /* Compact AI Analytics View */
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                  {bulkEditMode && (
                                    <input
                                      type="checkbox"
                                      checked={selectedAnalytics.has(section._id)}
                                      onChange={(e) => {
                                        const newSelected = new Set(selectedAnalytics);
                                        if (e.target.checked) {
                                          newSelected.add(section._id);
                                        } else {
                                          newSelected.delete(section._id);
                                        }
                                        setSelectedAnalytics(newSelected);
                                      }}
                                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                                    />
                                  )}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="font-medium text-black text-sm">{section.title}</h3>
                                      <Badge variant="outline" className="text-xs text-black">
                                        Nivo {section.level}
                                      </Badge>
                                      {section.shortAbstract && (
                                        <Badge variant="secondary" className="text-xs bg-purple-100 text-black">
                                          Sažetak
                                        </Badge>
                                      )}
                                    </div>
                                    {section.shortAbstract && (
                                      <p className="text-xs text-black line-clamp-2">
                                        {section.shortAbstract.substring(0, 100)}...
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 ml-3">
                                  {section.keywords && section.keywords.length > 0 && (
                                    <span className="text-xs text-black bg-gray-100 px-2 py-1 rounded">
                                      {section.keywords.length} reči
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              /* Full AI Analytics View */
                              <>
                                <div className="flex justify-between items-start mb-3">
                                  {/* Multi-select checkbox */}
                                  {bulkEditMode && (
                                    <div className="mr-3 mt-1">
                                      <input
                                        type="checkbox"
                                        checked={selectedAnalytics.has(section._id)}
                                        onChange={(e) => {
                                          const newSelected = new Set(selectedAnalytics);
                                          if (e.target.checked) {
                                            newSelected.add(section._id);
                                          } else {
                                            newSelected.delete(section._id);
                                          }
                                          setSelectedAnalytics(newSelected);
                                        }}
                                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                                      />
                                    </div>
                                  )}
                                  
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <h3 className="font-semibold text-black">{section.title}</h3>
                                      <Badge variant="outline" className="text-xs text-black">
                                        Nivo {section.level}
                                      </Badge>
                                      <Badge variant="secondary" className="text-xs text-black">
                                        str. {section.pageStart}-{section.pageEnd}
                                      </Badge>
                                    </div>
                                    
                                    {section.shortAbstract && (
                                      <div className="mb-3">
                                        <label className="text-sm font-medium text-black block mb-1">Sažetak:</label>
                                        {editingSections[section._id]?.shortAbstract ? (
                                          <div className="space-y-2">
                                            <Textarea
                                              value={sectionEditValues[section._id]?.shortAbstract || ''}
                                              onChange={(e) => setSectionEditValues(prev => ({
                                                ...prev,
                                                [section._id]: { ...prev[section._id], shortAbstract: e.target.value }
                                              }))}
                                              className="min-h-[100px] text-sm bg-white text-black border-gray-300"
                                              placeholder="Sažetak sekcije..."
                                              autoFocus
                                            />
                                            <div className="flex gap-2">
                                              <Button size="sm" onClick={() => handleSaveSection(section._id, 'shortAbstract')} className="text-black">
                                                Sačuvaj
                                              </Button>
                                              <Button size="sm" variant="outline" onClick={() => handleCancelSectionEdit(section._id, 'shortAbstract')} className="text-black">
                                                Otkaži
                                              </Button>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="group relative">
                                            <p 
                                              className="text-sm text-black bg-gray-50 p-3 rounded border cursor-pointer hover:bg-gray-100 transition-colors"
                                              onClick={() => handleEditSection(section._id, 'shortAbstract', section.shortAbstract)}
                                            >
                                              {section.shortAbstract}
                                            </p>
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                              <Button 
                                                size="sm" 
                                                variant="ghost"
                                                onClick={() => handleEditSection(section._id, 'shortAbstract', section.shortAbstract)}
                                                className="h-6 w-6 p-1 bg-white shadow-sm text-black"
                                              >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                  <path d="m18.5 2.5-6 6"/>
                                                </svg>
                                              </Button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    
                                    {(section.keywords && section.keywords.length > 0) || editingSections[section._id]?.keywords ? (
                                      <div className="mb-3">
                                        <label className="text-sm font-medium text-black block mb-1">Ključne reči:</label>
                                        {editingSections[section._id]?.keywords ? (
                                          <div className="space-y-2">
                                            <Textarea
                                              value={Array.isArray(sectionEditValues[section._id]?.keywords) 
                                                ? sectionEditValues[section._id]?.keywords.join(', ')
                                                : sectionEditValues[section._id]?.keywords || ''}
                                              onChange={(e) => {
                                                const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k);
                                                setSectionEditValues(prev => ({
                                                  ...prev,
                                                  [section._id]: { ...prev[section._id], keywords: keywords }
                                                }));
                                              }}
                                              className="min-h-[80px] text-sm bg-white text-black border-gray-300"
                                              placeholder="Unesite ključne reči odvojene zarezom..."
                                              autoFocus
                                            />
                                            <div className="flex gap-2">
                                              <Button size="sm" onClick={() => handleSaveSection(section._id, 'keywords')} className="text-black">
                                                Sačuvaj
                                              </Button>
                                              <Button size="sm" variant="outline" onClick={() => handleCancelSectionEdit(section._id, 'keywords')} className="text-black">
                                                Otkaži
                                              </Button>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="group relative">
                                            <div 
                                              className="flex flex-wrap gap-1 p-2 bg-gray-50 rounded border cursor-pointer hover:bg-gray-100 transition-colors min-h-[40px]"
                                              onClick={() => handleEditSection(section._id, 'keywords', section.keywords || [])}
                                            >
                                              {section.keywords && section.keywords.length > 0 ? (
                                                section.keywords.map((keyword, i) => (
                                                  <Badge key={i} variant="secondary" className="text-xs bg-purple-100 text-black">
                                                    {keyword}
                                                  </Badge>
                                                ))
                                              ) : (
                                                <span className="text-gray-400 italic text-sm">Kliknite da dodate ključne reči</span>
                                              )}
                                            </div>
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                              <Button 
                                                size="sm" 
                                                variant="ghost"
                                                onClick={() => handleEditSection(section._id, 'keywords', section.keywords || [])}
                                                className="h-6 w-6 p-1 bg-white shadow-sm text-black"
                                              >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                  <path d="m18.5 2.5-6 6"/>
                                                </svg>
                                              </Button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ) : null}
                                    
                                    {(section.queries && section.queries.length > 0) || editingSections[section._id]?.queries ? (
                                      <div className="mb-3">
                                        <label className="text-sm font-medium text-black block mb-1">Generisani upiti:</label>
                                        {editingSections[section._id]?.queries ? (
                                          <div className="space-y-2">
                                            <Textarea
                                              value={Array.isArray(sectionEditValues[section._id]?.queries) 
                                                ? sectionEditValues[section._id]?.queries.join('\n')
                                                : sectionEditValues[section._id]?.queries || ''}
                                              onChange={(e) => {
                                                const queries = e.target.value.split('\n').map(q => q.trim()).filter(q => q);
                                                setSectionEditValues(prev => ({
                                                  ...prev,
                                                  [section._id]: { ...prev[section._id], queries: queries }
                                                }));
                                              }}
                                              className="min-h-[120px] text-sm bg-white text-black border-gray-300"
                                              placeholder="Unesite upite, svaki u novom redu..."
                                              autoFocus
                                            />
                                            <div className="flex gap-2">
                                              <Button size="sm" onClick={() => handleSaveSection(section._id, 'queries')} className="text-black">
                                                Sačuvaj
                                              </Button>
                                              <Button size="sm" variant="outline" onClick={() => handleCancelSectionEdit(section._id, 'queries')} className="text-black">
                                                Otkaži
                                              </Button>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="group relative">
                                            <div 
                                              className="space-y-1 p-2 bg-gray-50 rounded border cursor-pointer hover:bg-gray-100 transition-colors min-h-[60px]"
                                              onClick={() => handleEditSection(section._id, 'queries', section.queries || [])}
                                            >
                                              {section.queries && section.queries.length > 0 ? (
                                                <>
                                                  {section.queries.slice(0, 3).map((query, i) => (
                                                    <div key={i} className="text-xs text-black bg-blue-50 px-2 py-1 rounded">
                                                      {query}
                                                    </div>
                                                  ))}
                                                  {section.queries.length > 3 && (
                                                    <div className="text-xs text-black italic">
                                                      +{section.queries.length - 3} više upita
                                                    </div>
                                                  )}
                                                </>
                                              ) : (
                                                <span className="text-gray-400 italic text-sm">Kliknite da dodate upite</span>
                                              )}
                                            </div>
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                              <Button 
                                                size="sm" 
                                                variant="ghost"
                                                onClick={() => handleEditSection(section._id, 'queries', section.queries || [])}
                                                className="h-6 w-6 p-1 bg-white shadow-sm text-black"
                                              >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                  <path d="m18.5 2.5-6 6"/>
                                                </svg>
                                              </Button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Pagination for AI Analytics */}
                  {getAnalyticsTotalPages() > 1 && (
                    <div className="mt-6 flex justify-center">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => setAnalyticsPage(prev => Math.max(1, prev - 1))}
                              className={analyticsPage === 1 ? 'pointer-events-none opacity-50 text-black' : 'cursor-pointer hover:bg-gray-100 text-black hover:text-black'}
                            />
                          </PaginationItem>
                          {Array.from({length: getAnalyticsTotalPages()}, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setAnalyticsPage(page)}
                                isActive={page === analyticsPage}
                                className="cursor-pointer hover:bg-gray-100 text-black hover:text-black"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => setAnalyticsPage(prev => 
                                Math.min(getAnalyticsTotalPages(), prev + 1)
                              )}
                              className={
                                analyticsPage === getAnalyticsTotalPages()
                                  ? 'pointer-events-none opacity-50 text-black'
                                  : 'cursor-pointer hover:bg-gray-100 text-black hover:text-black'
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </motion.div>
              </div>
            </TabsContent>
            
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>

      {/* Page Selection Modal for Processing */}
      <Dialog open={isPageSelectionModalOpen} onOpenChange={setIsPageSelectionModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Konfiguracija obrade knjige</DialogTitle>
            <DialogDescription className="text-gray-600">
              Materijal: {pageSelectionMaterial?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="tocPage" className="text-sm font-medium text-gray-700">
                  Sadržaj počinje na str.
                </label>
                <Input
                  id="tocPage"
                  type="number"
                  value={tocPage || ''}
                  onChange={(e) => setTocPage(e.target.value ? Math.max(1, parseInt(e.target.value) || 1) : undefined)}
                  min="1"
                  placeholder="npr. 2"
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="tocToPage" className="text-sm font-medium text-gray-700">
                  Sadržaj završava na str.
                </label>
                <Input
                  id="tocToPage"
                  type="number"
                  value={tocToPage || ''}
                  onChange={(e) => setTocToPage(e.target.value ? Math.max(1, parseInt(e.target.value) || 1) : undefined)}
                  min="1"
                  placeholder="npr. 4"
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              AI će analizirati stranice sadržaja i automatski prepoznati sve sekcije. Obrada knjige će početi nakon poslednje stranice sadržaja.
            </p>

            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="font-medium">Celokupna knjiga će biti obrađena</span>
              </div>
              <p className="text-xs mt-1">Nema ograničenja na broj stranica - sve sekcije će biti izdvojene i indeksirane</p>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsPageSelectionModalOpen(false);
                  setPageSelectionMaterial(null);
                  setTocPage(undefined);
                  setTocToPage(undefined);
                }}
                className="bg-white text-black border-gray-300 hover:bg-gray-50"
              >
                Otkaži
              </Button>
              <Button
                onClick={handleStartProcessing}
                className="bg-black hover:bg-gray-800 text-white"
              >
                Pokreni obradu cele knjige
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MaterialDetailModal;