import { Page, Text, View, Document, StyleSheet, renderToStream, Link, Font, Image } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import path from "path";

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
// Reusable table primitives
// ------------------------
const Table = ({ children }) => <View style={styles.table}>{children}</View>;
const TRow = ({ children }) => <View style={styles.tRow}>{children}</View>;
const TH = ({ children, flex = 1 }) => (
  <View style={[styles.tHeaderCell, { flex }]}><Text>{children}</Text></View>
);
const TD = ({ children, flex = 1 }) => (
  <View style={[styles.tCell, { flex }]}><Text>{children}</Text></View>
);

// ------------------------
// Static demo data (arrays)
// In real usage, replace with fetched data.
// ------------------------
const patientInfo = [
  [
    { label: "ชื่อ-สกุล (Name)", value: "นาย", flex: 1 },
    { label: "อายุ (Age)", value: "48", flex: 0.4 },
    { label: "ปี (years)", value: "", flex: 0.4 },
    { label: "เพศ (Gender)", value: "ชาย", flex: 0.5 },
  ],
  [
    { label: "เลขประจำตัว (HN)", value: "", flex: 1 },
    {
      label: "หน่วยงานที่ส่งตรวจ (Hospital)",
      value: "Biomolecular laboratory",
      flex: 2,
    },
  ],
  [
    { label: "สิ่งส่งตรวจ (Specimen)", value: "EDTA Blood", flex: 1 },
    { label: "เบอร์ติดต่อ (Phone/Fax)", value: "", flex: 1 },
  ],
  [
    { label: "เชื้อชาติ (Ethnicity)", value: "ไทย", flex: 1 },
    { label: "วันที่ส่งตรวจ (Requested date)", value: "11 มกราคม 2568", flex: 1 },
  ],
  [
    { label: "แพทย์ (Physician)", value: "-", flex: 1 },
    { label: "วันที่รายงานผล (Reported date)", value: "14 มกราคม 2568", flex: 1 },
  ],
];

const genotypeTableData = [
  { label: "CYP3A5 gene", value: "", isHeader: true },
  { label: "genotype: CYP3A5*3  6986A>G", value: "Homozygous wild type (AA)" },
  { label: "CYP3A5*6  14690G>A", value: "Homozygous wild type (GG)", indent: true },
  { label: "CYP3A5*7  27131_27132insT", value: "No insertion", indent: true },
  { label: "Predicted Genotype:", value: "CYP3A5*1/*1" },
  { label: "Predicted Phenotype:", value: "เอนไซม์ CYP3A5 มีอัตราการทำงานปกติ (Normal metabolizer, NM)" },
  { 
    label: "Implications for Tacrolimus:", 
    value: "CYP3A5 expresser: Lower dose-adjusted trough concentrations of tacrolimus and decreased chance of achieving target tacrolimus concentrations." 
  },
  { 
    label: "Therapeutic recommendation:", 
    value: "1. สำหรับยา Tacrolimus: พิจารณาปรับเพิ่มขนาดเริ่มต้น 1.5 - 2 เท่า จากขนาดมาตรฐาน (total dose ไม่ควรเกิน 0.3 mg/kg/day) และตรวจติดตามระดับยาในกระแสเลือด (Therapeutic drug monitoring) เพื่อเป็นแนวทางในการปรับขนาดยาและเฝ้าระวังการเกิดอาการไม่พึงประสงค์\n\n2. สำหรับยาอื่นๆ: สามารถใช้ยาที่มีการเปลี่ยนแปลงผ่านเอนไซม์ CYP3A5 ได้ในขนาดมาตรฐาน",
    isLongText: true
  },
];

const notes = [
  "การทดสอบนี้ตรวจวิเคราะห์พันธุกรรมด้วยเทคนิค real time PCR โดยตรวจจากชนิดแอลลีลตามพันธุกรรมของมนุษย์ในรูปแบบ *3, *6, *7 ซึ่งพบได้ย่อยในกลุ่มประชากร (อ้างอิงจากงานวิจัย) ทั้งนี้การแปลผลทางพันธุกรรมที่มีแนวทางการทำงานของการตรวจในครั้งนี้เท่านั้น",
];

const signatureBlocks = [
  {
    heading: "วิเคราะห์และแปลผลโดย",
    lines: ["ภญ.ไอริน โรจนกิจพาณิชย์"],
  },
  {
    heading: "เลขที่ใบประกอบวิชาชีพ",
    lines: ["ภ. ๗๐๙๕๕"],
  },
  {
    heading: "เลขที่ใบประกอบวิชาชีพ",
    lines: ["ทนพญ.นภัสดาร์ คุ้มดี", "ท.น. ๗๕๓๑"],
  },
];

