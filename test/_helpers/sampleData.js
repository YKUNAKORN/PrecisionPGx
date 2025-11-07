export function makeReportRow(overrides = {}) {
  const now = new Date().toISOString();
  return Object.assign({
    id: 'r1',
    specimens_id: null,
    specimen: null,
    doctor_id: null,
    doctor: null,
    patient_id: null,
    patient: null,
    pharm_verify: false,
    medtech_verify: false,
    note_id: null,
    note: null,
    index_rule: null,
    rule: null,
    rule_id: null,
    pharmacist_id: null,
    pharmacist: null,
    medical_technician_id: null,
    medical_technician: null,
    more_information: null,
    status: 'submitted inspection',
    request_date: now,
    report_date: now,
    priority: null,
    ward_id: null,
    ward: null,
    created_at: now,
    updated_at: now,
  }, overrides)
}

export function makeQualityRow(q = 'pass', overrides = {}) {
  return Object.assign({ id: 'q1', tester_id: 't1', tester_name: 'T Tester', quality: q, created_at: new Date().toISOString() }, overrides)
}
