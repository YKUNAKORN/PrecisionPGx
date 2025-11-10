"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Search, Edit, CheckCircle, AlertCircle, XCircle, User, Calendar, MapPin, Phone, FileText, X, ChevronDown, ChevronUp, Info, TrendingUp, Shield, BookOpen } from "lucide-react";

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

import { createReportQueryOptions, mutateReportQueryOptions } from "@/lib/fetch/Report";
import { createPatientQueryOptions } from "@/lib/fetch/Patient";
import { createRuleQueryOptions } from "@/lib/fetch/Rule";
import { createQualityQueryOptions } from "@/lib/fetch/Quality";
import { Report, Patient } from "@/lib/fetch/type";
import { RuleBased } from "@/lib/fetch/model/Rule";
import { ReportUpdate } from "@/lib/fetch/model/Report";

import { CreateClientPublic } from "@/lib/supabase/client";
import { isPharmacy } from "@/lib/auth/permission";
import { set } from "date-fns";
import { report } from "process";

type ReportWithPatient = Report & {
  patient?: Patient;
};

const stepLabels = [
  { number: 1, label: "Patient", active: true },
  { number: 2, label: "Genotype", active: false },
  { number: 3, label: "Phenotype", active: false },
  { number: 4, label: "Quality", active: false },
  { number: 5, label: "Confirmation", active: false },
  { number: 6, label: "Export PDF", active: false }
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

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userPosition, setUserPosition] = useState<string | null>(null);
  const [isPharmacyUser, setIsPharmacyUser] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());
  const [selectedGene, setSelectedGene] = useState<string | null>(null);
  const [showRuleDetails, setShowRuleDetails] = useState(false);

  const [expandedGenePhenotype, setExpandedGenePhenotype] = useState<string | null>(null);
  const [showDetailedRulesPhenotype, setShowDetailedRulesPhenotype] = useState(false);

  const [testerType, setTesterType] = useState("7787dd4c-f61b-48a1-845f-da1ea4807391"); // Default to TPMT
  const [selectedValidationCriteria, setSelectedValidationCriteria] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [qualityId, setQualityId] = useState<string | null>(null);

  const updateReportMutation = useMutation({
    ...mutateReportQueryOptions.put(),
    onSuccess: () => {
      setValidationSuccess(true);
      qc.invalidateQueries({ queryKey: ['reports'] });
      if (selectedPatientData?.id) {
        qc.invalidateQueries({ queryKey: ['report', selectedPatientData.id] });
      }
    },
  });

  const finishReportMutation = useMutation({
    ...mutateReportQueryOptions.finish(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reports'] });
      if (selectedPatientData?.id) {
        qc.invalidateQueries({ queryKey: ['report', selectedPatientData.id] });
      }
    },
  });

  const [isValidated, setIsValidated] = useState(false);
  const [validationResults, setValidationResults] = useState({
    Pass: { value: 150, threshold: 100, passed: false },
    Warning: { value: 48, threshold: 40, passed: false },
    Failed: { value: 92, threshold: 90, passed: false }
  });

  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [selectedRuleRowIndex, setSelectedRuleRowIndex] = useState<number | null>(null);

  const [selectedGenotypeData, setSelectedGenotypeData] = useState<{
    ruleBasedName: string;
    alleleName: string;
    resultLocation: string;
    predictedGenotype: string;
    predictedPhenotype: string;
    recommendation: string;
  } | null>(null);

  const qc = useQueryClient();

  const {
    data: reports,
    isLoading: loadingReports,
    error: errorReports,
  } = useQuery(createReportQueryOptions.all());

  const {
    data: patients,
    isLoading: loadingPatients,
    error: errorPatients,
  } = useQuery(createPatientQueryOptions.all());

  const {
    data: rules,
    isLoading: loadingRules,
    error: errorRules,
  } = useQuery(createRuleQueryOptions.all());

  console.log("Rules Query State:", { rules, loadingRules, errorRules });

  const {
    data: selectedRuleData,
    isLoading: loadingRuleDetail,
  } = useQuery({
    ...createRuleQueryOptions.detail(selectedRuleId || ""),
    enabled: !!selectedRuleId,
  });

  console.log("Selected Rule State:", { selectedRuleId, selectedRuleData, loadingRuleDetail });



  // Fetch User and Role check
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoadingUser(true);
        const supabase = CreateClientPublic();

        // check session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          console.warn("No active session:", sessionError?.message || "User not logged in");
          setIsLoadingUser(false);
          setIsPharmacyUser(false);
          return;
        }

        // fectch authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          console.warn("Error fetching user:", authError?.message);
          setIsLoadingUser(false);
          setIsPharmacyUser(false);
          return;
        }

        // fetch user profile from table user
        const { data: userProfile, error: profileError } = await supabase
          .from('user')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.warn("Error fetching user profile:", profileError.message);
          setIsLoadingUser(false);
          setIsPharmacyUser(false);
          return;
        }

        setCurrentUser(userProfile);
        setUserPosition(userProfile?.position || null);

        // pharmacy role check
        if (userProfile?.position) {
          setIsPharmacyUser(isPharmacy(userProfile.position));
        } else {
          setIsPharmacyUser(false);
        }

        setIsLoadingUser(false);
      } catch (error) {
        console.error("Error in fetchUserData:", error);
        setIsLoadingUser(false);
        setIsPharmacyUser(false);
      }
    };

    fetchUserData();
  }, []);

  const reportsWithPatients: ReportWithPatient[] = useMemo(() => {
    const reportsRaw = reports as any;
    const patientsRaw = patients as any;

    const reportsArray = Array.isArray(reportsRaw) ? reportsRaw : reportsRaw?.data || [];
    const patientsArray = Array.isArray(patientsRaw) ? patientsRaw : patientsRaw?.data || [];

    return reportsArray.map((report: Report) => {
      const patient = patientsArray.find((p: Patient) => p.id === report.patient_id);
      return {
        ...report,
        patient,
      };
    });
  }, [reports, patients]);

  const filteredReports = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return reportsWithPatients;

    return reportsWithPatients.filter((report) => {
      const reportId = report.id?.toLowerCase() || "";
      const patientName = report.patient?.Eng_name?.toLowerCase() || report.patient?.name?.toLowerCase() || "";
      const status = report.status?.toLowerCase() || "";

      return reportId.includes(query) || patientName.includes(query) || status.includes(query);
    });
  }, [reportsWithPatients, searchQuery]);

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

    // Can only go to step 2 (Genotype) if a report is selected
    if (stepNumber === 2) return selectedReport !== null;

    // For steps 3-6, can navigate if we've reached that step before
    if (stepNumber >= 3 && stepNumber <= 6) {
      return selectedReport !== null && currentStep >= stepNumber - 1;
    }

    return false;
  };

  const handleStepClick = (stepNumber: number) => {
    if (canNavigateToStep(stepNumber)) {
      setCurrentStep(stepNumber);
    }
  };

  const {
    data: qualityData,
    isLoading: loadingQuality,
  } = useQuery({
    ...createQualityQueryOptions.detail(selectedPatientData?.quality_id || ""),
    enabled: !!selectedPatientData?.quality_id,
  });


  useEffect(() => {
    if (qualityData) {
      // qualityData อาจจะมาในรูปแบบ { data: { ... } } หรือ { data: [{...}] }
      const rawData = (qualityData as any)?.data ?? qualityData;
      const record = Array.isArray(rawData) ? rawData[0] : rawData;

      if (record) {
        
        // --- ⬇️ (FIXED) 3.1 ตั้งค่า Validation Criteria ---
        if (record.quality && typeof record.quality === 'string') {

          // 1. สร้างตัวแปลค่าจาก DB -> UI
          // (เราใช้ toLowerCase() เพื่อให้เทียบได้ง่าย)
          const dbToUiMap: { [key: string]: string } = {
            'pass': 'Pass',
            'coverage': 'Pass',       // ค่าเก่า
            'warning': 'Warning',
            'allelebalance': 'Warning', // ค่าเก่า (จาก "Allele Balance")
            'failed': 'Failed',
            'qualityscore': 'Failed'  // ค่าเก่า (จาก "Quality Score")
          };

          // 2. ดึงค่าจาก DB (ใช้ค่าแรกที่เจอ ถ้ามีหลายค่า)
          const dbValue = record.quality.split(',')[0].trim().toLowerCase();

          // 3. แปลงค่า
          const uiValue = dbToUiMap[dbValue];

          // 4. ตั้งค่า state ด้วยค่าที่ถูกต้องสำหรับ UI
          if (uiValue) {
            setSelectedValidationCriteria([uiValue]);
          } else {
            // ถ้าไม่ตรงเลย ก็ให้เป็นค่าว่าง
            setSelectedValidationCriteria([]);
          }
        }
        
        // --- ⬆️ (FIXED) จบส่วนแก้ไข ---

        // 3.2 ตั้งค่า Tester Type (Dropdown ใน Step 4)
        if (record.tester_id) {
          setTesterType(record.tester_id);
        }
      }
    }
  }, [qualityData]);

  useEffect(() => {
    // ถ้าข้อมูล rule โหลดเสร็จ และมี index แถวที่ถูกเลือกไว้
    if (selectedRuleData && selectedRuleRowIndex !== null && selectedRuleRowIndex !== undefined) {
      
      // ดึงข้อมูลจาก selectedRuleData โดยใช้ selectedRuleRowIndex
      const locations = selectedRuleData.location || [];
      const resultLocations = selectedRuleData.result_location || [];
      const predictedGenotypes = selectedRuleData.predicted_genotype || [];
      const predictedPhenotypes = selectedRuleData.predicted_phenotype || [];
      const recommendations = selectedRuleData.recommend || [];
      const names = selectedRuleData.Name || [];

      const ruleBasedName = Array.isArray(names) ? names.join('') : (names || 'Unknown');
      const alleleName = locations[0] || '−';
      
      const index = selectedRuleRowIndex;
      const resultLocation = resultLocations[index] || '−';
      const predictedGenotype = predictedGenotypes[index] || '−';
      const predictedPhenotype = predictedPhenotypes[index] || '−';
      const recommendation = recommendations[index] || '−';

      // 5.1 ตั้งค่า state (selectedGenotypeData) ที่ Step 3 ต้องใช้
      setSelectedGenotypeData({
        ruleBasedName: ruleBasedName,
        alleleName: alleleName,
        resultLocation: resultLocation,
        predictedGenotype: predictedGenotype,
        predictedPhenotype: predictedPhenotype,
        recommendation: recommendation
      });
    }
  }, [selectedRuleData, selectedRuleRowIndex]);

  const handleSelectReport = (report: ReportWithPatient) => {

    // --- 1. รีเซ็ตค่าเก่า (สำคัญมาก) ---
    setSelectedValidationCriteria([]); // ล้างค่าเก่า
    setTesterType("7787dd4c-f61b-48a1-845f-da1ea4807391"); // กลับไปเป็นค่าเริ่มต้น
    setValidationSuccess(false); // รีเซ็ตสถานะ
    setIsApproved(false); // รีเซ็ตสถานะ
    setSelectedGenotypeData(null); // ⭐️ (แนะนำ) ล้างข้อมูล Genotype เก่าด้วย

    // --- 2. ตั้งค่าพื้นฐาน ---
    setSelectedReport(report.id || null);
    setSelectedPatientData(report); // 👈 นี่จะไปกระตุ้น useQuery ของ Quality

    // --- 3. ตั้งค่าสำหรับ Step 2 (Genotype) ---
    setSelectedRuleId(report.rule_id || null); // 👈 นี่จะไปกระตุ้น useQuery ของ Rule
    const ruleIndex = report.index_rule;
    setSelectedRuleRowIndex(ruleIndex !== null && ruleIndex !== undefined ? ruleIndex : null);
    
    // ⭐️ (ลบsetSelectedValidationCriteria และ setSelectedGenotypeData ที่ผิดออก)

    // --- 4. ตั้งค่าสถานะการอนุมัติ (ถ้ามี) ---
    if (report.medtech_verify) {
      setValidationSuccess(true);
    }
    if (report.pharm_verify) {
      setIsApproved(true);
    }

    // --- 5. ไปยัง Step 2 ---
    setCurrentStep(2);
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>;

    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="text-white" style={{ backgroundColor: '#CBB4FF' }}>Completed</Badge>;

      case "in progress":
      case "in_progress":
      case "inprogress":
        return <Badge className="text-white" style={{ backgroundColor: '#F1B6D5' }}>In Progress</Badge>;

      case "submitted for inspection":
      case "submitted_for_inspection":
        return <Badge className="text-white" style={{ backgroundColor: '#A7A7B4' }}>Submitted for Inspection</Badge>;

      case "awaiting inspection":
      case "awaiting_inspection":
        return <Badge className="text-white" style={{ backgroundColor: '#A7A7B4' }}>Awaiting Inspection</Badge>;

      case "awaiting report":
      case "awaiting_report":
        return <Badge className="text-white" style={{ backgroundColor: '#A7A7B4' }}>Awaiting Report</Badge>;

      case "failed":
      case "rejected":
        return <Badge variant="outline" className="bg-[#FFF0F0]" style={{ borderColor: '#E94D6A', color: '#E94D6A' }}>Failed</Badge>;

      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getApprovalIcon = (pharmVerify?: boolean, medtechVerify?: boolean) => {
    if (pharmVerify && medtechVerify) {
      return <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#64B464' }}></div>;
    }
    if (!pharmVerify && !medtechVerify) {
      return <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#DC6464' }}></div>;
    }
    return <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#DCB450' }}></div>;
  };

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

  const renderPatientReports = () => {
    if (loadingReports || loadingPatients) {
      return (
        <div className="p-6 text-center" style={{ color: '#505050' }}>
          <p>Loading reports...</p>
        </div>
      );
    }

    if (errorReports || errorPatients) {
      return (
        <div className="p-6 text-center" style={{ color: '#DC6464' }}>
          <p>Error loading reports. Please try again.</p>
        </div>
      );
    }

    return (
      <>
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
              onClick={() => setSearchQuery("")}
            >
              Clear All ({filteredReports.length} reports)
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white cursor-pointer hover:bg-[#D9C0FB] hover:border-[#D9C0FB] transition-colors"
              style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}
              onClick={() => {
                qc.invalidateQueries({ queryKey: ["reports"] });
                qc.invalidateQueries({ queryKey: ["patients"] });
              }}
            >
              Reset Data
            </Button>
          </div>
        </div>

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
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center" style={{ color: '#505050' }}>
                    No reports found
                  </td>
                </tr>
              ) : (
                filteredReports.map((report, index) => (
                  <tr key={report.id || index} className="bg-white border-b hover:bg-[#F5F3FF] transition-colors" style={{ borderColor: '#DCDCE6' }}>
                    <td className="p-4" style={{ color: '#1E1E1E' }}>
                      {report.id || 'N/A'}
                    </td>
                    <td className="p-4" style={{ color: '#1E1E1E' }}>
                      {report.patient?.Eng_name || report.patient?.name || 'Unknown Patient'}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="p-4">
                      {getApprovalIcon(report.pharm_verify, report.medtech_verify)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white cursor-pointer hover:bg-[#D9C0FB] hover:border-[#D9C0FB] transition-colors"
                          style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}
                          onClick={() => {
                            handleSelectReport(report);
                          }}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          EDIT
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white cursor-pointer hover:bg-[#D9C0FB] hover:border-[#D9C0FB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}
                          onClick={() => {
                            if (isPharmacyUser) {
                              setApprovalReportData(report);
                              setIsApprovalDialogOpen(true);
                            }
                          }}
                          disabled={!isPharmacyUser || isLoadingUser}
                          title={!isPharmacyUser ? "Only pharmacy users can approve reports" : ""}
                        >
                          Approval
                        </Button>

                        <Button
                          size="sm"
                          className="text-white cursor-pointer"
                          style={{ backgroundColor: '#7864B4' }}
                          onClick={() => {
                            handleSelectReport(report);
                          }}
                        >
                          {report.status?.toLowerCase() === "completed" ? "Preview" : "Continue"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t" style={{ backgroundColor: '#EDE9FE', borderColor: '#DCDCE6' }}>
          <p className="text-sm" style={{ color: '#1E1E1E' }}>
            Showing {filteredReports.length} of {reportsWithPatients.length} reports
          </p>
        </div>
      </>
    );
  };

  const renderGenotype = () => {
    if (loadingRules) {
      return (
        <div className="p-6 space-y-6 rounded-[20px] w-full max-w-full box-border" style={{ backgroundColor: '#F5F3FF' }}>
          <div className="flex items-center justify-center p-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#7864B4' }}></div>
              <p className="text-sm" style={{ color: '#505050' }}>Loading rules...</p>
            </div>
          </div>
        </div>
      );
    }

    if (errorRules) {
      return (
        <div className="p-6 space-y-6 rounded-[20px] w-full max-w-full box-border" style={{ backgroundColor: '#F5F3FF' }}>
          <div className="flex items-center justify-center p-12">
            <div className="text-center space-y-4">
              <div className="rounded-full bg-red-100 p-3 w-12 h-12 flex items-center justify-center mx-auto">
                <span className="text-red-600">✕</span>
              </div>
              <p className="text-sm" style={{ color: '#E94D6A' }}>Failed to load rules. Please try again.</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 space-y-6 rounded-[20px] w-full max-w-full box-border" style={{ backgroundColor: '#F5F3FF' }}>
        <div className="space-y-6">
          <div>
            <h3 className="mb-1" style={{ color: '#1E1E1E' }}>Rule-Based Genotype Interpretation</h3>
            <p className="text-sm" style={{ color: '#505050' }}>Algorithm-based genotype-to-phenotype conversion following CPIC/PharmGKB guidelines</p>
          </div>

          <div className="bg-white rounded-xl p-6 border elevation-1" style={{ borderColor: '#C8C8D2' }}>
            <h4 className="mb-4" style={{ color: '#1E1E1E' }}>Select Rule-Based</h4>
            <div className="space-y-3">
              {rules && rules.length > 0 ? (
                rules.map((rule: RuleBased) => {
                  console.log("Rule Name:", rule.Name, "Type:", typeof rule.Name, "Is Array:", Array.isArray(rule.Name));

                  let displayName = 'Unknown Rule';
                  if (rule.Name) {
                    if (Array.isArray(rule.Name)) {
                      displayName = rule.Name.join('');
                    } else if (typeof rule.Name === 'string') {
                      displayName = rule.Name;
                    }
                  }
                  if (!displayName || displayName === '') {
                    displayName = `Rule ${rule.id}`;
                  }

                  return (
                    <label
                      key={rule.id}
                      className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-[#F5F3FF] transition-colors"
                      style={{ borderColor: selectedRuleId === rule.id ? '#7864B4' : '#C8C8D2', backgroundColor: selectedRuleId === rule.id ? '#F5F3FF' : 'transparent' }}
                    >
                      <input
                        type="radio"
                        name="rule-selection"
                        value={rule.id}
                        checked={selectedRuleId === rule.id}
                        onChange={(e) => setSelectedRuleId(e.target.value)}
                        className="w-4 h-4"
                        style={{ accentColor: '#7864B4' }}
                      />
                      <span style={{ color: '#1E1E1E' }}>
                        {displayName}
                      </span>
                    </label>
                  );
                })
              ) : (
                <p className="text-sm text-center py-4" style={{ color: '#505050' }}>No rules available</p>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl elevation-1 bg-white border" style={{ borderColor: '#C8C8D2' }}>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#EDE9FE' }}>
                  <th className="text-center px-4 py-4" style={{ color: '#1E1E1E' }}>Select</th>
                  <th className="text-left px-6 py-4" style={{ color: '#1E1E1E' }}>Gene</th>
                  <th className="text-left px-6 py-4" style={{ color: '#1E1E1E' }}>Alleles</th>
                  <th className="text-center px-4 py-4" style={{ color: '#1E1E1E', backgroundColor: '#F5F3FF' }}>G/G</th>
                  <th className="text-center px-4 py-4" style={{ color: '#1E1E1E', backgroundColor: '#F5F3FF' }}>C/C</th>
                  <th className="text-center px-4 py-4" style={{ color: '#1E1E1E', backgroundColor: '#F5F3FF' }}>A/A</th>
                  <th className="text-center px-4 py-4" style={{ color: '#1E1E1E', backgroundColor: '#F5F3FF' }}>T/T</th>
                  <th className="text-left px-6 py-4" style={{ color: '#1E1E1E' }}>Predicted Genotype</th>
                  <th className="text-left px-6 py-4" style={{ color: '#1E1E1E' }}>Column Predicted Phenotype</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {selectedRuleData ? (
                  (() => {
                    const locations = selectedRuleData.location || [];
                    const resultLocations = selectedRuleData.result_location || [];
                    const phenotypes = selectedRuleData.phenotype || [];
                    const predictedGenotypes = selectedRuleData.predicted_genotype || [];
                    const predictedPhenotypes = selectedRuleData.predicted_phenotype || [];
                    const recommendations = selectedRuleData.recommend || [];
                    const names = selectedRuleData.Name || [];

                    const ruleBasedName = Array.isArray(names) ? names.join('') : (names || 'Unknown');

                    const alleleName = locations[0] || '−';

                    console.log("Selected Rule Data Debug:", {
                      names,
                      ruleBasedName,
                      locations,
                      alleleName,
                      resultLocations,
                      predictedGenotypes,
                      predictedPhenotypes
                    });

                    const maxLength = Math.max(
                      resultLocations.length,
                      phenotypes.length,
                      predictedGenotypes.length,
                      predictedPhenotypes.length,
                      recommendations.length
                    );

                    if (maxLength === 0) {
                      return (
                        <tr>
                          <td colSpan={9} className="px-6 py-8 text-center">
                            <p className="text-sm" style={{ color: '#505050' }}>No data available for selected rule</p>
                          </td>
                        </tr>
                      );
                    }

                    return Array.from({ length: maxLength }).map((_, index) => {
                      const resultLocation = resultLocations[index] || '−';
                      const phenotype = phenotypes[index] || '−';
                      const predictedGenotype = predictedGenotypes[index] || '−';
                      const predictedPhenotype = predictedPhenotypes[index] || '−';
                      const recommendation = recommendations[index] || '−';

                      const parseGenotype = (resultLoc: string) => {
                        const markers = { gg: '−', cc: '−', aa: '−', tt: '−' };
                        if (resultLoc && resultLoc !== '−') {
                          const lower = resultLoc.toLowerCase();
                          if (lower.includes('g/g')) markers.gg = '✓';
                          if (lower.includes('c/c')) markers.cc = '✓';
                          if (lower.includes('a/a')) markers.aa = '✓';
                          if (lower.includes('t/t')) markers.tt = '✓';
                        }
                        return markers;
                      };

                      const markers = parseGenotype(resultLocation);

                      const getPhenotypeStyle = (phenotype: string) => {
                        const lower = phenotype.toLowerCase();
                        if (lower.includes('intermediate') || lower.includes('im')) {
                          return {
                            containerColor: 'bg-secondary/10',
                            textColor: 'text-secondary-foreground-container',
                            short: 'IM'
                          };
                        } else if (lower.includes('normal') || lower.includes('nm')) {
                          return {
                            containerColor: 'bg-green-100',
                            textColor: 'text-green-700',
                            short: 'NM'
                          };
                        } else if (lower.includes('poor') || lower.includes('pm')) {
                          return {
                            containerColor: 'bg-destructive/10',
                            textColor: 'text-destructive',
                            short: 'PM'
                          };
                        } else if (lower.includes('rapid') || lower.includes('rm') || lower.includes('ultra')) {
                          return {
                            containerColor: 'bg-primary/10',
                            textColor: 'text-primary',
                            short: 'RM'
                          };
                        }
                        return {
                          containerColor: 'bg-muted',
                          textColor: 'text-muted-foreground',
                          short: 'UK'
                        };
                      };

                      const phenotypeStyle = getPhenotypeStyle(predictedPhenotype);

                      return (
                        <tr key={index} className="border-t hover:bg-[#F5F3FF] transition-colors" style={{ borderColor: '#DCDCE6' }}>
                          <td className="px-4 py-4 text-center">
                            <input
                              type="radio"
                              name="rule-row-selection"
                              checked={selectedRuleRowIndex === index}
                              onChange={() => {
                                setSelectedRuleRowIndex(index);

                                setSelectedGenotypeData({
                                  ruleBasedName: ruleBasedName,
                                  alleleName: alleleName,
                                  resultLocation: resultLocation,
                                  predictedGenotype: predictedGenotype,
                                  predictedPhenotype: predictedPhenotype,
                                  recommendation: recommendation
                                });

                                console.log(`Selected row ${index} for Phenotype step:`, {
                                  rule: ruleBasedName,
                                  allele: alleleName,
                                  resultLocation: resultLocation,
                                  genotype: predictedGenotype,
                                  phenotype: predictedPhenotype,
                                  recommendation: recommendation
                                });
                              }}
                              className="w-4 h-4 cursor-pointer"
                              style={{ accentColor: '#7864B4' }}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <span style={{ color: '#1E1E1E' }}>{ruleBasedName}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm" style={{ color: '#1E1E1E' }}>{alleleName}</span>
                          </td>
                          <td className="px-4 py-4 text-center" style={{ backgroundColor: '#F5F3FF' }}>
                            <span style={{ color: markers.gg === '✓' ? '#7864B4' : '#505050' }}>
                              {markers.gg}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center" style={{ backgroundColor: '#F5F3FF' }}>
                            <span style={{ color: markers.cc === '✓' ? '#7864B4' : '#505050' }}>
                              {markers.cc}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center" style={{ backgroundColor: '#F5F3FF' }}>
                            <span style={{ color: markers.aa === '✓' ? '#7864B4' : '#505050' }}>
                              {markers.aa}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center" style={{ backgroundColor: '#F5F3FF' }}>
                            <span style={{ color: markers.tt === '✓' ? '#7864B4' : '#505050' }}>
                              {markers.tt}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm" style={{ color: '#1E1E1E' }}>{predictedGenotype}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${phenotypeStyle.containerColor}`}>
                              <span className={`text-xs font-mono ${phenotypeStyle.textColor}`}>{phenotypeStyle.short}</span>
                              <span className={`text-sm ${phenotypeStyle.textColor}`}>{predictedPhenotype}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })()
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center">
                      <p className="text-sm" style={{ color: '#505050' }}>Please select a rule to view genotype data</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {expandedRules.size > 0 && selectedRuleData && (
            <div className="space-y-4 mt-6">
              <h3 className="text-foreground font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Rule-Based Prediction Details
              </h3>
              {Array.from(expandedRules).map(gene => {
                const recommendations = selectedRuleData.recommendation || [];
                const phenotypes = selectedRuleData.phenotype || [];

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
                        <h5 className="text-sm font-medium" style={{ color: '#1E1E1E' }}>Recommendations:</h5>
                        <ul className="space-y-1">
                          {recommendations.length > 0 ? (
                            recommendations.map((rec, index) => (
                              <li key={index} className="text-sm flex items-start gap-2" style={{ color: '#505050' }}>
                                <span className="mt-0.5" style={{ color: '#7864B4' }}>•</span>
                                {rec}
                              </li>
                            ))
                          ) : (
                            <li className="text-sm" style={{ color: '#505050' }}>No recommendations available</li>
                          )}
                        </ul>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium" style={{ color: '#1E1E1E' }}>Phenotype:</h5>
                          <p className="text-sm" style={{ color: '#505050' }}>
                            {phenotypes.length > 0 ? phenotypes.join(', ') : 'N/A'}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium" style={{ color: '#1E1E1E' }}>Clinical Significance:</h5>
                          <p className="text-sm italic" style={{ color: '#505050' }}>
                            {recommendations.length > 0 ? recommendations[0] : 'Interpretation not available'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            className="bg-white cursor-pointer hover:bg-[#D9C0FB] hover:border-[#D9C0FB] transition-colors px-6 py-3"
            style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}
            onClick={() => setCurrentStep(1)}
          >
            Back
          </Button>
          <Button
            className="text-white px-6 py-3 cursor-pointer"
            style={{ backgroundColor: '#7864B4' }}
            onClick={() => setCurrentStep(3)}
          >
            Continue to Phenotype Analysis →
          </Button>
        </div>
      </div>
    );
  };

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

  const getTesterTypeName = (id: string) => {
    const testerTypeMap: { [key: string]: string } = {
      '4ffa92f7-ce20-4ce7-9ee9-471f61cc9583': '2D6',
      '7787dd4c-f61b-48a1-845f-da1ea4807391': 'TPMT',
      'ce0bf81c-65f1-4c5c-af6f-7b898bb5b22b': 'HLA-B',
      'cea70080-3e7f-4d04-a4ea-9b437ae1e55f': '3A5',
      'e26d4416-dd10-40ac-915c-c0f869ad2cec': '2C19',
      'f5b4828a-1f75-468e-be4a-213f7a91300b': 'CYP2C9',
    };
    return testerTypeMap[id] || id;
  };

  const renderPhenotype = () => {

    return (
      <div className="p-6 space-y-6 rounded-[20px] w-full max-w-full box-border" style={{ backgroundColor: '#F5F3FF' }}>

        {selectedGenotypeData && (
          <Card className="p-6 bg-white border elevation-1" style={{ borderColor: '#7864B4' }}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium" style={{ color: '#1E1E1E' }}>Selected Genotype Summary</h3>
                <Badge style={{ backgroundColor: '#7864B4', color: 'white' }}>
                  From Previous Step
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium" style={{ color: '#505050' }}>Rule-Based</p>
                  <p className="text-lg font-semibold" style={{ color: '#7864B4' }}>{selectedGenotypeData.ruleBasedName}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium" style={{ color: '#505050' }}>Allele</p>
                  <p className="text-lg font-mono" style={{ color: '#1E1E1E' }}>{selectedGenotypeData.alleleName}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium" style={{ color: '#505050' }}>Genotype Marker</p>
                  <p className="text-lg font-mono" style={{ color: '#1E1E1E' }}>{selectedGenotypeData.resultLocation}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium" style={{ color: '#505050' }}>Predicted Genotype</p>
                  <p className="text-lg font-mono" style={{ color: '#1E1E1E' }}>{selectedGenotypeData.predictedGenotype}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium" style={{ color: '#505050' }}>Predicted Phenotype</p>
                  <p className="text-lg" style={{ color: '#1E1E1E' }}>{selectedGenotypeData.predictedPhenotype}</p>
                </div>
              </div>

              <div className="pt-4 border-t" style={{ borderColor: '#DCDCE6' }}>
                <p className="text-sm font-medium mb-2" style={{ color: '#505050' }}>Therapeutic Recommendation</p>
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#F5F3FF' }}>
                  <p className="text-sm leading-relaxed" style={{ color: '#1E1E1E' }}>
                    {selectedGenotypeData.recommendation || 'No specific recommendation available'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

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
            Continue to Quality Review →
          </Button>
        </div>
      </div>
    );
  };

  const handleValidation = () => {
    const updatedResults = {
      Pass: {
        ...validationResults.Pass,
        passed: validationResults.Pass.value >= validationResults.Pass.threshold
      },
      Warning: {
        ...validationResults.Warning,
        passed: validationResults.Warning.value >= validationResults.Warning.threshold
      },
      Failed: {
        ...validationResults.Failed,
        passed: validationResults.Failed.value >= validationResults.Failed.threshold
      }
    };

    setValidationResults(updatedResults);
    setIsValidated(true);
  };

  const handleValidateReport = async () => {
    if (!selectedPatientData) return;

    // Validate required fields before sending
    if (!selectedPatientData.medical_technician_id && !currentUser?.id) {
      alert('Medical technician information is missing. Please ensure you are logged in.');
      return;
    }
    console.log(selectedPatientData.quality_id);
    if (selectedPatientData.quality_id != null) {
      setIsValidating(false);
      setValidationSuccess(true);
      // return;
    }
    setIsValidating(true);

    try {
      console.log('Step 1: Creating quality record...');
      console.log('Tester type (tester_id):', testerType);
      console.log('Validation criteria:', selectedValidationCriteria);

      // Step 1: Create quality record first
      const qualityData = {
        tester_id: testerType, // UUID from tester_type table
        quality: selectedValidationCriteria.join(', '), // Store selected criteria as text
      };
      const qualityResponse = await fetch(`/api/user/quality?reportId=${selectedPatientData.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(qualityData),
      });

      if (!qualityResponse.ok) {
        const errorData = await qualityResponse.json();
        console.log(selectedPatientData.id);
        console.log('Sending POST request to /api/user/quality with data:', qualityData);
        throw new Error(`Failed to create quality record: ${errorData.message || qualityResponse.statusText}`);
      }

      const qualityResult = await qualityResponse.json();
      console.log('Quality record created:', qualityResult);

      // Extract quality_id from ResponseModel structure
      // Response structure: { status: "201", message: "...", data: {...} }
      let createdQualityId = null;

      if (qualityResult.data) {
        // Check if data has id directly (array response)
        if (Array.isArray(qualityResult.data) && qualityResult.data.length > 0) {
          createdQualityId = qualityResult.data[0].id;
        }
        // Check if data is object with id
        else if (qualityResult.data.id) {
          createdQualityId = qualityResult.data.id;
        }
      }

      console.log('Extracted quality_id:', createdQualityId);

      if (!createdQualityId) {
        console.error('Full quality response:', JSON.stringify(qualityResult, null, 2));
        throw new Error('Failed to get quality_id from quality creation response');
      }

      console.log('Step 2: Updating report with quality_id:', createdQualityId);

      // Step 2: Calculate required fields for report update
      const ruleId = selectedRuleId || selectedPatientData.rule_id || "pending-rule-selection";
      const indexRule = (() => {
        const value = selectedRuleRowIndex !== null && selectedRuleRowIndex !== undefined
          ? selectedRuleRowIndex
          : selectedPatientData.index_rule;
        return (!value || value === 0) ? 1 : value;
      })();
      const moreInformation = (() => {
        const existing = selectedPatientData.more_information;
        if (Array.isArray(existing) && existing.length > 0) {
          return existing;
        }
        return [{
          validated: true,
          validation_criteria: selectedValidationCriteria.join(', '),
          tester_type: testerType,
          quality_id: createdQualityId,
          validated_at: new Date().toISOString()
        }];
      })();
      const medtechId = selectedPatientData.medical_technician_id || currentUser?.id || "";

      // Step 3: Update report with the created quality_id
      const updateData: Partial<ReportUpdate> = {
        medtech_verify: true,
        rule_id: ruleId,
        index_rule: indexRule,
        more_information: moreInformation,
        medical_technician_id: medtechId,
        // quality_id: createdQualityId, // Use the newly created quality record ID
      };

      console.log('Sending PUT request to /api/user/report with data:', updateData);

      await updateReportMutation.mutateAsync({
        id: selectedPatientData.id,
        data: updateData
      });

      console.log('Report validated and updated successfully');

      // Store the quality_id in state
      setQualityId(createdQualityId);

      setValidationSuccess(true);
      qc.invalidateQueries({ queryKey: ['reports', 'quality'] });
      alert('Report validated successfully!');

    } catch (error) {
      console.error('Failed to validate report:', error);
      alert('Failed to validate report: ' + (error as Error).message);
    } finally {
      setIsValidating(false);
    }
  };






  const handleApproveReport = async () => {
    if (!selectedPatientData) return;
    if (!validationSuccess) {
      alert('Please validate the report first before approving.');
      return;
    }

    try {
      console.log('selectedPatientData:', selectedPatientData);
      console.log('selectedRuleId:', selectedRuleId);
      console.log('selectedRuleRowIndex:', selectedRuleRowIndex);

      const moreInfo = Array.isArray(selectedPatientData.more_information)
        ? [...selectedPatientData.more_information]
        : [];

      moreInfo.push({
        tester_type: testerType,
        validation_criteria: selectedValidationCriteria,
        approved_at: new Date().toISOString()
      });

      const updateData: Partial<ReportUpdate> = {
        doctor_id: selectedPatientData.doctor_id || "",
        pharm_verify: true,
        medtech_verify: true,
        note_id: selectedPatientData.note_id || "",
        rule_id: selectedRuleId || selectedPatientData.rule_id || "pending-rule-selection",
        index_rule: (() => {
          const value = selectedRuleRowIndex !== null && selectedRuleRowIndex !== undefined
            ? selectedRuleRowIndex
            : selectedPatientData.index_rule;
          return value === 0 || value === null || value === undefined ? 1 : value;
        })(),
        more_information: moreInfo.length > 0 ? moreInfo : [{ default: true }],
        pharmacist_id: selectedPatientData.pharmacist_id || "",
        medical_technician_id: selectedPatientData.medical_technician_id || currentUser?.id || "",
        request_date: selectedPatientData.request_date || new Date().toISOString(),
        report_date: selectedPatientData.report_date || new Date().toISOString(),
        quality_id: qualityId || selectedPatientData.quality_id || testerType,
      };

      console.log('Updating report with data:', updateData);

      await updateReportMutation.mutateAsync({
        id: selectedPatientData.id,
        data: updateData
      });

      setIsApproved(true);
      alert('Report approved successfully!');

    } catch (error) {
      console.error('Failed to approve report:', error);
      alert('Failed to approve report: ' + (error as Error).message);
    }
  };

  const handleFinishReport = async () => {
    if (!selectedPatientData) return;

    try {
      await finishReportMutation.mutateAsync({
        id: selectedPatientData.id,
        data: { status: "Completed" }
      });

      alert('Report completed successfully!');

      setSelectedReport(null);
      setSelectedPatientData(null);
      setCurrentStep(1);
    } catch (error) {
      console.error('Failed to complete report:', error);
      alert('Failed to complete report: ' + (error as Error).message);
    }
  };

  const renderRecommendations = () => (
    <div className="p-6 space-y-6 rounded-[20px] w-full max-w-full box-border" style={{ backgroundColor: '#F5F3FF' }}>
      <Card className="p-6 border elevation-1 bg-white" style={{ borderColor: '#C8C8D2' }}>
        <div className="space-y-6">
          <div>
            <h3 className="mb-1" style={{ color: '#1E1E1E' }}>Quality Review</h3>
            <p className="text-sm" style={{ color: '#505050' }}>Validate sequencing quality metrics before finalizing</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tester-type" style={{ color: '#1E1E1E' }}>Tester Type</Label>
            <Select value={testerType} onValueChange={setTesterType}>
              <SelectTrigger id="tester-type" className="bg-white border" style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}>
                <SelectValue placeholder="Select tester type" />
              </SelectTrigger>
              <SelectContent className="bg-white border" style={{ borderColor: '#C8C8D2' }}>
                <SelectItem value="4ffa92f7-ce20-4ce7-9ee9-471f61cc9583">2D6</SelectItem>
                <SelectItem value="7787dd4c-f61b-48a1-845f-da1ea4807391">TPMT</SelectItem>
                <SelectItem value="ce0bf81c-65f1-4c5c-af6f-7b898bb5b22b">HLA-B</SelectItem>
                <SelectItem value="cea70080-3e7f-4d04-a4ea-9b437ae1e55f">3A5</SelectItem>
                <SelectItem value="e26d4416-dd10-40ac-915c-c0f869ad2cec">2C19</SelectItem>
                <SelectItem value="f5b4828a-1f75-468e-be4a-213f7a91300b">CYP2C9</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <h4 style={{ color: '#1E1E1E' }}>Validation Criteria</h4>

            {/* ----- 1. Coverage (Pass) ----- */}
            <div
              className="flex items-center justify-between p-3 rounded-lg bg-white border cursor-pointer hover:bg-[#F5F3FF] transition-colors"
              style={{ borderColor: selectedValidationCriteria.includes('Pass') ? '#7864B4' : '#C8C8D2' }}
            // ⭐️ [ลบ] onClick={...} ออกจาก div นี้
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  value={'Pass'} // ⭐️ [แก้ไข] ค่าที่แท้จริงคือ 'Pass'

                  // ⭐️ [แก้ไข] checked ให้ตรงกับ value
                  checked={selectedValidationCriteria.includes('Pass')}

                  // ⭐️ onChange จะอัปเดต state เป็น ['Pass']
                  onChange={(e) => {
                    setSelectedValidationCriteria([e.target.value]);
                  }}
                  className="w-4 h-4"
                  style={{ accentColor: '#7864B4' }}
                  name="validationCriteria"
                />
                <div>
                  <span style={{ color: '#1E1E1E' }}>Coverage</span>
                  <p className="text-xs" style={{ color: '#505050' }}>≥ 100x required</p>
                </div>
              </div>
              <Badge className="px-3 py-1 rounded-lg bg-[#4CAF50]/10 text-[#4CAF50]">
                Pass
              </Badge>
            </div>

            {/* ----- 2. Allele Balance (Warning) ----- */}
            <div
              className="flex items-center justify-between p-3 rounded-lg bg-white border cursor-pointer hover:bg-[#F5F3FF] transition-colors"
              style={{ borderColor: selectedValidationCriteria.includes('Warning') ? '#7864B4' : '#C8C8D2' }}
            // ⭐️ [ลบ] onClick={...} ออกจาก div นี้
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  value={'Warning'} // ⭐️ [แก้ไข] ค่าที่แท้จริง

                  // ⭐️ [แก้ไข] checked ให้ตรงกับ value
                  checked={selectedValidationCriteria.includes('Warning')}

                  // ⭐️ onChange จะอัปเดต state เป็น ['Warning']
                  onChange={(e) => {
                    setSelectedValidationCriteria([e.target.value]);
                  }}
                  className="w-4 h-4"
                  style={{ accentColor: '#7864B4' }}
                  name="validationCriteria"
                />
                <div>
                  <span style={{ color: '#1E1E1E' }}>Allele Balance</span>
                  <p className="text-xs" style={{ color: '#505050' }}>≥ 90% required</p>
                </div>
              </div>
              <Badge className="px-3 py-1 rounded-lg bg-[#FFD966]/10 text-[#F89C4E]">
                Warning
              </Badge>
            </div>

            {/* ----- 3. Quality Score (Failed) ----- */}
            <div
              className="flex items-center justify-between p-3 rounded-lg bg-white border cursor-pointer hover:bg-[#F5F3FF] transition-colors"
              style={{ borderColor: selectedValidationCriteria.includes('Failed') ? '#7864B4' : '#C8C8D2' }}
            // ⭐️ [ลบ] onClick={...} ออกจาก div นี้
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  value={'Failed'} // ⭐️ [แก้ไข] ค่าที่แท้จริง

                  // ⭐️ [แก้ไข] checked ให้ตรงกับ value
                  checked={selectedValidationCriteria.includes('Failed')}

                  // ⭐️ onChange จะอัปเดต state เป็น ['Failed']
                  onChange={(e) => {
                    setSelectedValidationCriteria([e.target.value]);
                  }}
                  className="w-4 h-4"
                  style={{ accentColor: '#7864B4' }}
                  name="validationCriteria"
                />
                <div>
                  <span style={{ color: '#1E1E1E' }}>Quality Score</span>
                  <p className="text-xs" style={{ color: '#505050' }}>≥ 70 required</p>
                </div>
              </div>
              <Badge className="px-3 py-1 rounded-lg bg-[#DC6464]/10 text-[#DC6464]">
                Failed
              </Badge>
            </div>
          </div>

          {selectedValidationCriteria.length > 0 && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F5F3FF' }}>
              <p className="text-sm" style={{ color: '#505050' }}>
                Selected {selectedValidationCriteria.length} validation {selectedValidationCriteria.length === 1 ? 'criterion' : 'criteria'}
              </p>
            </div>
          )}
        </div>
      </Card>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          className="bg-white cursor-pointer hover:bg-[#D9C0FB] hover:border-[#D9C0FB] transition-colors"
          style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}
          onClick={() => setCurrentStep(3)}
        >
          Back
        </Button>
        <div className="flex space-x-3">
          <Button
            className="text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: validationSuccess ? '#C8C8D2' : '#7864B4' }}
            onClick={handleValidateReport}
            disabled={selectedValidationCriteria.length === 0 || isValidating || validationSuccess}
          >
            {isValidating ? 'Validating...' : validationSuccess ? 'Validated' : 'Validate Report'}
          </Button>
          <Button
            className="text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: validationSuccess ? '#7864B4' : '#C8C8D2' }}
            onClick={() => setCurrentStep(5)}
            disabled={!validationSuccess}
            title={!validationSuccess ? "Please validate the report first" : ""}
          >
            Continue to Confirmation
          </Button>
        </div>
      </div>
    </div>
  );

  const renderApproval = () => (
    <div className="p-6 space-y-8 rounded-[20px] w-full max-w-full box-border" style={{ backgroundColor: '#F5F3FF' }}>
      <Card className="p-6 border elevation-1 bg-white" style={{ borderColor: '#C8C8D2' }}>
        <h3 className="font-medium mb-4" style={{ color: '#1E1E1E' }}>Interpretation Summary</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b" style={{ borderColor: '#C8C8D2' }}>
            <div>
              <p className="text-sm mb-1" style={{ color: '#505050' }}>Patient Name</p>
              <p className="font-medium" style={{ color: '#1E1E1E' }}>
                {selectedPatientData?.patient?.Eng_name || selectedPatientData?.patient?.name || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: '#505050' }}>Report ID</p>
              <p className="font-medium" style={{ color: '#1E1E1E' }}>
                {selectedPatientData?.id || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: '#505050' }}>Patient ID</p>
              <p className="font-medium" style={{ color: '#1E1E1E' }}>
                {selectedPatientData?.patient?.id || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: '#505050' }}>Date of Birth</p>
              <p className="font-medium" style={{ color: '#1E1E1E' }}>
                {selectedPatientData?.patient?.dob
                  ? new Date(selectedPatientData.patient.dob).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })
                  : 'N/A'}
              </p>
            </div>
          </div>

          {selectedGenotypeData && (
            <div className="pb-4 border-b" style={{ borderColor: '#C8C8D2' }}>
              <h4 className="font-medium mb-3" style={{ color: '#1E1E1E' }}>Selected Genotype</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p style={{ color: '#505050' }}>Gene</p>
                  <p style={{ color: '#1E1E1E' }}>{selectedGenotypeData.ruleBasedName}</p>
                </div>
                <div>
                  <p style={{ color: '#505050' }}>Alleles</p>
                  <p style={{ color: '#1E1E1E' }}>{selectedGenotypeData.alleleName}</p>
                </div>
                <div>
                  <p style={{ color: '#505050' }}>Result Location</p>
                  <p style={{ color: '#1E1E1E' }}>{selectedGenotypeData.resultLocation}</p>
                </div>
                <div>
                  <p style={{ color: '#505050' }}>Predicted Genotype</p>
                  <p style={{ color: '#1E1E1E' }}>{selectedGenotypeData.predictedGenotype}</p>
                </div>
                <div className="col-span-2">
                  <p style={{ color: '#505050' }}>Predicted Phenotype</p>
                  <p style={{ color: '#1E1E1E' }}>{selectedGenotypeData.predictedPhenotype}</p>
                </div>
              </div>
            </div>
          )}

          <div className="pb-4 border-b" style={{ borderColor: '#C8C8D2' }}>
            <h4 className="font-medium mb-3" style={{ color: '#1E1E1E' }}>Quality Control</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p style={{ color: '#505050' }}>Tester Type</p>
                <p style={{ color: '#1E1E1E' }}>{getTesterTypeName(testerType)}</p>
              </div>
              <div>
                <p style={{ color: '#505050' }}>Validation Criteria</p>
                <p style={{ color: '#1E1E1E' }}>
                  {selectedValidationCriteria.length > 0
                    ? selectedValidationCriteria.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')
                    : 'None selected'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3" style={{ color: '#1E1E1E' }}>Approval Status</h4>
            {isApproved ? (
              <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: '#E8F5E9' }}>
                <CheckCircle className="h-5 w-5" style={{ color: '#4CAF50' }} />
                <span style={{ color: '#2E7D32' }}>Report approved successfully</span>
              </div>
            ) : validationSuccess ? (
              <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: '#FFF8E1' }}>
                <AlertCircle className="h-5 w-5" style={{ color: '#FFA000' }} />
                <span style={{ color: '#F57C00' }}>Report validated, pending approval</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: '#FFF8E1' }}>
                <AlertCircle className="h-5 w-5" style={{ color: '#FFA000' }} />
                <span style={{ color: '#F57C00' }}>Pending validation and approval</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Separator style={{ backgroundColor: '#DCDCE6' }} />

      <div>
        <h3 className="font-medium mb-2" style={{ color: '#1E1E1E' }}>Report Confirmation</h3>
        <p className="mb-6" style={{ color: '#505050' }}>Review the complete report details before exporting.</p>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            className="bg-white cursor-pointer hover:bg-[#D9C0FB] hover:border-[#D9C0FB] transition-colors"
            style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}
            onClick={() => setCurrentStep(4)}
          >
            Back
          </Button>
          <div className="flex space-x-3">
            <Button
              className="text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: isApproved ? '#C8C8D2' : (validationSuccess ? '#7864B4' : '#C8C8D2') }}
              onClick={handleApproveReport}
              disabled={!validationSuccess || isApproved}
              title={!validationSuccess ? "Please validate the report first" : ""}
            >
              {isApproved ? 'Approved' : 'Approve Interpret Summary'}
            </Button>
            <Button
              className="text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: isApproved ? '#7864B4' : '#C8C8D2' }}
              onClick={() => setCurrentStep(6)}
              disabled={!isApproved}
              title={!isApproved ? "Please approve the interpret summary first" : ""}
            >
              Continue to Export
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

        <div className="bg-white border p-4 rounded-lg mb-6" style={{ borderColor: '#C8C8D2' }}>
          <h4 className="font-medium mb-4" style={{ color: '#1E1E1E' }}>Report Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p style={{ color: '#505050' }}>Patient:</p>
              <p style={{ color: '#1E1E1E' }}>
                {selectedPatientData?.patient?.Eng_name ||
                  selectedPatientData?.patient?.name ||
                  'N/A'}
              </p>
            </div>
            <div>
              <p style={{ color: '#505050' }}>Report Number:</p>
              <p style={{ color: '#1E1E1E' }}>
                {selectedPatientData?.id || 'N/A'}
              </p>
            </div>
            <div>
              <p style={{ color: '#505050' }}>Test Type:</p>
              <p style={{ color: '#1E1E1E' }}>Pharmacogenomics Panel</p>
            </div>
            <div>
              <p style={{ color: '#505050' }}>Status:</p>
              <p style={{ color: '#1E1E1E' }}>Ready for Export</p>
            </div>
          </div>
        </div>

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

        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            className="bg-white cursor-pointer hover:bg-[#D9C0FB] hover:border-[#D9C0FB] transition-colors"
            style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}
            onClick={() => setCurrentStep(5)}
          >
            Back
          </Button>
          <div className="flex space-x-3">

            <a
              href={`/api/user/export/${selectedPatientData?.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* ⭐️ ย้ายปุ่มเข้ามาไว้ข้างในลิงก์ ⭐️ */}
              <Button
                className="text-white cursor-pointer"
                style={{ backgroundColor: '#7864B4' }}
              >
                Download PDF
              </Button>
            </a>


            <Button
              variant="outline"
              className="bg-white hover:bg-[#D9C0FB] hover:border-[#D9C0FB] transition-colors cursor-pointer"
              style={{ borderColor: '#C8C8D2', color: '#1E1E1E' }}
              onClick={handleFinishReport}
            >
              Finish
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
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    const patientName = selectedPatientData.patient?.Eng_name ||
      selectedPatientData.patient?.name ||
      'Unknown Patient';

    const patientGender = selectedPatientData.patient?.gender || 'N/A';
    const patientDOB = selectedPatientData.patient?.dob || '';
    const patientAge = patientDOB ? calculateAge(patientDOB) : 'N/A';

    return (
      <Card className="elevation-1 bg-white border" style={{ borderColor: '#DCDCE6' }}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="" alt={patientName} />
                <AvatarFallback className="text-white" style={{ backgroundColor: '#7864B4' }}>
                  {patientName.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium" style={{ color: '#1E1E1E' }}>{patientName}</h3>
                <p className="text-sm" style={{ color: '#505050' }}>
                  {patientGender} • {patientAge} years old
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
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm">
                <FileText className="h-4 w-4" style={{ color: '#505050' }} />
                <span style={{ color: '#505050' }}>Report</span>
              </div>
              <p className="text-sm font-medium" style={{ color: '#1E1E1E' }}>
                {selectedPatientData.id || 'N/A'}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4" style={{ color: '#505050' }} />
                <span style={{ color: '#505050' }}>Patient ID</span>
              </div>
              <p className="text-sm font-medium" style={{ color: '#1E1E1E' }}>
                {selectedPatientData.patient_id || 'N/A'}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4" style={{ color: '#505050' }} />
                <span style={{ color: '#505050' }}>DOB</span>
              </div>
              <p className="text-sm font-medium" style={{ color: '#1E1E1E' }}>
                {formatDate(patientDOB)}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4" style={{ color: '#505050' }} />
                <span style={{ color: '#505050' }}>Phone</span>
              </div>
              <p className="text-sm font-medium" style={{ color: '#1E1E1E' }}>
                {selectedPatientData.patient?.phone || 'N/A'}
              </p>
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
        return renderGenotype();
      case 3:
        return renderPhenotype();
      case 4:
        return renderRecommendations();
      case 5:
        return renderApproval();
      case 6:
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
    console.log("Approval submitted:", {
      reportData: approvalReportData,
      reviewerName,
      comments
    });

    setIsApprovalDialogOpen(false);
    setReviewerName("");
    setComments("");
  };

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
      <div className="flex items-center justify-between p-6 border-b" style={{ backgroundColor: '#F5F3FF', borderColor: '#DCDCE6' }}>
        <div>
          <h1 style={{ color: '#1E1E1E' }}>Result Interpretation</h1>
          <p style={{ color: '#505050' }}>Review and interpret genetic test results</p>
        </div>
      </div>

      {renderStepNavigation()}

      {selectedPatientData && (
        <div className="p-6 border-b" style={{ backgroundColor: '#F5F3FF', borderColor: '#DCDCE6' }}>
          {renderPatientPreview()}
        </div>
      )}

      <div className="flex-1 w-full max-w-full" style={{ backgroundColor: '#F5F3FF' }}>
        {renderContent()}
      </div>

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
              <Card className="p-4 border" style={{ backgroundColor: '#F5F3FF', borderColor: '#DCDCE6' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#EDE9FE' }}>
                      <FileText className="h-5 w-5" style={{ color: '#7864B4' }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#505050' }}>Report Number</p>
                      <p className="font-semibold" style={{ color: '#1E1E1E' }}>
                        {approvalReportData.id || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" style={{ color: '#505050' }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#505050' }}>Patient</p>
                        <p className="font-semibold" style={{ color: '#1E1E1E' }}>
                          {approvalReportData.patient?.Eng_name || approvalReportData.patient?.name || 'Unknown Patient'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: '#505050' }}>Status</p>
                    <Badge className="text-white" style={{ backgroundColor: '#7864B4' }}>
                      {approvalReportData.status || 'N/A'}
                    </Badge>
                  </div>
                </div>
              </Card>

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
                  disabled={!isPharmacyUser || isLoadingUser}
                  className="text-white cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#7864B4' }}
                  title={!isPharmacyUser ? "Only pharmacy users can approve reports" : ""}
                >
                  Approve Report
                </Button>
              </div>

              {/* Warning message สำหรับ user ที่ไม่ใช่ pharmacy */}
              {!isLoadingUser && !isPharmacyUser && (
                <div className="pt-2">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                      Only users with pharmacy role can approve reports.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

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
                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-lg border" style={{ borderColor: '#C8C8D2' }}>
                        <h3 className="text-lg font-medium mb-2" style={{ color: '#1E1E1E' }}>{geneData.name}</h3>
                        <p className="text-sm leading-relaxed" style={{ color: '#505050' }}>{geneData.function}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium" style={{ color: '#1E1E1E' }}>Clinical Relevance</h4>
                      <div className="p-4 bg-white rounded-lg border" style={{ borderColor: '#C8C8D2' }}>
                        <p className="text-sm leading-relaxed" style={{ color: '#505050' }}>{geneData.clinicalRelevance}</p>
                      </div>
                    </div>

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