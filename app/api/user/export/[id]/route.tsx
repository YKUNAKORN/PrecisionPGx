import { Page, Text, View, Document, StyleSheet, renderToStream, Link, Font, Image } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { GetReportById } from '../../service/report_service';
import { GetPatientById } from '../../service/patient_service';

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


async function fetchReportData(id: string) {
  
  const { data: reportData, error: reportError } = await GetReportById(id);
  if (reportError || !reportData || reportData.length === 0) {
    console.error("Report Error:", reportError?.message || `Report Not Found: ${id}`);
    return null;
  }
  const report = reportData; 

  const { data: Patientdata, error: erorPatient } = await GetPatientById(report.patient_id);
  if (erorPatient || !Patientdata || Patientdata.length === 0) {
    console.error("Patient Error:", erorPatient?.message || `Patient Not Found: ${report.patient_id}`);
    return null;
  }
  const patientRecord = Patientdata[0]; 

  const formatReportDate = (dateString: any) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("th-TH", {
        year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch (e: any) { return dateString; }
  };

  const patientInfo = [
    [
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
      { label: "เบอร์ติดต่อ (Phone/Fax)", value: patientRecord.phone, flex: 1 },
    ],
    [
      { label: "เชื้อชาติ (Ethnicity)", value: patientRecord.Ethnicity, flex: 1 },
      { label: "วันที่ส่งตรวจ (Requested date)", value: formatReportDate(report.request_date), flex: 1 },
    ],
    [
      { label: "แพทย์ (Physician)", value: report.doctor_fullname, flex: 1 },
      { label: "วันที่รายงานผล (Reported date)", value: formatReportDate(report.report_date), flex: 1 },
    ],
  ];

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

  const notes = [ report.note_method || "การทดสอบนี้ตรวจวิเคราะห์พันธุกรรมด้วยเทคนิค..." ];

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

  const clinicalInfo = [ "N/A" ];
  const references = [ "N/A" ];

  return {
    patientName: patientRecord.Eng_name || patientRecord.Thai_name,
    patientHN: report.patient_id,
    testCode: `(รหัสการทดสอบ ${report.id || 'N/A'})`,
    patientInfo,
    genotypeTableData,
    notes,
    signatureBlocks,
    clinicalInfo,
    references,
    rule: report.rule_name || "N/A",
  };
}

const Header = ({ data }: { data: any }) => (
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

const Footer = ({ data }: { data: any }) => (
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

const PatientInfoTable = ({ data }: { data: any }) => (
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

const GenotypeTable = ({ data }: { data: any }) => (
  <View style={styles.table}>
    {data.genotypeTableData.map((row, idx) => {
      const isLast = idx === data.genotypeTableData.length - 1;
      return (
        <View key={`gt-${idx}`} style={styles.tRow}>
          <View style={[ styles.tCellLeft, row.indent && styles.tCellIndent, isLast && { borderBottomWidth: 0 } ]}>
            <Text style={row.isHeader ? styles.label : null}>{row.label}</Text>
          </View>
          <View style={[ styles.tCellRight, isLast && { borderBottomWidth: 0 } ]}>
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

const NoteBox = ({ data }: { data: any }) => (
  <View style={styles.noteBox}>
    {data.notes.map((n, i) => (
      <Text key={`note-${i}`}>หมายเหตุ: {n}</Text>
    ))}
  </View>
);

const SignatureSection = ({ signatureBlocks }: { signatureBlocks: any }) => (
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

const MyDocument = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Header data={data} />

      <View style={styles.contentWrapper}>
        <Text style={styles.reportTitle}>PHARMACOGENOMICS AND PERSONALIZED MEDICINE REPORT</Text>
        <PatientInfoTable data={data} />
        <Text style={styles.tableTitle}>{data.rule} genotyping {data.testCode}</Text>
        <GenotypeTable data={data} />
        <NoteBox data={data} />

        <View break>
          <Text style={styles.reportTitle}>PHARMACOGENOMICS INTERPRETATION(More Information)</Text>
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

export async function GET(req: NextRequest, { params }: { params: any }): Promise<NextResponse> {
  const id = await params.id; 

  if (!id) {
    return new NextResponse("Missing ID from URL params", { status: 400 });
  }

  const reportData = await fetchReportData(id);

  if (!reportData) {
    return new NextResponse(
      `Failed to fetch or find report data for ID: ${id}. Check server logs for details. (Possible UUID mismatch or Not Found)`, 
      { status: 404 }
    );
  }

  const stream = await renderToStream(<MyDocument data={reportData} />);

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}