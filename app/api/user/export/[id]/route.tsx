import { Page, Text, View, Document, StyleSheet, renderToStream, Link, Font, Image } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import path from "path";
// ⭐️ [แก้ไข] 1. Import service ทั้งสองตัว
import { GetReportById } from '../../service/report_service';
import { GetPatientById } from '../../service/patient_service';

// --- (Font.register และ const path ของโลโก้... ใช้เหมือนเดิม) ---
Font.register({
  family: "THSarabunNew",
  src: path.join(process.cwd(), "public", "fonts", "THSarabunNew.ttf"),
});

const ppmLogoPath = path.join(
  process.cwd(),
  "public",
  "LogoVersion2Varient1.png",
);
const hospitalLogoPath = path.join(process.cwd(), "public", "medswu-logo.png");

const styles = StyleSheet.create({
  page: {
    padding: 43,
    backgroundColor: "#ffffff",
    fontFamily: "THSarabunNew",
    fontSize: 7,
    display: "flex",
    flexDirection: "column",
  },
  topPurpleLine: {
    height: 3,
    backgroundColor: "#6a1b9a",
    marginBottom: 6,
  },
  headerBand: {
    borderTopWidth: 2,
    borderTopColor: "#6a1b9a",
    borderBottomWidth: 2,
    borderBottomColor: "#6a1b9a",
    paddingTop: 8,
    paddingBottom: 6,
    marginBottom: 12,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    width: 90,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerRight: {
    width: 90,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 64,
    height: 64,
    objectFit: "contain",
  },
  headerTitleTH: {
    fontSize: 16,
    fontWeight: "bold",
  },
  headerSubtitleEN: {
    fontSize: 11,
  },
  headerAddress: {
    fontSize: 9,
    textAlign: "center",
    marginTop: 2,
  },
  headerBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    alignItems: "center",
  },
  headerCodeBlock: {
    alignItems: "flex-end",
  },
  purpleDivider: {
    height: 3,
    backgroundColor: "#6a1b9a",
    marginTop: 8,
  },
  reportTitle: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  infoTable: {
    borderWidth: 1,
    borderColor: "#333333",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  infoCell: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRightWidth: 1,
    borderRightColor: "#333333",
  },
  label: {
    fontWeight: "bold",
  },
  value: {
    marginTop: 2,
  },
  valueInline: {
    fontWeight: "normal",
  },
  valueBold: {
    fontWeight: "bold",
  },
  tableTitle: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 5,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#333333",
  },
  tRow: {
    flexDirection: "row",
  },
  tHeaderCell: {
    flex: 1,
    backgroundColor: "#e0d7ef",
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#333333",
    fontWeight: "bold",
  },
  tCell: {
    flex: 1,
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#333333",
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  tCellLeft: {
    flex: 1,
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#333333",
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
    backgroundColor: "#f5f5f5",
  },
  tCellRight: {
    flex: 2,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  tCellIndent: {
    paddingLeft: 30,
  },
  highlightBox: {
    padding: 8,
    marginTop: 10,
    borderStyle: "solid",
  },
  recommendationList: {
    marginTop: 3,
    paddingLeft: 10,
  },
  noteBox: {
    marginTop: 10,
  },
  signatureSection: {
    borderWidth: 1,
    borderColor: "#333333",
    marginTop: "auto",
  },
  signatureRow: {
    flexDirection: "row",
  },
  signatureCell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#333333",
    padding: 6,
  },
  signatureCellLast: {
    flex: 1,
    padding: 6,
  },
  footer: {
    marginTop: 14,
    textAlign: "right",
    fontSize: 9,
    color: "#444444",
  },
  footerCode: {
    marginTop: 4,
    fontSize: 8,
    textAlign: "right",
    color: "#444444",
  },
  contentParagraph: {
    marginBottom: 2,
    lineHeight: 1,
    textAlign: "justify",
    textIndent: 40,
  },
  contentParagraphFirst: {
    marginBottom: 2,
    lineHeight: 1,
    textAlign: "justify",
    textIndent: 0,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 4,
    textDecoration: "underline",
  },
  evidenceHeader: {
    marginTop: 8,
    marginBottom: 3,
    fontSize: 11,
    fontWeight: "bold",
  },
  referenceItem: {
    marginBottom: 1,
  },
  annotationText: {
    marginTop: 10,
    lineHeight: 1.2,
    textDecoration: "none",
  },
});


// ------------------------
// 3. Table Primitives (ไม่ได้ใช้)
// ------------------------
// (ลบ const Table, TRow, TH, TD ที่ไม่ได้ใช้ออก)

