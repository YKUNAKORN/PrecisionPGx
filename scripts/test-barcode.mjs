import { generateBarcode } from '../app/api/service/barcode_service.js'

async function run() {
  try {
    const base64 = await generateBarcode({ text: 'TEST123456' })
    console.log('base64 length:', base64.length)
    console.log(base64.slice(0, 80))
  } catch (err) {
    console.error('error:', err)
  }
}

run()
