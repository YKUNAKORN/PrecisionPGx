"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Edit, CheckCircle, AlertCircle, XCircle, User, Calendar, MapPin, Phone, FileText, X, ChevronDown, ChevronUp, Info, TrendingUp, Shield, BookOpen } from "lucide-react";

const stepLabels = [
  { number: 1, label: "Patient", active: true },
  { number: 2, label: "Raw Data", active: false },
  { number: 3, label: "Genotype", active: false },
  { number: 4, label: "Phenotype", active: false },
  { number: 5, label: "Recommendations", active: false },
  { number: 6, label: "Confirmation", active: false },
  { number: 7, label: "Export PDF", active: false }
];

const patientReports = [
  {
    reportNumber: "RPT-2025-001",
    patient: "John Smith", 
    status: "Completed",
    isApprove: "approved",
    approvalColor: "green",
    patientId: "PAT-001",
    dateOfBirth: "1985-03-15",
    gender: "Male",
    mrn: "MRN-456789",
    orderingPhysician: "Dr. Michael Roberts",
    sampleType: "Blood",
    collectionDate: "2024-12-15",
    testType: "Pharmacogenomics Panel"
  },
  {
    reportNumber: "RPT-2025-002",
    patient: "Sarah Johnson",
    status: "In Progress", 
    isApprove: "pending",
    approvalColor: "yellow",
    patientId: "PAT-002",
    dateOfBirth: "1990-07-22",
    gender: "Female",
    mrn: "MRN-123456",
    orderingPhysician: "Dr. Emily Chen",
    sampleType: "Saliva",
    collectionDate: "2024-12-18",
    testType: "Pharmacogenomics Panel"
  },
  {
    reportNumber: "RPT-2025-003",
    patient: "Michael Brown",
    status: "Failed",
    isApprove: "rejected", 
    approvalColor: "red",
    patientId: "PAT-003",
    dateOfBirth: "1978-11-08",
    gender: "Male",
    mrn: "MRN-789012",
    orderingPhysician: "Dr. Sarah Williams",
    sampleType: "Blood",
    collectionDate: "2024-12-10",
    testType: "Pharmacogenomics Panel"
  },
  {
    reportNumber: "RPT-2025-004",
    patient: "Emily Davis",
    status: "Failed",
    isApprove: "rejected",
    approvalColor: "red",
    patientId: "PAT-004",
    dateOfBirth: "1992-01-30",
    gender: "Female",
    mrn: "MRN-345678",
    orderingPhysician: "Dr. David Thompson",
    sampleType: "Blood",
    collectionDate: "2024-12-12",
    testType: "Pharmacogenomics Panel"
  },
  {
    reportNumber: "RPT-2025-005",
    patient: "David Wilson",
    status: "In Progress",
    isApprove: "pending",
    approvalColor: "yellow",
    patientId: "PAT-005",
    dateOfBirth: "1987-09-14",
    gender: "Male",
    mrn: "MRN-901234",
    orderingPhysician: "Dr. Lisa Anderson",
    sampleType: "Saliva",
    collectionDate: "2024-12-20",
    testType: "Pharmacogenomics Panel"
  },
  {
    reportNumber: "RPT-2025-006", 
    patient: "Lisa Anderson",
    status: "In Progress",
    isApprove: "pending",
    approvalColor: "yellow",
    patientId: "PAT-006",
    dateOfBirth: "1983-05-03",
    gender: "Female",
    mrn: "MRN-567890",
    orderingPhysician: "Dr. John Miller",
    sampleType: "Blood",
    collectionDate: "2024-12-22",
    testType: "Pharmacogenomics Panel"
  }
];

const genotypeData = [
  {
    gene: "CYP2C19",
    alleles: "*1 / *2",
    copyNumber: 2,
    coverage: "180x",
    alleleBalance: "46%",
    quality: 92
  },
  {
    gene: "CYP2D6", 
    alleles: "*1 / *4",
    copyNumber: 2,
    coverage: "150x",
    alleleBalance: "52%",
    quality: 89
  },
  {
    gene: "SLCO1B1",
    alleles: "*1 / *5",
    copyNumber: 2,
    coverage: "120x",
    alleleBalance: "51%",
    quality: 90
  }
];

const approvalTestResults = [
  {
    testType: "CYP2C19 Genotyping",
    result: "*1/*2, *4/*8, *9/*5",
    referenceRange: "*1/*1, *2/*3, *4/*6",
    status: "Intermediate Metabolizer",
    statusColor: "bg-secondary text-secondary-foreground"
  },
  {
    testType: "CYP2D6 Genotyping",
    result: "*1/*4, *3/*2, *6/*9",
    referenceRange: "*1/*1, *2/*3, *4/*6", 
    status: "Intermediate Metabolizer",
    statusColor: "bg-secondary text-secondary-foreground"
  },
  {
    testType: "SLCO1B1 Genotyping",
    result: "*1/*5, *6/*3, *9/*2",
    referenceRange: "*1/*1, *2/*3, *4/*6",
    status: "Normal Function", 
    statusColor: "bg-primary text-primary-foreground"
  }
];