// ------------------------
// ⭐️ [แก้ไข] 4. ฟังก์ชันแปลงข้อมูล (แก้บั๊ก Data Access ทั้งหมด)
// ------------------------
async function fetchReportData(id: string) {
  
  // 1. ดึง Report
  const { data: reportData, error: reportError } = await GetReportById(id);
  if (reportError || !reportData || reportData.length === 0) {
    console.error("Report Error:", reportError?.message || `Report Not Found: ${id}`);
    return null;
  }
  // ⭐️ [แก้ไข] บั๊ก data.length: ดึง Object แรกออกจาก Array
  const report = reportData; 

  // 2. ดึง Patient
  const { data: Patientdata, error: erorPatient } = await GetPatientById(report.patient_id);
  if (erorPatient || !Patientdata || Patientdata.length === 0) {
    console.error("Patient Error:", erorPatient?.message || `Patient Not Found: ${report.patient_id}`);
    return null;
  }
  // ⭐️ [แก้ไข] บั๊ก data.length: ดึง Object แรกออกจาก Array
  const patientRecord = Patientdata[0]; 

  // 3. ฟังก์ชันช่วย
  const formatReportDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("th-TH", {
        year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch (e) { return dateString; }
  };

  // 4. "แปลงร่าง" ข้อมูล
  
  // 4.1 patientInfo
  const patientInfo = [
    [
      // ⭐️ [แก้ไข] บั๊ก Eng_name: ดึงข้อมูลจาก patientRecord
      { label: "ชื่อ-สกุล (Name)", value: patientRecord.Eng_name || patientRecord.Thai_name, flex: 1 },
      { label: "อายุ (Age)", value: patientRecord.age, flex: 0.4 },
      { label: "ปี (years)", value: formatReportDate(report.DOB), flex: 0.4 },
      { label: "เพศ (Gender)", value: patientRecord.gender, flex: 0.5 },
    ],
    [
      { label: "เลขประจำตัว (HN)", value: report.patient_id, flex: 1 },
      { label: "หน่วยงานที่ส่งตรวจ (Hospital)", value: "Biomolecular laboratory", flex: 2 },
    ],
    [
      { label: "สิ่งส่งตรวจ (Specimen)", value: "EDTA Blood", flex: 1 },
      { label: "เบอร์ติดต่อ (Phone/Fax)", value: patientRecord.phone, flex: 1 }, // ⭐️ [แก้ไข]
    ],
    [
      { label: "เชื้อชาติ (Ethnicity)", value: patientRecord.Ethnicity, flex: 1 }, // ⭐️ [แก้ไข]
      { label: "วันที่ส่งตรวจ (Requested date)", value: formatReportDate(report.request_date), flex: 1 },
    ],
    [
      { label: "แพทย์ (Physician)", value: report.doctor_fullname, flex: 1 },
      { label: "วันที่รายงานผล (Reported date)", value: formatReportDate(report.report_date), flex: 1 },
    ],
  ];

  // 4.2 genotypeTableData
  const genotypeTableData = [
    { label: `${report.rule_name || "N/A"} gene`, value: "", isHeader: true },
    { label: `Genotype Result`, value: report.rule_result_location || "N/A" },
    { label: "Predicted Genotype:", value: report.rule_predicted_genotype || "N/A" },
    { label: "Predicted Phenotype:", value: report.rule_predicted_phenotype || "N/A" },
    { 
      label: `Implications for ${report.rule_name || 'Drug'}:`, 
      value: report.rule_recommendation ? report.rule_recommendation.split('\n')[0].replace(/^[0-9]+\.\s*/, '') : "N/A"
    },
    { 
      label: "Therapeutic recommendation:", 
      value: report.rule_recommendation || "N/A",
      isLongText: true
    },
  ];

  // 4.3 notes
  const notes = [ report.note_method || "การทดสอบนี้ตรวจวิเคราะห์พันธุกรรมด้วยเทคนิค..." ];

  // 4.4 signatureBlocks
  const signatureBlocks = [
    {
      heading: "วิเคราะห์และแปลผลโดย",
      lines: [report.fullname_medtech || "N/A", "ท.น. ๗๕๓๑"],
    },
    {
      heading: "รับรองผลการทดสอบโดย",
      lines: [report.fullname_pharmacist || "N/A", report.pharmacist_license ? `ภ. ${report.pharmacist_license}` : ""].filter(Boolean),
    },
  ];

  // 4.5 clinicalInfo & references (หน้า 2+)
  const clinicalInfo = [ "N/A" ];
  const references = [ "N/A" ];

  // 5. คืนค่าข้อมูลทั้งหมด
  return {
    patientName: patientRecord.Eng_name || patientRecord.Thai_name,
    patientHN: report.patient_id,
    testCode: `(รหัสการทดสอบ ${report.rule_name || 'N/A'})`,
    patientInfo,
    genotypeTableData,
    notes,
    signatureBlocks,
    clinicalInfo,
    references,
  };
}

// ------------------------
// ⭐️ [ใหม่] 5. สร้าง Reusable Components (Header, Footer, Content)
// ------------------------

// --- ส่วนหัว (Fixed) ---
const Header = ({ data }) => (
  <View style={styles.headerView} fixed>
    <View style={styles.headerBottomRow}>
      <Text>{data.patientName}</Text>
      <View style={styles.headerCodeBlock}>
        <Text>{data.patientHN}</Text>
      </View>
    </View>
    <View style={styles.headerBand}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}><Image style={styles.logo} src={ppmLogoPath} /></View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitleTH}>ห้องปฏิบัติการเภสัชพันธุศาสตร์</Text>
          <Text style={styles.headerSubtitleEN}>Laboratory for Pharmacogenomics</Text>
          <Text style={styles.headerAddress}>4th Floor, Somdech Phra Debaratana Medical Center, Department of Pathology,</Text>
          <Text style={styles.headerAddress}>Faculty of Medicine Ramathibodi Hospital Tel.</Text>
          <Text style={styles.headerAddress}>+662-200-4331 Fax +662-200-4332</Text>
        </View>
        <View style={styles.headerRight}><Image style={styles.logo} src={hospitalLogoPath} /></View>
      </View>
    </View>
  </View>
);

