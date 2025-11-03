const bwipjs = require('bwip-js')

const VALID_BCIDS = new Set([
    'code128', 'code39', 'ean13', 'ean8', 'upca', 'itf14',
    'qrcode', 'pdf417', 'datamatrix'
])

export async function GenerateBarcode(options) {
    const { text, bcid, scale, height, includetext, textxalign, textsize } = options

    if (!text || !String(text).trim()) {
        return { data: null, error: new Error('Text is required') }
    }

    const barcodeType = (bcid ? String(bcid) : 'code128').toLowerCase()
    if (!VALID_BCIDS.has(barcodeType)) {
        return { 
            data: null, 
            error: new Error(`Invalid barcode type. Use one of: ${[...VALID_BCIDS].join(', ')}`) 
        }
    }

    try {
        const bwipOptions = {
            bcid: barcodeType,
            text: String(text),
            scale: scale || 3,
            height: height || 10,
            includetext: includetext || false,
            textxalign: textxalign || 'center',
            textsize: textsize || 10,
        }

        const buffer = await bwipjs.toBuffer(bwipOptions)
        const base64 = buffer.toString('base64')
        
        return { data: base64, error: null }
    } catch (err) {
        console.error('Failed to generate barcode:', err)
        return { data: null, error: new Error('Failed to generate barcode: ' + err.message) }
    }
}
