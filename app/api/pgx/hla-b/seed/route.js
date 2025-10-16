import { CreateClientSecret } from '@/lib/supabase/client'
const { HLA_B_RULES } = require('@/lib/pgx/hlaB')

export async function POST(req) {
  try {
    const supabase = CreateClientSecret()

    // Map rules to rows compatible with Supabase table `hla_b_rules`
    const rows = HLA_B_RULES.map(r => ({
      id: r.id,
      locus: r.locus || 'HLA-B',
      alleles: r.alleles || [],
      drugs: r.drugs || [],
      scars: r.scars || [],
      evidence: r.evidence || [],
      recommendation: r.recommendation || null,
      strength: r.strength || null,
      created_at: new Date().toISOString()
    }))

    const { data, error } = await supabase.from('hla_b_rules').upsert(rows, { onConflict: 'id' }).select()

    if (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true, inserted: data.length, data }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 })
  }
}
