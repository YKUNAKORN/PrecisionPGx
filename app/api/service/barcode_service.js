const bwipjs = require('bwip-js');

const VALID_BCIDS = new Set([
  'code128', 'code39', 'ean13', 'ean8', 'upca', 'itf14',
  'qrcode', 'pdf417', 'datamatrix'
]);

async function generateBarcode(opts = {}) {
  const {
    text,
    bcid: rawBcid,
    scale = 3,
    height = 10,
    includetext = false,
    textxalign = 'center',
    textsize = 10,
  } = opts;

  if (!text || !String(text).trim()) {
    throw new Error('`text` is required');
  }

  const bcid = (rawBcid ? String(rawBcid) : 'code128').toLowerCase();
  if (!VALID_BCIDS.has(bcid)) {
    throw new Error(`invalid bcid. use one of: ${[...VALID_BCIDS].join(', ')}`);
  }

  const bwipOptions = {
    bcid,
    text: String(text),
    scale,
    height,      
    includetext,  
    textxalign,
    textsize,
  };

  const buffer = await bwipjs.toBuffer(bwipOptions);
  return buffer.toString('base64');
}

module.exports = { generateBarcode };
