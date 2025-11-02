import bwipjs from 'bwip-js';

export const runtime = 'nodejs'; 
export const dynamic = 'force-dynamic';

const VALID_BCIDS = new Set([
  'code128','code39','ean13','ean8','upca','itf14',
  'qrcode','pdf417','datamatrix',
]);

async function generateBarcode({
  text,
  bcid = 'code128',
  scale = 3,
  height = 10,
  includetext = false,
  textxalign = 'center',
  textsize = 10,
}) {
  if (!text || !String(text).trim()) {
    throw new Error('`text` is required');
  }
  const _bcid = String(bcid).toLowerCase();
  if (!VALID_BCIDS.has(_bcid)) {
    throw new Error(`invalid bcid. use one of: ${[...VALID_BCIDS].join(', ')}`);
  }

  const png = await bwipjs.toBuffer({
    bcid: _bcid,
    text: String(text),
    scale: Number(scale),
    height: Number(height), 
    includetext: Boolean(includetext),
    textxalign,
    textsize: Number(textsize),
  });
  return png.toString('base64');
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const base64 = await generateBarcode({
      text: searchParams.get('text'),
      bcid: searchParams.get('bcid') ?? 'code128',
      scale: Number(searchParams.get('scale')) || 3,
      height: Number(searchParams.get('height')) || 10,
      includetext: (searchParams.get('includetext') || '').toLowerCase() === 'true',
      textxalign: searchParams.get('textxalign') || 'center',
      textsize: Number(searchParams.get('textsize')) || 10,
    });
    return Response.json({ base64 });
  } catch (err) {
    return Response.json({ error: err.message || 'internal_error' }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const base64 = await generateBarcode({
      text: body.text,
      bcid: body.bcid ?? 'code128',
      scale: body.scale ?? 3,
      height: body.height ?? 10,
      includetext: Boolean(body.includetext),
      textxalign: body.textxalign ?? 'center',
      textsize: body.textsize ?? 10,
    });
    return Response.json({ base64 });
  } catch (err) {
    return Response.json({ error: err.message || 'internal_error' }, { status: 400 });
  }
}
