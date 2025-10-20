import './globals.css'
import '@/app/style/home.css';

export default function Home() {
  const trends = [
    { day: "Sat", value: 72 },
    { day: "Sun", value: 58 },
    { day: "Mon", value: 35 },
    { day: "Tue", value: 88 },
    { day: "Wed", value: 55 },
    { day: "Thu", value: 70 },
    { day: "Fri", value: 48 },
  ];  
  const maxVal = Math.max(...trends.map(t => t.value));

  return (
    <div>
      <div className='title-1'>Dashboard</div>
      <div className='title-2'>At a glance overview of operations and performance.</div>
      
      <div className="card-c1-container">
        <div className="card-c1">
          <p className="card-label-c1">Samples Received</p>
          <p className="card-value-c1">120</p>
          <div className="card-c1-progress">
            <div className="fill" style={{ width: "72%" }} />
          </div>  
        </div>
        <div className="card-c1">
          <p className="card-label-c1">Tests Completed</p>
          <p className="card-value-c1">105</p>
          <div className="card-c1-progress">
            <div className="fill" style={{ width: "82%" }} />
          </div>   
        </div>
        <div className="card-c1">
          <p className="card-label-c1">Results Interpreted</p>
          <p className="card-value-c1">98</p>
          <div className="card-c1-progress">
            <div className="fill" style={{ width: "92%" }} />
          </div>   
        </div>
      </div>

      <div className="card-c2-container">
        <div className="card-c2">
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
        <div className="card-c2">
          <p className="card-value-c2">Test Execution Status</p>
          <p className="card-value-c2-l">Real-time workflow progress tracking</p>
          <div className="status-list">
            <div className="status-row">
              <span className="status-label s1">Submitted for Inspection</span>
              <span className="status-val">8</span>
            </div>
            <div className="status-rail">
              <div className="status-fill s1" style={{width:"20%"}}/>
            </div>

            <div className="status-row">
              <span className="status-label s2">Awaiting Inspection</span>
              <span className="status-val">12</span>
            </div>
            <div className="status-rail">
              <div className="status-fill s2" style={{width:"35%"}}/>
            </div>

            <div className="status-row">
              <span className="status-label s3">In Progress</span>
              <span className="status-val">35</span>
            </div>
            <div className="status-rail">
              <div className="status-fill s3" style={{width:"70%"}}/>
            </div>

            <div className="status-row">
              <span className="status-label s4">Completed</span>
              <span className="status-val">50</span>
            </div>
            <div className="status-rail">
              <div className="status-fill s4" style={{width:"92%"}}/>
            </div>

            <div className="status-row">
              <span className="status-label s5">Awaiting Report</span>
              <span className="status-val">5</span>
            </div>
            <div className="status-rail">
              <div className="status-fill s5" style={{width:"14%"}}/>
            </div>
          </div>
        </div>
      </div>
      
      <div className='card-c3-container'>
        <div className="card-c3">
          <p className="card-value-c3">Sample Management</p>
          
          <div className="card-value-c3-subt header">
            <span>Sample ID</span>
            <span>Patient Name</span>
            <span>Test Type</span>
            <span>Status</span>
            <span>Result</span>
          </div>

          <div className="card-value-c3-subt">
            <span>LAB-2023-001</span>
            <span>Ethan Harper</span>
            <span>Blood Test</span>
            <span><span className="status completed">Completed</span></span>
            <span>Normal</span>
          </div>

          <div className="card-value-c3-subt">
            <span>LAB-2023-002</span>
            <span>Olivia Bennett</span>
            <span>Urine Analysis</span>
            <span><span className="status progress">In Progress</span></span>
            <span>N/A</span>
          </div>

          <div className="card-value-c3-subt">
            <span>LAB-2023-003</span>
            <span>Liam Carter</span>
            <span>Biopsy</span>
            <span><span className="status pending">Pending</span></span>
            <span>N/A</span>
          </div>

          <div className="card-value-c3-subt">
            <span>LAB-2023-004</span>
            <span>Sophia Davis</span>
            <span>Genetic Screening</span>
            <span><span className="status completed">Completed</span></span>
            <span>Positive</span>
          </div>

          <div className="card-value-c3-subt">
            <span>LAB-2023-005</span>
            <span>Noah Evans</span>
            <span>Allergy Test</span>
            <span><span className="status completed">Completed</span></span>
            <span>Negative</span>
          </div>

        </div>
      </div>
    </div>
  );
} 