const SignatureSection = () => (
  <View style={styles.signatureSection}>
    <View style={styles.signatureRow}>
      {signatureBlocks.map((block, idx) => {
        const isLast = idx === signatureBlocks.length - 1;
        return (
          <View
            key={`sign-${idx}`}
            style={isLast ? styles.signatureCellLast : styles.signatureCell}
          >
            <Text style={styles.label}>{block.heading}</Text>
            {block.lines.map((line, lineIdx) => (
              <Text key={`sign-${idx}-${lineIdx}`} style={styles.value}>
                {line}
              </Text>
            ))}
          </View>
        );
      })}
    </View>
  </View>
);

const clinicalInfo = [
  "ข้อมูลทางคลินิกของผูืป่วย  การตรวจเภสัชพันธุศาสตร์เพื่อเป็นข้อมูลการใช้ยา Tacrolimus",
  "เอนไซม์ CYP3A5 ทำหน้าที่เมแทบอลิซึมในกลุ่มเดียวกับเอนไซม์ CYP3A4 แต่มีประสิทธิภาพที่ต่างกัน โดยความผิดปกติทางพันธุกรรมของยีน CYP3A5 ที่มีการรายงานในปัจจุบันไม่น้อยกว่า 11 อัลลีล โดย CYP3A5*3 เป็นอัลลีลที่มีความชุกสูงที่สุด (ชาวไทย 85-98%, แอฟริกา-อเมริกัน 35-48%, ยุโรป 70-75%, ญี่ปุ่น 74-77%) จากการศึกษาพบว่าประชากรเชื้อผิวขาว 10-20% เท่านั้นที่มีการแสดงออกของเอนไซม์ CYP3A5 ดังนั้นโดยทั่วไปการแสดงออกของเอนไซม์ CYP3A5 ในกลุ่มที่มีความชุกต่ำกว่าจะแสดงออกจาก CYP3A4 มาก ดังนั้นลักษณะทางพันธุกรรมของยีน CYP3A5 ในผู้ป่วยจึงมีบทบาทสำคัญในการกำหนดอัตราการขับถ่ายยาหรือออกจากร่างกาย โดยกระบวนการ first-pass metabolism",
  "สำหรับยา Tacrolimus อาศัยเอนไซม์ CYP3A4 และ CYP3A5 เป็นตัวหลักในการเมแทบอลิซึม (Major metabolic pathway) แต่จากการศึกษา พบว่า เอนไซม์ CYP3A5 มีความสำคัญมากกว่า ดังนั้นความหลากหลายทางพันธุกรรมของเอนไซม์ CYP3A5 จึงมีบทบาทสำคัญต่อดอกรีการจัดยา Tacrolimus ซึ่งเป็นยาที่มีปากฏสิ่งที่จำเป็นในการป้องกันการปฏิเสธการปลูกถ่าย โดยพบว่า ผู้ป่วยที่มี homozygous CYP3A5*1/*1 หรือ heterozygous CYP3A5*1/*3 ที่ได้รับยา Tacrolimus จะมีระดับยาต่ำในเลือดกว่าผู้ป่วยที่มี homozygous CYP3A5*3/*3 และผู้ที่มี homozygous CYP3A5*3/*3 จะได้รับยา Tacrolimus ในขนาดที่ต่ำกว่าเพื่อให้ระดับยาอยู่ในช่วงการรักษา รวมทั้งยังมีโอกาสเกิดการปฏิเสธสิ่งปลูกถ่ายเฉียบพลัน (acute rejection episode) น้อยกว่า แต่จะมีโอกาสเกิดพิษต่อไตสูงกว่า ผู้ป่วยที่เป็น heterozygous CYP3A5*1/*3 หรือ homozygous CYP3A5*1/*1 สำหรับในการยับยั้ง CYP3A5 และยา Tacrolimus อ้างอิงจาก CPIC guideline แนะนำให้ผู้ที่มีเอนไซม์ CYP3A5 expresser (CYP3A5 normal metabolizer or intermediate metabolizer) ได้รับขนาดเริ่มต้นที่สูงกว่า และผู้ที่เป็น CYP3A5 non-expresser (CYP3A5 poor metabolizer) สามารถได้รับขนาดยาเริ่มต้นตามมาตรฐานได้ อย่างไรก็ดี การพิจารณาเลือกใช้หรือปรับขนาดยาในผู้ป่วยยังจำเป็นต้องอ้างอิงปัจจัยอื่น เช่น อันตรกิริยาระหว่างยา การทำงานของตับและไตร่วมด้วย",
];

