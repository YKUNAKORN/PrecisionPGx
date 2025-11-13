'use client';
import '@/app/style/home.css';
import { useQuery } from "@tanstack/react-query";
import { createDashboardQueryOptions } from "lib/fetch/Dashboard";
import { createReportQueryOptions } from "lib/fetch/Report";
import { addDays, format } from "date-fns";

export default function Home() {
  const {
    data: dashboard,
    isLoading: loadingdashboard,
    error: errordashboard,
  } = useQuery(createDashboardQueryOptions.all());

  const {
    data: Report,
    isLoading: loadingReport,
    error: errorReport,
  } = useQuery(createReportQueryOptions.all());

  if (loadingdashboard) return <div>Loading dashboard...</div>;
  if (errordashboard) return <div>Error loading dashboard</div>;

  // Trends 7 วันย้อนหลัง (d0 = today, d1 = yesterday ...)
  const trends = Array.from({ length: 7 }).map((_, i) => {
    const dayDate = addDays(new Date(), -i);
    const value = dashboard?.[`sample_received_d${i}`] ?? 0;
    return {
      day: format(dayDate, "dd MMM"), // แสดงวันที่แบบ "09 Nov"
      value,
    };
  }).reverse(); // reverse ให้ d6 = วันเก่าสุด, d0 = วันนี้

  const maxVal = Math.max(...trends.map((t) => t.value)) || 1;



  const totalday = (dashboard?.sample_received || 0) + (dashboard?.tests_completed || 0) + (dashboard?.results_interpret || 0);

  const totalExecution = (dashboard?.awaiting_approved || 0) + (dashboard?.submitted_inspection || 0) + (dashboard?.awaiting_inspection || 0) + (dashboard?.inprogress || 0) + (dashboard?.completed || 0);


  // *** แก้ไขตรงนี้ ***
  const commonBoxShadowStyle = {
    // ลด offsetX จาก 10px เป็น 4px (ลดเงาด้านขวา)
    // เพิ่ม offsetY จาก 10px เป็น 12px (เพิ่มเงาด้านล่าง)
    // เพิ่ม blur จาก 15px เป็น 16px (ให้ใกล้เคียงกับ Quality page)
    boxShadow: '4px 12px 16px rgba(79, 55, 139, 0.3)', 
    border: '1px solid #CCC2DC' 
  };

  // เนื่องจากทั้ง customBoxShadowStyle และ updatedCardC1ShadowStyle มีค่าเหมือนกัน
  // เราสามารถใช้ commonBoxShadowStyle เดียวกันได้
  const customBoxShadowStyle = commonBoxShadowStyle;
  const updatedCardC1ShadowStyle = commonBoxShadowStyle;
  // ******************

  return (
    <div>
      <div className='title-1'>Dashboard</div>
      <div className='title-2'>At a glance overview of operations and performance.</div>
      <div className="card-c1-container">
        <div className="card-c1" style={updatedCardC1ShadowStyle}>
          <p className="card-label-c1">Samples Received</p>
          <p className="card-value-c1">{`${dashboard.sample_received}`}</p>
          <div className="card-c1-progress" style={updatedCardC1ShadowStyle}>
            <div className="fill" style={{ width: `${dashboard.sample_received / totalday * 100}%` }} />
          </div>
        </div>
        <div className="card-c1" style={updatedCardC1ShadowStyle}>
          <p className="card-label-c1">Tests Completed</p>
          <p className="card-value-c1">{`${dashboard.tests_completed}`}</p>
          <div className="card-c1-progress" style={updatedCardC1ShadowStyle}>
            <div className="fill" style={{ width: `${dashboard?.tests_completed / totalday * 100}%` }} />
          </div>
        </div>
        <div className="card-c1" style={updatedCardC1ShadowStyle}>
          <p className="card-label-c1">Results Interpreted</p>
          <p className="card-value-c1">{`${dashboard.results_interpret}`}</p>
          <div className="card-c1-progress" style={updatedCardC1ShadowStyle}>
            <div className="fill" style={{ width: `${dashboard?.results_interpret / totalday * 100}%` }} />
          </div>
        </div>
      </div>
      <div className="card-c2-container">
        <div className="card-c2" style={customBoxShadowStyle}>
          <p className="card-value-c2">Sample Registration Trends </p>
          <p className="card-value-c2-l">Last 7 Days</p>
          <div className="bar-chart">
            {trends.map(t => (
              <div className="bar" key={t.day}>
                <div
                  className="bar-fill"
                  style={{ height: `${(t.value / maxVal) * 100}%` }}
                  aria-label={`${t.day}: ${t.value}`}
                />
                <span className="bar-label">{t.day}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card-c2" style={customBoxShadowStyle}>
          <p className="card-value-c2">Test Execution Status</p>
          <p className="card-value-c2-l">Real-time workflow progress tracking</p>
          <div className="status-list">
            <div className="status-row">
              <span className="status-label s1">Submitted for Inspection</span>
              <span className="status-val">{`${dashboard.submitted_inspection}`}</span>
            </div>
            <div className="status-rail">
              <div className="status-fill s1" style={{ width: `${(dashboard?.submitted_inspection / totalExecution) * 100}%` }} />
            </div>
            <div className="status-row">
              <span className="status-label s2">Awaiting Inspection</span>
              <span className="status-val">{`${dashboard.awaiting_inspection}`}</span>
            </div>
            <div className="status-rail">
              <div className="status-fill s2" style={{ width: `${(dashboard?.awaiting_inspection / totalExecution) * 100}%` }} />
            </div>
            <div className="status-row">
              <span className="status-label s3">In Progress</span>
              <span className="status-val">{`${dashboard.inprogress}`}</span>
            </div>
            <div className="status-rail">
              <div className="status-fill s3" style={{ width: `${(dashboard?.inprogress / totalExecution) * 100}%` }} />
            </div>
            <div className="status-row">
              <span className="status-label s4">{`completed`}</span>
              <span className="status-val">{`${dashboard.completed}`}</span>
            </div>
            <div className="status-rail">
              <div className="status-fill s4" style={{ width: `${(dashboard?.completed / totalExecution) * 100}%` }} />
            </div>

          </div>
        </div>
      </div>
      <div className='card-c3-container'>
        <div className="card-c3" style={customBoxShadowStyle}>
          <p className="card-value-c3">Sample Management</p>
          <div className="card-value-c3-subt header">
            <span className="col-id">Sample ID</span>
            <span className="col-name">Patient Name</span>
            <span className="col-type">Test Panel</span>
            <span className="col-status">Status</span>
          </div>
          {loadingReport ? (
            <div style={{ padding: 12 }}>Loading patients…</div>
          ) : (
            <div className="mt-6 max-h-[420px] overflow-y-auto pr-2 snap-y snap-mandatory scroll-pt-4">
              {Report.map((s) => (
                <div key={s.id} className="card-value-c3-subt snap-start">
                  <span className="col-id" title={s.id}>{s.id}</span>
                  <span className="col-name" title={s.Eng_name}>{s.Eng_name}</span>
                  <span className="col-type">{`${s.rule_name ? s.rule_name : "-"} `}</span>
                  <span className="col-status">
                    <span className={`status ${s.status}`}>
                      {s.status.replace(/^\w/, (c) => c.toUpperCase())}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}