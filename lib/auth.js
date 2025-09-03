import dotenv from 'dotenv'
import { testConnection } from './db.js'

// Load .env.local
dotenv.config({ path: '.env.local' })

// call testConnection
async function checkConnection() {
  console.log('Testing Supabase connection...')
  try {
    const result = await testConnection()
    console.log('Connection result:', result)
  } catch (error) {
    console.error('Error testing connection:', error)
  }
}

checkConnection()