const references = [
  "The Human Cytochrome P450 (CYP) Allele Nomenclature Committee. CYP3A5 allele nomenclature. [updated 2007 Dec 10]. Available from: http://www.cypalleles.ki.se/cyp3a5.htm",
  "Yang D, Mary FH, Nina I, Connie L, et al. Effect of CYP3A5 polymorphism on Tacrolimus metabolic clearance in vitro. Drug metabolism and disposition 2006; 34: 836-847.",
  "Daly AK. Significance of the minor cytochrome P450 3A isoforms. Clin Pharmacokinet 2006; 45: 13-31.",
];
// ------------------------
// Page 1
// ------------------------
const PageOne = () => (
  <Page size="A4" style={styles.page}>
    <View style={styles.headerBottomRow}>
        <Text>กนาฐ พรมแสน</Text>
        <View style={styles.headerCodeBlock}>
          <Text>HN10A-005870</Text>
        </View>
    </View>
    <View style={styles.headerBand}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Image style={styles.logo} src={ppmLogoPath} />
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitleTH}>ห้องปฏิบัติการเภสัชพันธุศาสตร์</Text>
          <Text style={styles.headerSubtitleEN}>Laboratory for Pharmacogenomics</Text>
          <Text style={styles.headerAddress}>
            4th Floor, Somdech Phra Debaratana Medical Center, Department of Pathology,
          </Text>
          <Text style={styles.headerAddress}>
            Faculty of Medicine Ramathibodi Hospital Tel.
          </Text>
          <Text style={styles.headerAddress}>
            +662-200-4331 Fax +662-200-4332
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Image style={styles.logo} src={hospitalLogoPath} />
        </View>
      </View>
    </View>

    <Text style={styles.reportTitle}>PHARMACOGENOMICS AND PERSONALIZED MEDICINE REPORT</Text>

    <View style={styles.infoTable}>
      {patientInfo.map((row, idx) => (
        <View
          key={`pi-${idx}`}
          style={[
            styles.infoRow,
            idx === patientInfo.length - 1 ? { borderBottomWidth: 0 } : null,
          ]}
        >
          {row.map((col, i) => {
            const isLast = i === row.length - 1;
            return (
              <View
                key={`pi-${idx}-${i}`}
                style={[
                  styles.infoCell,
                  { flex: col.flex ?? 1 },
                  isLast ? { borderRightWidth: 0 } : null,
                ]}
              >
                <Text>
                  <Text style={styles.label}>{col.label}: </Text>
                  <Text
                    style={col.emphasize ? styles.valueBold : styles.valueInline}
                  >
                    {col.value}
                  </Text>
                </Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>

    <Text style={styles.tableTitle}>CYP3A5 genotyping (รหัสการทดสอบ 400283)</Text>
    <View style={styles.table}>
      {genotypeTableData.map((row, idx) => {
        const isLast = idx === genotypeTableData.length - 1;
        return (
          <View key={`gt-${idx}`} style={styles.tRow}>
            <View 
              style={[
                styles.tCellLeft,
                row.indent && styles.tCellIndent,
                isLast && { borderBottomWidth: 0 }
              ]}
            >
              <Text style={row.isHeader ? styles.label : null}>{row.label}</Text>
            </View>
            <View 
              style={[
                styles.tCellRight,
                isLast && { borderBottomWidth: 0 }
              ]}
            >
              <Text>{row.value}</Text>
            </View>
          </View>
        );
      })}
    </View>

    <View style={styles.noteBox}>
      {notes.map((n, i) => (
        <Text key={`note-${i}`}>หมายเหตุ: {n}</Text>
      ))}
    </View>

    <SignatureSection />

    <View style={styles.footer}>
    <Text style={styles.footerCode}>Fo-WI-LPM-03-004 Rev.2 26.11.61</Text>
      <Text>Page 1 of 4</Text>
    </View>
  </Page>
);

// ------------------------
// Page 2 (references header & CPIC link)
// ------------------------
const PageTwo = () => (
  <Page size="A4" style={styles.page}>
    <View style={styles.headerBottomRow}>
        <Text>กนาฐ พรมแสน</Text>
        <View style={styles.headerCodeBlock}>
          <Text>HN10A-005870</Text>
        </View>
    </View>
    <View style={styles.headerBand}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Image style={styles.logo} src={ppmLogoPath} />
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitleTH}>ห้องปฏิบัติการเภสัชพันธุศาสตร์</Text>
          <Text style={styles.headerSubtitleEN}>Laboratory for Pharmacogenomics</Text>
          <Text style={styles.headerAddress}>
            4th Floor, Somdech Phra Debaratana Medical Center, Department of Pathology,
          </Text>
          <Text style={styles.headerAddress}>
            Faculty of Medicine Ramathibodi Hospital Tel.
          </Text>
          <Text style={styles.headerAddress}>
            +662-200-4331 Fax +662-200-4332
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Image style={styles.logo} src={hospitalLogoPath} />
        </View>
        </View>
    </View>
    <Text style={styles.annotationText}>
      †† Annotation of CPIC guideline for Tacrolimus and CYP3A5{" "}
      <Link src="https://www.pharmgkb.org/guideline/PA166124619">
        https://www.pharmgkb.org/guideline/PA166124619
      </Link>
      {" "}
      กำหนดแนวทางสำหรับการใช้ยา Tacrolimus ในผู้ป่วยที่ได้รับการปลูกถ่ายตับหรือไต และผลลัพธ์ลักษณะที่เกิดขึ้นในเลือด และผู้ป่วยที่ได้รับการปลูกถ่ายทางตับซึ่งมีแนวโน้มป้องกันผู้ป่วยที่ได้รับการปลูกถ่ายอวัยวะ
    </Text>
    <SignatureSection />
    <View style={styles.footer}>
      <Text style={styles.footerCode}>Fo-WI-LPM-03-004 Rev.2 26.11.61</Text>
      <Text>Page 2 of 4</Text>
    </View>
  </Page>
);

// ------------------------
// Page 3 (Detailed interpretation and references)
// ------------------------
const PageThree = () => (
  <Page size="A4" style={styles.page}>
    <View style={styles.headerBottomRow}>
        <Text>กนาฐ พรมแสน</Text>
        <View style={styles.headerCodeBlock}>
          <Text>HN10A-005870</Text>
        </View>
    </View>
    <View style={styles.headerBand}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Image style={styles.logo} src={ppmLogoPath} />
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitleTH}>ห้องปฏิบัติการเภสัชพันธุศาสตร์</Text>
          <Text style={styles.headerSubtitleEN}>Laboratory for Pharmacogenomics</Text>
          <Text style={styles.headerAddress}>
            4th Floor, Somdech Phra Debaratana Medical Center, Department of Pathology,
          </Text>
          <Text style={styles.headerAddress}>
            Faculty of Medicine Ramathibodi Hospital Tel. +662-200-4331 Fax +662-200-4332
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Image style={styles.logo} src={hospitalLogoPath} />
        </View>
      </View>
    </View>
    <Text style={styles.reportTitle}>PHARMACOGENOMICS INTERPRETATION (More Information)</Text>
        
    {clinicalInfo.map((paragraph, idx) => (
      <Text key={`para-${idx}`} style={idx === 0 ? styles.contentParagraphFirst : styles.contentParagraph}>
        {paragraph}
      </Text>
    ))}

    <Text style={[styles.sectionTitle, { marginTop: 12 }]}>หลักฐานและเอกสารอ้างอิง (Evidence and References)</Text>
    
    {references.map((ref, idx) => (
      <Text key={`ref-${idx}`} style={styles.contentParagraph}>
        {`${idx + 1}. ${ref}`}
      </Text>
    ))}

    <SignatureSection />
    <View style={styles.footer}>
      <Text style={styles.footerCode}>Fo-WI-LPM-03-004 Rev.2 26.11.61</Text>
      <Text>Page 3 of 4</Text>
    </View>
  </Page>
);

// ------------------------
// Page 4 (Closing notes)
// ------------------------
const PageFour = () => (
  <Page size="A4" style={styles.page}>
    <View style={styles.headerBottomRow}>
        <Text>กนาฐ พรมแสน</Text>
        <View style={styles.headerCodeBlock}>
          <Text>HN10A-005870</Text>
        </View>
    </View>
    <View style={styles.headerBand}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Image style={styles.logo} src={ppmLogoPath} />
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitleTH}>ห้องปฏิบัติการเภสัชพันธุศาสตร์</Text>
          <Text style={styles.headerSubtitleEN}>Laboratory for Pharmacogenomics</Text>
          <Text style={styles.headerAddress}>
            4th Floor, Somdech Phra Debaratana Medical Center, Department of Pathology,
          </Text>
          <Text style={styles.headerAddress}>
            Faculty of Medicine Ramathibodi Hospital Tel. +662-200-4331 Fax +662-200-4332
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Image style={styles.logo} src={hospitalLogoPath} />
        </View>
      </View>
    </View>
    <View style={styles.highlightBox}>
      <Text>หมายเหตุ:</Text>
      <Text>1. ใช้สำหรับแพทย์เพื่อพิจารณาในการรักษาผู้ป่วยได้อย่างมีประสิทธิภาพ</Text>
      <Text>2. กรุณาเก็บข้อมูลผลการตรวจไว้เป็นความลับเฉพาะบุคคล</Text>
    </View>
    <SignatureSection />
    <View style={styles.footer}>
    <Text style={styles.footerCode}>Fo-WI-LPM-03-004 Rev.2 26.11.61</Text>
      <Text>Page 4 of 4</Text>
    </View>
  </Page>
);

// Create Document Component
const MyDocument = () => (
  <Document>
    <PageOne />
    <PageTwo />
    <PageThree />
    <PageFour />
  </Document>
);

export async function GET(req, { params }) {
  // id is available if needed in the future
  void params;
  const stream = await renderToStream(<MyDocument />);

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