// --- ส่วนท้าย (Fixed) ---
// (รวมลายเซ็นและเลขหน้าไว้ด้วยกัน)
const Footer = ({ data }) => (
  <View style={styles.footerView} fixed>
    <SignatureSection signatureBlocks={data.signatureBlocks} />
    <View style={styles.footer}>
      <Text style={styles.footerCode}>Fo-WI-LPM-03-004 Rev.2 26.11.61</Text>
      <Text
        render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )}
      />
    </View>
  </View>
);

// --- ตารางข้อมูลผู้ป่วย ---
const PatientInfoTable = ({ data }) => (
  <View style={styles.infoTable}>
    {data.patientInfo.map((row, idx) => (
      <View key={`pi-${idx}`} style={[ styles.infoRow, idx === data.patientInfo.length - 1 ? { borderBottomWidth: 0 } : null ]}>
        {row.map((col, i) => {
          const isLast = i === row.length - 1;
          return (
            <View key={`pi-${idx}-${i}`} style={[ styles.infoCell, { flex: col.flex ?? 1 }, isLast ? { borderRightWidth: 0 } : null ]}>
              <Text>
                <Text style={styles.label}>{col.label}: </Text>
                <Text style={col.emphasize ? styles.valueBold : styles.valueInline}>
                  {col.value}
                </Text>
              </Text>
            </View>
          );
        })}
      </View>
    ))}
  </View>
);

// --- ตาราง Genotype ---
const GenotypeTable = ({ data }) => (
  <View style={styles.table}>
    {data.genotypeTableData.map((row, idx) => {
      const isLast = idx === data.genotypeTableData.length - 1;
      return (
        <View key={`gt-${idx}`} style={styles.tRow}>
          <View style={[ styles.tCellLeft, row.indent && styles.tCellIndent, isLast && { borderBottomWidth: 0 } ]}>
            <Text style={row.isHeader ? styles.label : null}>{row.label}</Text>
          </View>
          <View style={[ styles.tCellRight, isLast && { borderBottomWidth: 0 } ]}>
            {/* ⭐️ [ใหม่] ถ้าเป็น LongText (recommendation) ให้ split \n */}
            {row.isLongText ? (
              (row.value || "").split('\n').map((line, lineIdx) => (
                <Text key={lineIdx}>{line}</Text>
              ))
            ) : (
              <Text>{row.value}</Text>
            )}
          </View>
        </View>
      );
    })}
  </View>
);

// --- หมายเหตุ ---
const NoteBox = ({ data }) => (
  <View style={styles.noteBox}>
    {data.notes.map((n, i) => (
      <Text key={`note-${i}`}>หมายเหตุ: {n}</Text>
    ))}
  </View>
);