export function ResultInterpretation() {
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [selectedPatientData, setSelectedPatientData] = useState<any>(null);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [approvalReportData, setApprovalReportData] = useState<any>(null);
  const [reviewerName, setReviewerName] = useState("");
  const [comments, setComments] = useState("");

  // Enhanced phenotype prediction states
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());
  const [selectedGene, setSelectedGene] = useState<string | null>(null);
  const [showRuleDetails, setShowRuleDetails] = useState(false);

  // Phenotype classification states
  const [expandedGenePhenotype, setExpandedGenePhenotype] = useState<string | null>(null);
  const [showDetailedRulesPhenotype, setShowDetailedRulesPhenotype] = useState(false);
  
  // Quality validation state
  const [testerType, setTesterType] = useState("Illumina MiSeq");
  const [isValidated, setIsValidated] = useState(false);
  const [validationResults, setValidationResults] = useState({
    coverage: { value: 150, threshold: 100, passed: false },
    alleleBalance: { value: 48, threshold: 40, passed: false },
    qualityScore: { value: 92, threshold: 90, passed: false }
  });

  const updateStepStatus = (stepNumber: number) => {
    return stepLabels.map(step => ({
      ...step,
      active: step.number <= stepNumber
    }));
  };

  const getActiveSteps = () => updateStepStatus(currentStep);

  const canNavigateToStep = (stepNumber: number) => {
    // User can always go to step 1
    if (stepNumber === 1) return true;
    
    // Can only go to step 2 if a report is selected
    if (stepNumber === 2) return selectedReport !== null;
    
    // For steps 3-7, can navigate if we've reached that step before
    // (In a real application, you might want more sophisticated validation)
    if (stepNumber >= 3 && stepNumber <= 7) {
      return selectedReport !== null && currentStep >= stepNumber - 1;
    }
    
    return false;
  };

  const handleStepClick = (stepNumber: number) => {
    if (canNavigateToStep(stepNumber)) {
      setCurrentStep(stepNumber);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="text-white" style={{ backgroundColor: '#7864B4' }}>Completed</Badge>;
      case "In Progress": 
        return <Badge className="text-white" style={{ backgroundColor: '#9682C8' }}>In Progress</Badge>;
      case "Failed":
        return <Badge variant="outline" className="bg-[#FFF0F0]" style={{ borderColor: '#DC6464', color: '#DC6464' }}>Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getApprovalIcon = (approval: string) => {
    switch (approval) {
      case "approved":
        return <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#64B464' }}></div>;
      case "pending":
        return <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#DCB450' }}></div>;
      case "rejected":
        return <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#DC6464' }}></div>;
      default:
        return null;
    }
  };

  // Enhanced phenotype prediction helper functions
  const toggleRuleExpansion = (gene: string) => {
    const newExpanded = new Set(expandedRules);
    if (newExpanded.has(gene)) {
      newExpanded.delete(gene);
    } else {
      newExpanded.add(gene);
    }
    setExpandedRules(newExpanded);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-primary/10 text-primary';
    if (confidence >= 70) return 'bg-secondary/10 text-secondary-foreground';
    return 'bg-muted text-muted-foreground';
  };

  const getEvidenceColor = (level: string) => {
    switch (level) {
      case 'A': return 'bg-primary text-primary-foreground';
      case 'B': return 'bg-secondary text-secondary-foreground';
      case 'C': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const openGeneDetails = (gene: string) => {
    setSelectedGene(gene);
    setShowRuleDetails(true);
  };

  const renderPatientReports = () => (
    <>
      {/* Search and Filters */}
      <div className="p-6 border-b" style={{ backgroundColor: '#EDE9FE', borderColor: '#DCDCE6' }}>
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#969696' }} />
            <Input
              placeholder="Search reports, patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white placeholder:text-[#969696]"
              style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}
            />
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white cursor-pointer hover:bg-[#D9C0FB] hover:border-[#D9C0FB] transition-colors"
            style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}
          >
            Clear All (Test 0 patients)
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white cursor-pointer hover:bg-[#D9C0FB] hover:border-[#D9C0FB] transition-colors"
            style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}
          >
            Reset Data
          </Button>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b" style={{ backgroundColor: '#EDE9FE', borderColor: '#DCDCE6' }}>
            <tr>
              <th className="text-left p-4 font-medium" style={{ color: '#1E1E1E' }}>Report Number</th>
              <th className="text-left p-4 font-medium" style={{ color: '#1E1E1E' }}>Patient</th>
              <th className="text-left p-4 font-medium" style={{ color: '#1E1E1E' }}>Status</th>
              <th className="text-left p-4 font-medium" style={{ color: '#1E1E1E' }}>IsApprove</th>
              <th className="text-left p-4 font-medium" style={{ color: '#1E1E1E' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patientReports.map((report, index) => (
              <tr key={report.reportNumber} className="bg-white border-b" style={{ borderColor: '#DCDCE6' }}>
                <td className="p-4" style={{ color: '#1E1E1E' }}>{report.reportNumber}</td>
                <td className="p-4" style={{ color: '#1E1E1E' }}>{report.patient}</td>
                <td className="p-4">
                  {getStatusBadge(report.status)}
                </td>
                <td className="p-4">
                  {getApprovalIcon(report.isApprove)}
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-white cursor-pointer hover:bg-[#D9C0FB] hover:border-[#D9C0FB] transition-colors"
                      style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}
                      onClick={() => {
                        // Handle edit action
                        setSelectedReport(report.reportNumber);
                        setSelectedPatientData(report);
                        setCurrentStep(2);
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      EDIT
                    </Button>
                    
                    <Button 
                      size="sm"
                      variant="outline" 
                      className="bg-white cursor-pointer hover:bg-[#D9C0FB] hover:border-[#D9C0FB] transition-colors"
                      style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}
                      onClick={() => {
                        setApprovalReportData(report);
                        setIsApprovalDialogOpen(true);
                      }}
                    >
                      Approval
                    </Button>
                    
                    <Button 
                      size="sm"
                      className="text-white cursor-pointer"
                      style={{ backgroundColor: '#7864B4' }}
                      onClick={() => {
                        setSelectedReport(report.reportNumber);
                        setSelectedPatientData(report);
                        setCurrentStep(2);
                      }}
                    >
                      {report.status === "Completed" ? "Preview" : "Continue"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t" style={{ backgroundColor: '#EDE9FE', borderColor: '#DCDCE6' }}>
        <p className="text-sm" style={{ color: '#1E1E1E' }}>Showing 6 of 6 reports</p>
      </div>
    </>
  );

  const renderRawData = () => (
    <div className="p-6 space-y-6 rounded-[20px] w-full max-w-full box-border" style={{ backgroundColor: '#F5F3FF' }}>
      <div>
        <h3 className="font-medium mb-4" style={{ color: '#1E1E1E' }}>Raw Variant Data (VCF excerpt)</h3>
        
        {/* VCF Data Display */}
        <div className="bg-white border font-mono text-sm p-4 rounded-lg overflow-x-auto" style={{ borderColor: '#C8C8D2' }}>
          <div className="whitespace-pre" style={{ color: '#1E1E1E' }}>
#CHROM POS ID REF ALT QUAL FILTER INFO{'\n'}
chr19 9655168 rs11185532 C T 99 PASS GENE=CYP2C19;IMPACT=MODERATE{'\n'}
chr19 9471810 rs4986833 G A 99 PASS GENE=CYP2C19;IMPACT=HIGH{'\n'}
chr22 42130797 rs1135840 C G 99 PASS GENE=CYP2D6;IMPACT=LOW
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-6">
        <div className="text-center">
          <p style={{ color: '#505050' }}>Coverage</p>
          <p className="text-2xl font-medium" style={{ color: '#1E1E1E' }}>110x</p>
        </div>
        
        <div className="text-center">
          <p style={{ color: '#505050' }}>Mean QScore</p>
          <p className="text-2xl font-medium" style={{ color: '#1E1E1E' }}>38</p>
        </div>
        
        <div className="text-center">
          <p style={{ color: '#505050' }}>Reads on Target</p>
          <p className="text-2xl font-medium" style={{ color: '#1E1E1E' }}>99%</p>
        </div>
      </div>


      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline"
          className="bg-white cursor-pointer hover:bg-[#D9C0FB] hover:border-[#D9C0FB] transition-colors"
          style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}
          onClick={() => setCurrentStep(1)}
        >
          Back
        </Button>
        <Button 
          className="text-white cursor-pointer"
          style={{ backgroundColor: '#7864B4' }}
          onClick={() => setCurrentStep(3)}
        >
          Continue to Genotype
        </Button>
      </div>
    </div>
  );  const renderGenotype = () => (
    <div className="p-6 space-y-6 rounded-[20px] w-full max-w-full box-border" style={{ backgroundColor: '#F5F3FF' }}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="mb-1" style={{ color: '#1E1E1E' }}>Rule-Based Genotype Interpretation</h3>
          <p className="text-sm" style={{ color: '#505050' }}>Algorithm-based genotype-to-phenotype conversion following CPIC/PharmGKB guidelines</p>
        </div>
        
        {/* Genotype Table */}
        <div className="overflow-hidden rounded-xl elevation-1 bg-white border" style={{ borderColor: '#C8C8D2' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#EDE9FE' }}>
                <th className="text-left px-6 py-4" style={{ color: '#1E1E1E' }}>Gene</th>
                <th className="text-left px-6 py-4" style={{ color: '#1E1E1E' }}>Alleles</th>
                <th className="text-center px-4 py-4" style={{ color: '#1E1E1E', backgroundColor: '#F5F3FF' }}>G/G</th>
                <th className="text-center px-4 py-4" style={{ color: '#1E1E1E', backgroundColor: '#F5F3FF' }}>C/C</th>
                <th className="text-center px-4 py-4" style={{ color: '#1E1E1E', backgroundColor: '#F5F3FF' }}>A/A</th>
                <th className="text-center px-4 py-4" style={{ color: '#1E1E1E', backgroundColor: '#F5F3FF' }}>T/T</th>
                <th className="text-left px-6 py-4" style={{ color: '#1E1E1E' }}>Predicted Genotype</th>
                <th className="text-left px-6 py-4" style={{ color: '#1E1E1E' }}>Column Predicted Phenotype</th>
                <th className="text-center px-4 py-4" style={{ color: '#1E1E1E' }}>Rules</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {genotypeData.map((row, index) => {
                // Enhanced rule-based interpretation logic following CPIC/PharmGKB guidelines
                const interpretations = {
                  'CYP2C19': {
                    gg: '−',
                    cc: '✓',
                    aa: '−',
                    tt: '−',
                    predicted: '*1/*2',
                    phenotype: 'Intermediate Metabolizer',
                    phenotypeShort: 'IM',
                    activityScore: '1.5',
                    containerColor: 'bg-secondary/10',
                    textColor: 'text-secondary-foreground-container',
                    confidence: 92,
                    evidence: 'A',
                    rules: [
                      'CYP2C19*2 (681G>A): No function allele',
                      'CYP2C19*1: Normal function allele',
                      'Activity Score: 1.0 + 0.5 = 1.5',
                      'Phenotype: Intermediate Metabolizer (IM)'
                    ],
                    cpicGuideline: 'CPIC Guideline for CYP2C19 and Proton Pump Inhibitors',
                    clinicalSignificance: 'Reduced clopidogrel activation, consider alternative antiplatelet therapy'
                  },
                  'CYP2D6': {
                    gg: '✓',
                    cc: '−',
                    aa: '−',
                    tt: '✓',
                    predicted: '*1/*4',
                    phenotype: 'Intermediate Metabolizer',
                    phenotypeShort: 'IM',
                    activityScore: '1.0',
                    containerColor: 'bg-secondary/10',
                    textColor: 'text-secondary-foreground-container',
                    confidence: 88,
                    evidence: 'A',
                    rules: [
                      'CYP2D6*4: No function allele',
                      'CYP2D6*1: Normal function allele',
                      'Activity Score: 1.0 + 0.0 = 1.0',
                      'Phenotype: Intermediate Metabolizer (IM)'
                    ],
                    cpicGuideline: 'CPIC Guideline for CYP2D6 and SSRIs',
                    clinicalSignificance: 'Reduced metabolism of many antidepressants, consider dose adjustment'
                  },
                  'SLCO1B1': {
                    gg: '−',
                    cc: '−',
                    aa: '✓',
                    tt: '−',
                    predicted: '*1/*5',
                    phenotype: 'Normal Function',
                    phenotypeShort: 'NM',
                    activityScore: '2.0',
                    containerColor: 'bg-muted',
                    textColor: 'text-foreground',
                    confidence: 95,
                    evidence: 'A',
                    rules: [
                      'SLCO1B1*5: Decreased function allele',
                      'SLCO1B1*1: Normal function allele',
                      'Combined Effect: Normal transporter activity',
                      'Phenotype: Normal Function (NM)'
                    ],
                    cpicGuideline: 'CPIC Guideline for SLCO1B1 and Statins',
                    clinicalSignificance: 'Normal statin transport, standard dosing appropriate'
                  }
                };
                const interp = interpretations[row.gene as keyof typeof interpretations] ||
                               {
                                 gg: '−', cc: '−', aa: '−', tt: '−',
                                 predicted: 'N/A', phenotype: 'Unknown', phenotypeShort: 'UK',
                                 activityScore: '0.0', containerColor: 'bg-destructive/10',
                                 textColor: 'text-destructive', confidence: 0, evidence: 'D',
                                 rules: ['Insufficient data for interpretation'],
                                 cpicGuideline: 'No guideline available',
                                 clinicalSignificance: 'Interpretation not possible'
                               };
                
                return (
                      <tr key={row.gene} className="border-t hover:bg-[#F5F3FF] transition-colors" style={{ borderColor: '#DCDCE6' }}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 rounded" style={{ accentColor: '#7864B4' }} />
                        <span style={{ color: '#1E1E1E' }}>{row.gene}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm" style={{ color: '#1E1E1E' }}>{row.alleles}</span>
                    </td>
                    <td className="px-4 py-4 text-center" style={{ backgroundColor: '#F5F3FF' }}>
                      <span style={{ color: interp.gg === '✓' ? '#7864B4' : '#505050' }}>
                        {interp.gg}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center" style={{ backgroundColor: '#F5F3FF' }}>
                      <span style={{ color: interp.cc === '✓' ? '#7864B4' : '#505050' }}>
                        {interp.cc}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center" style={{ backgroundColor: '#F5F3FF' }}>
                      <span style={{ color: interp.aa === '✓' ? '#7864B4' : '#505050' }}>
                        {interp.aa}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center" style={{ backgroundColor: '#F5F3FF' }}>
                      <span style={{ color: interp.tt === '✓' ? '#7864B4' : '#505050' }}>
                        {interp.tt}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm" style={{ color: '#1E1E1E' }}>{interp.predicted}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${interp.containerColor}`}>
                        <span className={`text-xs font-mono ${interp.textColor}`}>{interp.phenotypeShort}</span>
                        <span className={`text-sm ${interp.textColor}`}>{interp.phenotype}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRuleExpansion(row.gene)}
                        className="h-8 w-8 p-0 hover:bg-[#F5F3FF] cursor-pointer"
                      >
                        {expandedRules.has(row.gene) ? (
                          <ChevronUp className="h-4 w-4" style={{ color: '#1E1E1E' }} />
                        ) : (
                          <ChevronDown className="h-4 w-4" style={{ color: '#1E1E1E' }} />
                        )}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Expandable Rule Details */}
        {expandedRules.size > 0 && (
          <div className="space-y-4 mt-6">
            <h3 className="text-foreground font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Rule-Based Prediction Details
            </h3>
            {Array.from(expandedRules).map(gene => {
              const interp = {
                'CYP2C19': {
                  rules: [
                    'CYP2C19*2 (681G>A): No function allele',
                    'CYP2C19*1: Normal function allele',
                    'Activity Score: 1.0 + 0.5 = 1.5',
                    'Phenotype: Intermediate Metabolizer (IM)'
                  ],
                  cpicGuideline: 'CPIC Guideline for CYP2C19 and Proton Pump Inhibitors',
                  clinicalSignificance: 'Reduced clopidogrel activation, consider alternative antiplatelet therapy'
                },
                'CYP2D6': {
                  rules: [
                    'CYP2D6*4: No function allele',
                    'CYP2D6*1: Normal function allele',
                    'Activity Score: 1.0 + 0.0 = 1.0',
                    'Phenotype: Intermediate Metabolizer (IM)'
                  ],
                  cpicGuideline: 'CPIC Guideline for CYP2D6 and SSRIs',
                  clinicalSignificance: 'Reduced metabolism of many antidepressants, consider dose adjustment'
                },
                'SLCO1B1': {
                  rules: [
                    'SLCO1B1*5: Decreased function allele',
                    'SLCO1B1*1: Normal function allele',
                    'Combined Effect: Normal transporter activity',
                    'Phenotype: Normal Function (NM)'
                  ],
                  cpicGuideline: 'CPIC Guideline for SLCO1B1 and Statins',
                  clinicalSignificance: 'Normal statin transport, standard dosing appropriate'
                }
              }[gene] || {
                rules: ['Insufficient data for interpretation'],
                cpicGuideline: 'No guideline available',
                clinicalSignificance: 'Interpretation not possible'
              };

              return (
                <Card key={gene} className="bg-white border p-4" style={{ borderColor: '#C8C8D2' }}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium" style={{ color: '#1E1E1E' }}>{gene} Prediction Rules</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openGeneDetails(gene)}
                        className="hover:bg-[#F5F3FF] cursor-pointer"
                        style={{ color: '#7864B4' }}
                      >
                        <Info className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-sm font-medium" style={{ color: '#1E1E1E' }}>Algorithm Steps:</h5>
                      <ul className="space-y-1">
                        {interp.rules.map((rule, index) => (
                          <li key={index} className="text-sm flex items-start gap-2" style={{ color: '#505050' }}>
                            <span className="mt-0.5" style={{ color: '#7864B4' }}>•</span>
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium" style={{ color: '#1E1E1E' }}>CPIC Guideline:</h5>
                        <p className="text-sm italic" style={{ color: '#505050' }}>{interp.cpicGuideline}</p>
                      </div>
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium" style={{ color: '#1E1E1E' }}>Clinical Significance:</h5>
                        <p className="text-sm" style={{ color: '#505050' }}>{interp.clinicalSignificance}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Enhanced Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border elevation-0" style={{ borderColor: '#C8C8D2' }}>
            <h4 className="text-sm mb-3" style={{ color: '#1E1E1E' }}>Variant Detection</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span style={{ color: '#64B464' }}>✓</span>
                <span className="text-sm" style={{ color: '#505050' }}>Detected</span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ color: '#505050' }}>−</span>
                <span className="text-sm" style={{ color: '#505050' }}>Not detected</span>
              </div>
            </div>
          </Card>

          {/* Confidence Levels and Evidence Levels cards removed */}

          <Card className="p-4 bg-white border elevation-0" style={{ borderColor: '#C8C8D2' }}>
            <h4 className="text-sm mb-3" style={{ color: '#1E1E1E' }}>Interactive Rules</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 cursor-pointer">
                  <ChevronDown className="h-3 w-3" style={{ color: '#1E1E1E' }} />
                </Button>
                <span className="text-sm" style={{ color: '#505050' }}>Click to expand</span>
              </div>
              <div className="flex items-center gap-2">
                <Info className="h-3 w-3" style={{ color: '#7864B4' }} />
                <span className="text-sm" style={{ color: '#505050' }}>View details</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline"
          className="bg-white cursor-pointer hover:bg-[#D9C0FB] hover:border-[#D9C0FB] transition-colors px-6 py-3"
          style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}
          onClick={() => setCurrentStep(2)}
        >
          Back
        </Button>
        <Button 
          className="text-white px-6 py-3 cursor-pointer"
          style={{ backgroundColor: '#7864B4' }}
          onClick={() => setCurrentStep(4)}
        >
          Continue to Phenotype Analysis →
        </Button>
      </div>
    </div>
  );

  // Enhanced phenotype data based on rule-based predictions
  const phenotypeData = {
    overall: {
      primaryGene: 'CYP2C19',
      phenotype: 'Intermediate Metabolizer',
      phenotypeShort: 'IM',
      activityScore: '1.50',
      maxScore: '3.00',
      confidence: 92,
      evidenceLevel: 'A',
      interpretation: 'Reduced metabolism of drugs primarily processed by CYP2C19'
    },
    genePredictions: [
      {
        gene: 'CYP2C19',
        genotype: '*1/*2',
        phenotype: 'Intermediate Metabolizer',
        phenotypeShort: 'IM',
        activityScore: '1.5',
        confidence: 92,
        evidenceLevel: 'A',
        rules: [
          'CYP2C19*1: Normal function (score: 1.0)',
          'CYP2C19*2: No function (score: 0.0)',
          'Total Activity Score: 1.0 + 0.0 = 1.0',
          'Classification: Intermediate Metabolizer (IM)'
        ],
        cpicGuideline: 'CPIC Guideline for CYP2C19 and Clopidogrel Therapy'
      },
      {
        gene: 'CYP2D6',
        genotype: '*1/*4',
        phenotype: 'Intermediate Metabolizer',
        phenotypeShort: 'IM',
        activityScore: '1.0',
        confidence: 88,
        evidenceLevel: 'A',
        rules: [
          'CYP2D6*1: Normal function (score: 1.0)',
          'CYP2D6*4: No function (score: 0.0)',
          'Total Activity Score: 1.0 + 0.0 = 1.0',
          'Classification: Intermediate Metabolizer (IM)'
        ],
        cpicGuideline: 'CPIC Guideline for CYP2D6 and SSRIs'
      },
      {
        gene: 'SLCO1B1',
        genotype: '*1/*5',
        phenotype: 'Normal Function',
        phenotypeShort: 'NM',
        activityScore: '2.0',
        confidence: 95,
        evidenceLevel: 'A',
        rules: [
          'SLCO1B1*1: Normal function',
          'SLCO1B1*5: Decreased function',
          'Combined Effect: Normal transporter activity',
          'Classification: Normal Function (NM)'
        ],
        cpicGuideline: 'CPIC Guideline for SLCO1B1 and Statins'
      }
    ]
  };

  const toggleGeneExpansionPhenotype = (gene: string) => {
    setExpandedGenePhenotype(expandedGenePhenotype === gene ? null : gene);
  };

  const renderPhenotype = () => {

    return (
      <div className="p-6 space-y-6 rounded-[20px] w-full max-w-full box-border" style={{ backgroundColor: '#F5F3FF' }}>
        {/* Main Phenotype Classification Card */}
        <Card className="p-8 bg-white border elevation-1" style={{ borderColor: '#C8C8D2' }}>
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-1" style={{ color: '#1E1E1E' }}>Rule-Based Phenotype Classification</h3>
                <p className="text-sm" style={{ color: '#505050' }}>Algorithm-based interpretation following CPIC/PharmGKB guidelines</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetailedRulesPhenotype(!showDetailedRulesPhenotype)}
                className="bg-white hover:bg-[#F5F3FF] cursor-pointer"
                style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                {showDetailedRulesPhenotype ? 'Hide Rules' : 'Show Rules'}
              </Button>
            </div>

            {/* Overall Phenotype Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="text-center p-6 bg-white rounded-lg border" style={{ borderColor: '#C8C8D2' }}>
                  <Badge className={`mb-3 px-4 py-2 rounded-lg ${
                    phenotypeData.overall.phenotypeShort === 'IM'
                      ? 'bg-secondary/10 text-secondary-foreground-container'
                      : 'bg-muted text-foreground'
                  }`}>
                    {phenotypeData.overall.phenotypeShort}
                  </Badge>
                  <h4 className="text-lg font-medium mb-2" style={{ color: '#1E1E1E' }}>{phenotypeData.overall.phenotype}</h4>
                  <p className="text-sm" style={{ color: '#505050' }}>{phenotypeData.overall.interpretation}</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Space left empty after removing Activity Score, Confidence, and Evidence Level */}
              </div>
            </div>

            {/* Detailed Rules Section */}
            {showDetailedRulesPhenotype && (
              <div className="space-y-6 pt-6 border-t" style={{ borderColor: '#DCDCE6' }}>
                <h4 className="font-medium flex items-center gap-2" style={{ color: '#1E1E1E' }}>
                  <BookOpen className="h-4 w-4" />
                  Gene-Specific Rule-Based Predictions
                </h4>

                <div className="space-y-4">
                  {phenotypeData.genePredictions.map((gene) => (
                    <Card key={gene.gene} className="bg-white border" style={{ borderColor: '#C8C8D2' }}>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <h5 className="font-medium" style={{ color: '#1E1E1E' }}>{gene.gene}</h5>
                            <span className="font-mono text-sm" style={{ color: '#505050' }}>{gene.genotype}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${
                              gene.phenotypeShort === 'IM'
                                ? 'bg-secondary/10 text-secondary-foreground-container'
                                : 'bg-muted text-foreground'
                            }`}>
                              <span className="text-xs font-medium">{gene.phenotypeShort}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleGeneExpansionPhenotype(gene.gene)}
                              className="h-8 w-8 p-0 hover:bg-[#F5F3FF] cursor-pointer"
                            >
                              {expandedGenePhenotype === gene.gene ? (
                                <ChevronUp className="h-4 w-4" style={{ color: '#1E1E1E' }} />
                              ) : (
                                <ChevronDown className="h-4 w-4" style={{ color: '#1E1E1E' }} />
                              )}
                            </Button>
                          </div>
                        </div>

                        {expandedGenePhenotype === gene.gene && (
                          <div className="space-y-4 pt-4 border-t" style={{ borderColor: '#DCDCE6' }}>
                            {/* Rule Steps */}
                            <div className="space-y-2">
                              <h6 className="text-sm font-medium" style={{ color: '#1E1E1E' }}>Algorithm Steps:</h6>
                              <ul className="space-y-1">
                                {gene.rules.map((rule, index) => (
                                  <li key={index} className="text-sm flex items-start gap-2" style={{ color: '#505050' }}>
                                    <span className="mt-0.5" style={{ color: '#7864B4' }}>•</span>
                                    {rule}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Additional Info */}
                            {/* Activity Score and Confidence sections removed */}

                            <div className="pt-2">
                              <p className="text-xs italic" style={{ color: '#505050' }}>
                                {gene.cpicGuideline}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: '#DCDCE6' }}>
              <Button
                variant="outline"
                className="bg-white cursor-pointer hover:bg-[#D9C0FB] hover:border-[#D9C0FB] transition-colors px-6 py-3"
                style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}
                onClick={() => setCurrentStep(3)}
              >
                Back
              </Button>
              <Button
                className="text-white px-6 py-3 cursor-pointer"
                style={{ backgroundColor: '#7864B4' }}
                onClick={() => setCurrentStep(5)}
              >
                Continue to Recommendations →
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const handleValidation = () => {
    // Perform validation checks
    const updatedResults = {
      coverage: {
        ...validationResults.coverage,
        passed: validationResults.coverage.value >= validationResults.coverage.threshold
      },
      alleleBalance: {
        ...validationResults.alleleBalance,
        passed: validationResults.alleleBalance.value >= validationResults.alleleBalance.threshold
      },
      qualityScore: {
        ...validationResults.qualityScore,
        passed: validationResults.qualityScore.value >= validationResults.qualityScore.threshold
      }
    };
    
    setValidationResults(updatedResults);
    setIsValidated(true);
  };

  const renderRecommendations = () => (
    <div className="p-6 space-y-6 rounded-[20px] w-full max-w-full box-border" style={{ backgroundColor: '#F5F3FF' }}>
      {/* Quality Review Section */}
      <Card className="p-6 border elevation-1 bg-white" style={{ borderColor: '#C8C8D2' }}>
        <div className="space-y-6">
          <div>
            <h3 className="mb-1" style={{ color: '#1E1E1E' }}>Quality Review</h3>
            <p className="text-sm" style={{ color: '#505050' }}>Validate sequencing quality metrics before finalizing recommendations</p>
          </div>

          {/* Tester Type */}
          <div className="space-y-2">
            <Label htmlFor="tester-type" style={{ color: '#1E1E1E' }}>Tester Type</Label>
            <Select value={testerType} onValueChange={setTesterType}>
              <SelectTrigger id="tester-type" className="bg-white border" style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border" style={{ borderColor: '#C8C8D2' }}>
                <SelectItem value="Illumina MiSeq" style={{ color: '#1E1E1E' }}>Illumina MiSeq</SelectItem>
                <SelectItem value="Illumina NextSeq" style={{ color: '#1E1E1E' }}>Illumina NextSeq</SelectItem>
                <SelectItem value="Ion Torrent PGM" style={{ color: '#1E1E1E' }}>Ion Torrent PGM</SelectItem>
                <SelectItem value="Oxford Nanopore MinION" style={{ color: '#1E1E1E' }}>Oxford Nanopore MinION</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Validation Metrics */}
          <div className="space-y-4">
            <h4 style={{ color: '#1E1E1E' }}>Validation Criteria</h4>
            
            {/* Coverage */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-white border" style={{ borderColor: '#C8C8D2' }}>
              <div className="flex items-center gap-3">
                {isValidated && (
                  validationResults.coverage.passed ? (
                    <CheckCircle className="h-5 w-5" style={{ color: '#7864B4' }} />
                  ) : (
                    <XCircle className="h-5 w-5" style={{ color: '#DC6464' }} />
                  )
                )}
                {!isValidated && <div className="h-5 w-5 rounded-full border-2" style={{ borderColor: '#C8C8D2' }} />}
                <div>
                  <span style={{ color: '#1E1E1E' }}>Coverage</span>
                  <p className="text-xs" style={{ color: '#505050' }}>≥ {validationResults.coverage.threshold}x required</p>
                </div>
              </div>
              <Badge className={`px-3 py-1 rounded-lg ${isValidated && validationResults.coverage.passed ? 'bg-[#7864B4]/10' : 'bg-white'}`} style={{ color: isValidated && validationResults.coverage.passed ? '#7864B4' : '#1E1E1E' }}>
                {validationResults.coverage.value}x
              </Badge>
            </div>

            {/* Allele Balance */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-white border" style={{ borderColor: '#C8C8D2' }}>
              <div className="flex items-center gap-3">
                {isValidated && (
                  validationResults.alleleBalance.passed ? (
                    <CheckCircle className="h-5 w-5" style={{ color: '#7864B4' }} />
                  ) : (
                    <XCircle className="h-5 w-5" style={{ color: '#DC6464' }} />
                  )
                )}
                {!isValidated && <div className="h-5 w-5 rounded-full border-2" style={{ borderColor: '#C8C8D2' }} />}
                <div>
                  <span style={{ color: '#1E1E1E' }}>Allele Balance</span>
                  <p className="text-xs" style={{ color: '#505050' }}>≥ {validationResults.alleleBalance.threshold}% required</p>
                </div>
              </div>
              <Badge className={`px-3 py-1 rounded-lg ${isValidated && validationResults.alleleBalance.passed ? 'bg-[#7864B4]/10' : 'bg-white'}`} style={{ color: isValidated && validationResults.alleleBalance.passed ? '#7864B4' : '#1E1E1E' }}>
                {validationResults.alleleBalance.value}%
              </Badge>
            </div>

            {/* Quality Score */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-white border" style={{ borderColor: '#C8C8D2' }}>
              <div className="flex items-center gap-3">
                {isValidated && (
                  validationResults.qualityScore.passed ? (
                    <CheckCircle className="h-5 w-5" style={{ color: '#7864B4' }} />
                  ) : (
                    <XCircle className="h-5 w-5" style={{ color: '#DC6464' }} />
                  )
                )}
                {!isValidated && <div className="h-5 w-5 rounded-full border-2" style={{ borderColor: '#C8C8D2' }} />}
                <div>
                  <span style={{ color: '#1E1E1E' }}>Quality Score</span>
                  <p className="text-xs" style={{ color: '#505050' }}>≥ {validationResults.qualityScore.threshold} required</p>
                </div>
              </div>
              <Badge className={`px-3 py-1 rounded-lg ${isValidated && validationResults.qualityScore.passed ? 'bg-[#7864B4]/10' : 'bg-white'}`} style={{ color: isValidated && validationResults.qualityScore.passed ? '#7864B4' : '#1E1E1E' }}>
                {validationResults.qualityScore.value}
              </Badge>
            </div>
          </div>

          {/* Validate Button */}
          <Button 
            className="w-full text-white cursor-pointer"
            style={{ backgroundColor: '#7864B4' }}
            onClick={handleValidation}
            disabled={isValidated}
          >
            {isValidated ? 'Validated' : 'Validate Quality Metrics'}
          </Button>

          {/* Validation Result Message */}
          {isValidated && (
            <div className={`p-4 rounded-lg border ${
              Object.values(validationResults).every(r => r.passed)
                ? 'bg-[#7864B4]/10'
                : 'bg-[#DC6464]/10'
            }`} style={{ borderColor: Object.values(validationResults).every(r => r.passed) ? '#7864B4' : '#DC6464' }}>
              <div className="flex items-start gap-3">
                {Object.values(validationResults).every(r => r.passed) ? (
                  <CheckCircle className="h-5 w-5 mt-0.5" style={{ color: '#7864B4' }} />
                ) : (
                  <AlertCircle className="h-5 w-5 mt-0.5" style={{ color: '#DC6464' }} />
                )}
                <div>
                  <p className="font-medium" style={{ color: Object.values(validationResults).every(r => r.passed) ? '#7864B4' : '#DC6464' }}>
                    {Object.values(validationResults).every(r => r.passed) 
                      ? 'All Quality Checks Passed' 
                      : 'Quality Validation Failed'}
                  </p>
                  <p className="text-sm mt-1" style={{ color: Object.values(validationResults).every(r => r.passed) ? '#505050' : '#505050' }}>
                    {Object.values(validationResults).every(r => r.passed)
                      ? 'Sample meets all quality criteria and is ready for approval.'
                      : 'One or more quality metrics failed. Review and reprocess if necessary.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Drug Recommendations Section */}
      <Card className="p-6 border elevation-1 bg-white" style={{ borderColor: '#C8C8D2' }}>
        <div className="space-y-4">
          <div>
            <h3 className="mb-1" style={{ color: '#1E1E1E' }}>Drug Recommendations</h3>
            <p className="text-sm" style={{ color: '#505050' }}>Clinical pharmacogenomic recommendations based on genotype analysis</p>
          </div>
          
          {/* Drug Cards */}
          <div className="space-y-3">
            {/* Clopidogrel */}
            <div className="p-4 rounded-lg bg-white border" style={{ borderColor: '#C8C8D2' }}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h4 className="mb-1" style={{ color: '#1E1E1E' }}>Clopidogrel</h4>
                  <p className="text-sm" style={{ color: '#505050' }}>
                    Use alternative antiplatelet such as prasugrel due to reduced activation.
                  </p>
                </div>
                <Badge className="bg-white px-3 py-1.5 rounded-full shrink-0" style={{ color: '#1E1E1E', borderColor: '#C8C8D2' }}>
                  Alternative
                </Badge>
              </div>
            </div>

            {/* Voriconazole */}
            <div className="p-4 rounded-lg bg-white border" style={{ borderColor: '#C8C8D2' }}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h4 className="mb-1" style={{ color: '#1E1E1E' }}>Voriconazole</h4>
                  <p className="text-sm" style={{ color: '#505050' }}>
                    Consider dose reduction and monitor levels closely.
                  </p>
                </div>
                <Badge className="bg-secondary/10 text-secondary-foreground-container px-3 py-1.5 rounded-full shrink-0">
                  Adjust Dose
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline"
          className="bg-white cursor-pointer hover:bg-[#D9C0FB] hover:border-[#D9C0FB] transition-colors"
          style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}
          onClick={() => setCurrentStep(4)}
        >
          Back
        </Button>
        <Button 
          className="text-white cursor-pointer"
          style={{ backgroundColor: '#7864B4' }}
          onClick={() => setCurrentStep(6)}
          disabled={!isValidated || !Object.values(validationResults).every(r => r.passed)}
        >
          Continue to Approval
        </Button>
      </div>
    </div>
  );

  const renderApproval = () => (
    <div className="p-6 space-y-8 rounded-[20px] w-full max-w-full box-border" style={{ backgroundColor: '#F5F3FF' }}>
      {/* Quality Review Section */}
      <div>
        <h3 className="font-medium mb-6" style={{ color: '#1E1E1E' }}>Quality Review</h3>
        
        {/* Quality Checklist */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#7864B4' }}></div>
            <span style={{ color: '#1E1E1E' }}>Coverage ≥ 100x</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#7864B4' }}></div>
            <span style={{ color: '#1E1E1E' }}>Allele balance between 0.35 and 0.65</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#7864B4' }}></div>
            <span style={{ color: '#1E1E1E' }}>Quality Score ≥ 95</span>
          </div>
        </div>

        <Button 
          className="text-white mb-6 cursor-pointer"
          style={{ backgroundColor: '#7864B4' }}
        >
          Validate
        </Button>
      </div>

      <Separator style={{ backgroundColor: '#DCDCE6' }} />

      {/* Approval Section */}
      <div>
        <h3 className="font-medium mb-2" style={{ color: '#1E1E1E' }}>Approval</h3>
        <p className="mb-6" style={{ color: '#505050' }}>Review and approve this interpretation.</p>
        
        <div className="flex items-center justify-between">
          <Button 
            variant="outline"
            className="bg-white cursor-pointer hover:bg-[#D9C0FB] hover:border-[#D9C0FB] transition-colors"
            style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}
            onClick={() => setCurrentStep(5)}
          >
            Back
          </Button>
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              className="bg-white hover:bg-[#D9C0FB] hover:border-[#D9C0FB] transition-colors cursor-pointer"
              style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}
            >
              Request Review
            </Button>
            
            <Button 
              className="text-white cursor-pointer"
              style={{ backgroundColor: '#7864B4' }}
              onClick={() => setCurrentStep(7)}
            >
              Approve & Continue to Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExportPDF = () => (
    <div className="p-6 space-y-6 rounded-[20px] w-full max-w-full box-border" style={{ backgroundColor: '#F5F3FF' }}>
      <div>
        <h3 className="font-medium mb-6" style={{ color: '#1E1E1E' }}>Export PDF Report</h3>
        
        {/* Report Summary */}
        <div className="bg-white border p-4 rounded-lg mb-6" style={{ borderColor: '#C8C8D2' }}>
          <h4 className="font-medium mb-4" style={{ color: '#1E1E1E' }}>Report Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p style={{ color: '#505050' }}>Patient:</p>
              <p style={{ color: '#1E1E1E' }}>{selectedPatientData?.patient || 'N/A'}</p>
            </div>
            <div>
              <p style={{ color: '#505050' }}>Report Number:</p>
              <p style={{ color: '#1E1E1E' }}>{selectedPatientData?.reportNumber || 'N/A'}</p>
            </div>
            <div>
              <p style={{ color: '#505050' }}>Test Type:</p>
              <p style={{ color: '#1E1E1E' }}>{selectedPatientData?.testType || 'N/A'}</p>
            </div>
            <div>
              <p style={{ color: '#505050' }}>Status:</p>
              <p style={{ color: '#1E1E1E' }}>Ready for Export</p>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-4">
          <h4 className="font-medium" style={{ color: '#1E1E1E' }}>Export Options</h4>
          
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded cursor-pointer" style={{ accentColor: '#7864B4' }} />
              <span style={{ color: '#1E1E1E' }}>Include patient demographics</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded cursor-pointer" style={{ accentColor: '#7864B4' }} />
              <span style={{ color: '#1E1E1E' }}>Include raw data summary</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded cursor-pointer" style={{ accentColor: '#7864B4' }} />
              <span style={{ color: '#1E1E1E' }}>Include genotype results</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded cursor-pointer" style={{ accentColor: '#7864B4' }} />
              <span style={{ color: '#1E1E1E' }}>Include phenotype classification</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded cursor-pointer" style={{ accentColor: '#7864B4' }} />
              <span style={{ color: '#1E1E1E' }}>Include drug recommendations</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded cursor-pointer" style={{ accentColor: '#7864B4' }} />
              <span style={{ color: '#1E1E1E' }}>Include quality metrics</span>
            </label>
          </div>
        </div>

        {/* Export Actions */}
        <div className="flex items-center justify-between pt-4">
          <Button 
            variant="outline"
            className="bg-white cursor-pointer hover:bg-[#D9C0FB] hover:border-[#D9C0FB] transition-colors"
            style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}
            onClick={() => setCurrentStep(6)}
          >
            Back
          </Button>
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              className="bg-white hover:bg-[#D9C0FB] hover:border-[#D9C0FB] transition-colors cursor-pointer"
              style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}
            >
              Preview Report
            </Button>
            
            <Button 
              className="text-white cursor-pointer"
              style={{ backgroundColor: '#7864B4' }}
            >
              Download PDF
            </Button>
            
            <Button 
              variant="outline"
              className="bg-white hover:bg-[#D9C0FB] hover:border-[#D9C0FB] transition-colors cursor-pointer"
              style={{ borderColor: '#7864B4', color: '#7864B4' }}
            >
              Email Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPatientPreview = () => {
    if (!selectedPatientData) return null;

    const calculateAge = (dateOfBirth: string) => {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    return (
      <Card className="elevation-1 bg-white border" style={{ borderColor: '#DCDCE6' }}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="" alt={selectedPatientData.patient} />
                <AvatarFallback className="text-white" style={{ backgroundColor: '#7864B4' }}>
                  {selectedPatientData.patient.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium" style={{ color: '#1E1E1E' }}>{selectedPatientData.patient}</h3>
                <p className="text-sm" style={{ color: '#505050' }}>
                  {selectedPatientData.gender} • {calculateAge(selectedPatientData.dateOfBirth)} years old
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {getStatusBadge(selectedPatientData.status)}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 cursor-pointer"
                style={{ color: '#1E1E1E' }}
                onClick={() => {
                  setSelectedReport(null);
                  setSelectedPatientData(null);
                  setCurrentStep(1);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Patient Info */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm">
                <FileText className="h-4 w-4" style={{ color: '#505050' }} />
                <span style={{ color: '#505050' }}>Report</span>
              </div>
              <p className="text-sm font-medium" style={{ color: '#1E1E1E' }}>{selectedPatientData.reportNumber}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4" style={{ color: '#505050' }} />
                <span style={{ color: '#505050' }}>MRN</span>
              </div>
              <p className="text-sm font-medium" style={{ color: '#1E1E1E' }}>{selectedPatientData.mrn}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4" style={{ color: '#505050' }} />
                <span style={{ color: '#505050' }}>DOB</span>
              </div>
              <p className="text-sm font-medium" style={{ color: '#1E1E1E' }}>{formatDate(selectedPatientData.dateOfBirth)}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4" style={{ color: '#505050' }} />
                <span style={{ color: '#505050' }}>Physician</span>
              </div>
              <p className="text-sm font-medium" style={{ color: '#1E1E1E' }}>{selectedPatientData.orderingPhysician}</p>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return renderPatientReports();
      case 2:
        return renderRawData();
      case 3:
        return renderGenotype();
      case 4:
        return renderPhenotype();
      case 5:
        return renderRecommendations();
      case 6:
        return renderApproval();
      case 7:
        return renderExportPDF();
      default:
        return renderPatientReports();
    }
  };

  const renderStepNavigation = () => {
    const activeSteps = getActiveSteps();
    
    return (
      <div className="flex items-center justify-start space-x-3 py-4 pl-6 pr-6 border-b" style={{ backgroundColor: '#F5F3FF', borderColor: '#DCDCE6' }}>
        {activeSteps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div 
              className={`
                flex flex-col items-center justify-center transition-colors duration-200
                ${canNavigateToStep(step.number) ? 'cursor-pointer' : 'cursor-not-allowed'}
              `}
              onClick={() => handleStepClick(step.number)}
            >
              <div 
                className="flex items-center justify-center w-7 h-7 rounded-full border-2 mb-1"
                style={
                  step.active && canNavigateToStep(step.number)
                    ? { backgroundColor: '#7864B4', borderColor: '#7864B4', color: '#FFFFFF' }
                    : { backgroundColor: '#FFFFFF', borderColor: '#C8C8D2', color: '#7864B4' }
                }
              >
                <span className="text-xs font-medium">{step.number}</span>
              </div>
              
              <p 
                className="text-xs font-medium whitespace-nowrap"
                style={{ color: step.active && canNavigateToStep(step.number) ? '#7864B4' : '#1E1E1E' }}
              >
                {step.label}
              </p>
            </div>
            
            {index < activeSteps.length - 1 && (
              <div className="w-6 h-px mx-2" style={{ backgroundColor: '#C8C8D2' }}></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const handleApprovalSubmit = () => {
    // Handle approval submission logic here
    console.log("Approval submitted:", {
      reportData: approvalReportData,
      reviewerName,
      comments
    });

    setIsApprovalDialogOpen(false);
    setReviewerName("");
    setComments("");
  };

  // Gene detail information for the detailed view dialog
  const getGeneDetailData = (gene: string) => {
    const geneDetails = {
      'CYP2C19': {
        name: 'Cytochrome P450 2C19',
        function: 'Drug metabolism enzyme for proton pump inhibitors, antiplatelet agents, and antidepressants',
        variants: [
          { name: '*1 (wild type)', function: 'Normal', frequency: 'Common' },
          { name: '*2 (681G>A)', function: 'No function', frequency: '15% (Asian), 12% (Caucasian)' },
          { name: '*17 (-806C>T)', function: 'Increased', frequency: '20% (Caucasian), 1% (Asian)' }
        ],
        clinicalRelevance: 'Affects clopidogrel activation, PPI efficacy, and antidepressant metabolism',
        guidelineReferences: ['CPIC Guideline for CYP2C19 and Clopidogrel Therapy (2022)', 'CPIC Guideline for CYP2C19 and Selective Serotonin Reuptake Inhibitors (2021)']
      },
      'CYP2D6': {
        name: 'Cytochrome P450 2D6',
        function: 'Drug metabolism enzyme for antidepressants, antipsychotics, beta-blockers, and opioids',
        variants: [
          { name: '*1 (wild type)', function: 'Normal', frequency: 'Common' },
          { name: '*4 (1846G>A)', function: 'No function', frequency: '20% (Caucasian), 1% (Asian)' },
          { name: '*10 (100C>T)', function: 'Decreased', frequency: '50% (Asian), 2% (Caucasian)' },
          { name: '*5 (gene deletion)', function: 'No function', frequency: 'Variable' }
        ],
        clinicalRelevance: 'Affects metabolism of ~25% of commonly prescribed drugs',
        guidelineReferences: ['CPIC Guideline for CYP2D6 and Codeine Therapy (2020)', 'CPIC Guideline for CYP2D6 and SSRIs (2021)']
      },
      'SLCO1B1': {
        name: 'Solute Carrier Organic Anion Transporter Family Member 1B1',
        function: 'Hepatic uptake transporter for statins and other drugs',
        variants: [
          { name: '*1 (wild type)', function: 'Normal', frequency: 'Common' },
          { name: '*5 (521T>C)', function: 'Decreased', frequency: '15% (Caucasian), 2% (Asian)' },
          { name: '*15 (combination)', function: 'Decreased', frequency: 'Variable' }
        ],
        clinicalRelevance: 'Affects statin-induced myopathy risk and cholesterol-lowering efficacy',
        guidelineReferences: ['CPIC Guideline for SLCO1B1 and Simvastatin Therapy (2022)', 'DPWG Guideline for SLCO1B1 and Statins (2021)']
      }
    };

    return geneDetails[gene as keyof typeof geneDetails] || {
      name: 'Unknown Gene',
      function: 'No information available',
      variants: [],
      clinicalRelevance: 'No information available',
      guidelineReferences: []
    };
  };

  return (
    <div className="h-full w-full overflow-x-hidden" style={{ backgroundColor: '#F5F3FF' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b" style={{ backgroundColor: '#F5F3FF', borderColor: '#DCDCE6' }}>
        <div>
          <h1 style={{ color: '#1E1E1E' }}>Result Interpretation</h1>
          <p style={{ color: '#505050' }}>Review and interpret genetic test results</p>
        </div>
      </div>

      {/* Step Navigation */}
      {renderStepNavigation()}

      {/* Patient Preview (when report is selected) */}
      {selectedPatientData && (
        <div className="p-6 border-b" style={{ backgroundColor: '#F5F3FF', borderColor: '#DCDCE6' }}>
          {renderPatientPreview()}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 w-full max-w-full" style={{ backgroundColor: '#F5F3FF' }}>
        {renderContent()}
      </div>

      {/* Approval Dialog */}
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto elevation-3 bg-white border rounded-2xl" style={{ borderColor: '#DCDCE6' }}>
          <DialogHeader className="space-y-3 pb-4 border-b" style={{ borderColor: '#DCDCE6' }}>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold" style={{ color: '#1E1E1E' }}>Report Approval</DialogTitle>
              <button 
                onClick={() => setIsApprovalDialogOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <DialogDescription className="text-sm" style={{ color: '#505050' }}>
              Review and approve the clinical report
            </DialogDescription>
          </DialogHeader>

          {approvalReportData && (
            <div className="space-y-6 py-4">
              {/* Report Header Card */}
              <Card className="p-4 border" style={{ backgroundColor: '#F5F3FF', borderColor: '#DCDCE6' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#EDE9FE' }}>
                      <FileText className="h-5 w-5" style={{ color: '#7864B4' }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#505050' }}>Report Number</p>
                      <p className="font-semibold" style={{ color: '#1E1E1E' }}>{approvalReportData.reportNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" style={{ color: '#505050' }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#505050' }}>Patient</p>
                        <p className="font-semibold" style={{ color: '#1E1E1E' }}>{approvalReportData.patient}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: '#505050' }}>Status</p>
                    <Badge className="text-white" style={{ backgroundColor: '#7864B4' }}>
                      {approvalReportData.status}
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Report Details Section */}
              <div>
                <h3 className="font-semibold mb-4" style={{ color: '#1E1E1E' }}>Report Details</h3>
                <div className="border rounded-xl overflow-hidden" style={{ borderColor: '#DCDCE6' }}>
                  <table className="w-full">
                    <thead style={{ backgroundColor: '#F5F3FF' }}>
                      <tr className="border-b" style={{ borderColor: '#DCDCE6' }}>
                        <th className="text-left p-4 text-sm font-medium" style={{ color: '#505050' }}>Test Type</th>
                        <th className="text-left p-4 text-sm font-medium" style={{ color: '#505050' }}>Result</th>
                        <th className="text-left p-4 text-sm font-medium" style={{ color: '#505050' }}>Reference Range</th>
                        <th className="text-left p-4 text-sm font-medium" style={{ color: '#505050' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {approvalTestResults.map((result, index) => (
                        <tr key={index} className="border-b" style={{ borderColor: '#DCDCE6' }}>
                          <td className="p-4">
                            <p className="font-medium" style={{ color: '#1E1E1E' }}>{result.testType.split(' ')[0]}</p>
                            <p className="text-sm" style={{ color: '#505050' }}>Genotyping</p>
                          </td>
                          <td className="p-4">
                            {result.result.split(', ').map((r, i) => (
                              <div key={i} className="text-sm" style={{ color: '#1E1E1E' }}>{r}</div>
                            ))}
                          </td>
                          <td className="p-4">
                            {result.referenceRange.split(', ').map((r, i) => (
                              <div key={i} className="text-sm" style={{ color: '#505050' }}>{r}</div>
                            ))}
                          </td>
                          <td className="p-4">
                            <Badge 
                              className="text-white font-medium"
                              style={{ 
                                backgroundColor: result.status.includes('Intermediate') ? '#9682C8' : '#7864B4'
                              }}
                            >
                              {result.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Approval Details Section */}
              <div>
                <h3 className="font-semibold mb-4" style={{ color: '#1E1E1E' }}>Approval Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#505050' }}>
                      Reviewer Name
                    </label>
                    <Input
                      placeholder="Enter reviewer name"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="bg-white"
                      style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#505050' }}>
                      Comments (Optional)
                    </label>
                    <textarea
                      placeholder="Add any additional comments..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 rounded-lg border resize-none bg-white"
                      style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: '#DCDCE6' }}>
                <Button
                  variant="outline"
                  onClick={() => setIsApprovalDialogOpen(false)}
                  className="bg-white hover:bg-[#D9C0FB] hover:border-[#D9C0FB] transition-colors cursor-pointer"
                  style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApprovalSubmit}
                  className="text-white cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#7864B4' }}
                >
                  Approve Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Gene Details Dialog */}
      <Dialog open={showRuleDetails} onOpenChange={setShowRuleDetails}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto elevation-3 bg-white border" style={{ borderColor: '#C8C8D2' }}>
          <DialogHeader className="space-y-3">
            <DialogTitle className="flex items-center gap-2" style={{ color: '#1E1E1E' }}>
              <BookOpen className="h-5 w-5" />
              Gene Details: {selectedGene}
            </DialogTitle>
            <DialogDescription style={{ color: '#505050' }}>
              Comprehensive information about the gene and its clinical significance
            </DialogDescription>
          </DialogHeader>

          {selectedGene && (
            <div className="space-y-6 py-4">
              {(() => {
                const geneData = getGeneDetailData(selectedGene);
                return (
                  <>
                    {/* Gene Overview */}
                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-lg border" style={{ borderColor: '#C8C8D2' }}>
                        <h3 className="text-lg font-medium mb-2" style={{ color: '#1E1E1E' }}>{geneData.name}</h3>
                        <p className="text-sm leading-relaxed" style={{ color: '#505050' }}>{geneData.function}</p>
                      </div>
                    </div>

                    {/* Clinical Relevance */}
                    <div className="space-y-3">
                      <h4 className="font-medium" style={{ color: '#1E1E1E' }}>Clinical Relevance</h4>
                      <div className="p-4 bg-white rounded-lg border" style={{ borderColor: '#C8C8D2' }}>
                        <p className="text-sm leading-relaxed" style={{ color: '#505050' }}>{geneData.clinicalRelevance}</p>
                      </div>
                    </div>

                    {/* Gene Variants Table */}
                    <div className="space-y-3">
                      <h4 className="font-medium" style={{ color: '#1E1E1E' }}>Common Variants</h4>
                      <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#C8C8D2' }}>
                        <table className="w-full">
                          <thead style={{ backgroundColor: '#E6E6F0' }}>
                            <tr>
                              <th className="text-left p-3 font-medium" style={{ color: '#1E1E1E' }}>Variant</th>
                              <th className="text-left p-3 font-medium" style={{ color: '#1E1E1E' }}>Function</th>
                              <th className="text-left p-3 font-medium" style={{ color: '#1E1E1E' }}>Frequency</th>
                            </tr>
                          </thead>
                          <tbody>
                            {geneData.variants.map((variant, index) => (
                              <tr key={index} className="border-t bg-white" style={{ borderColor: '#DCDCE6' }}>
                                <td className="p-3 font-mono text-sm" style={{ color: '#1E1E1E' }}>{variant.name}</td>
                                <td className="p-3" style={{ color: '#505050' }}>{variant.function}</td>
                                <td className="p-3 text-sm" style={{ color: '#505050' }}>{variant.frequency}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Guideline References */}
                    <div className="space-y-3">
                      <h4 className="font-medium" style={{ color: '#1E1E1E' }}>Clinical Guidelines</h4>
                      <div className="space-y-2">
                        {geneData.guidelineReferences.map((reference, index) => (
                          <div key={index} className="p-3 bg-white rounded-lg border" style={{ borderColor: '#C8C8D2' }}>
                            <p className="text-sm" style={{ color: '#505050' }}>{reference}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t" style={{ borderColor: '#DCDCE6' }}>
                      <Button
                        variant="outline"
                        onClick={() => setShowRuleDetails(false)}
                        className="bg-white hover:bg-[#F5F3FF] cursor-pointer"
                        style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}
                      >
                        Close
                      </Button>
                      <Button
                        className="text-white cursor-pointer"
                        style={{ backgroundColor: '#7864B4' }}
                        onClick={() => {
                          // Navigate to external CPIC guideline
                          console.log(`Navigate to CPIC guideline for ${selectedGene}`);
                        }}
                      >
                        View CPIC Guidelines
                      </Button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Page() {
  return <ResultInterpretation />;
}