// --- ส่วนลายเซ็น (สำหรับใน Footer) ---
const SignatureSection = ({ signatureBlocks }) => (
  <View style={styles.signatureSection}>
    <View style={styles.signatureRow}>
      {signatureBlocks.map((block, idx) => {
        const isLast = idx === signatureBlocks.length - 1;
        return (
          <View key={`sign-${idx}`} style={isLast ? styles.signatureCellLast : styles.signatureCell}>
            <Text style={styles.label}>{block.heading}</Text>
            {block.lines.map((line, lineIdx) => (
              <Text key={`sign-${idx}-${lineIdx}`} style={styles.value}>{line}</Text>
            ))}
          </View>
        );
      })}
    </View>
  </View>
);

// ------------------------
// ⭐️ [ใหม่] 6. Document หลัก (ใช้ Layout ใหม่)
// ------------------------
const MyDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* 6.1 ใส่ Header (fixed) และ Footer (fixed) */}
      <Header data={data} />
      

      {/* 6.2 ใส่ "เนื้อหา" ทั้งหมด (Content) 
          (เนื้อหาจะล้นและสร้างหน้าใหม่เองอัตโนมัติ)
      */}
      <View style={styles.contentWrapper}>
        
        {/* --- ส่วนที่ 1: ผลแล็บหลัก --- */}
        <Text style={styles.reportTitle}>PHARMACOGENOMICS AND PERSONALIZED MEDICINE REPORT</Text>
        <PatientInfoTable data={data} />
        <Text style={styles.tableTitle}>CYP3A5 genotyping {data.testCode}</Text>
        <GenotypeTable data={data} />
        <NoteBox data={data} />
        
        {/* [หมายเหตุ] ลายเซ็นถูกย้ายไปอยู่ใน <Footer /> แล้ว */}
        
        {/* --- ส่วนที่ 2: ข้อมูลเพิ่มเติม (บังคับขึ้นหน้าใหม่) --- */}
        <View break>
          <Text style={styles.reportTitle}>PHARMACOGENOMICS INTERPRETATION (More Information)</Text>
          <Text style={styles.annotationText}>
            †† Annotation of CPIC guideline for Tacrolimus and CYP3A5{" "}
            <Link src="https://www.pharmgkb.org/guideline/PA166124619">
              https://www.pharmgkb.org/guideline/PA166124619
            </Link>
            {" "}
            กำหนดแนวทางสำหรับการใช้ยา Tacrolimus ...
          </Text>

          {data.clinicalInfo.map((paragraph, idx) => (
            <Text key={`para-${idx}`} style={idx === 0 ? styles.contentParagraphFirst : styles.contentParagraph}>
              {paragraph}
            </Text>
          ))}
          <Text style={[styles.sectionTitle, { marginTop: 12 }]}>หลักฐานและเอกสารอ้างอิง (Evidence and References)</Text>
          {data.references.map((ref, idx) => (
            <Text key={`ref-${idx}`} style={styles.contentParagraph}>
              {`${idx + 1}. ${ref}`}
            </Text>
          ))}
        </View>

        {/* --- ส่วนที่ 3: หมายเหตุสุดท้าย (บังคับขึ้นหน้าใหม่) --- */}
        <View break>
          <View style={styles.highlightBox}>
            <Text>หมายเหตุ:</Text>
            <Text>1. ใช้สำหรับแพทย์เพื่อพิจารณาในการรักษาผู้ป่วยได้อย่างมีประสิทธิภาพ</Text>
            <Text>2. กรุณาเก็บข้อมูลผลการตรวจไว้เป็นความลับเฉพาะบุคคล</Text>
          </View>
        </View>
        
      </View>
      <Footer data={data} />
    </Page>
  </Document>
);

// ------------------------
// ⭐️ [แก้ไข] 7. GET Function (แก้บั๊ก params.id)
// ------------------------
export async function GET(req, { params }) {
  
  // 1. ⭐️ [แก้ไข] ดึง ID (ลบ await ออก)
  const id = await params.id; 

  if (!id) {
    return new NextResponse("Missing ID from URL params", { status: 400 });
  }

  // 2. ดึงข้อมูลจริง (ที่แปลงร่างแล้ว)
  const reportData = await fetchReportData(id);

  // 3. ⭐️ [เพิ่ม] ตรวจสอบว่า fetch ข้อมูลสำเร็จหรือไม่
  if (!reportData) {
    return new NextResponse(
      `Failed to fetch or find report data for ID: ${id}. Check server logs for details. (Possible UUID mismatch or Not Found)`, 
      { status: 404 }
    );
  }

  // 4. Render PDF โดยส่ง 'reportData' เข้าไป
  const stream = await renderToStream(<MyDocument data={reportData} />);

  // 5. ส่ง PDF stream กลับไป
  return new NextResponse(stream, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}