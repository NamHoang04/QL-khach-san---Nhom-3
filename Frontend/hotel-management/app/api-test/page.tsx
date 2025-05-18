"use client"

import { useState, useEffect } from 'react'
import { API_CONFIG } from '@/lib/config'

export default function ApiTestPage() {
  const [apiStatus, setApiStatus] = useState<string>('Testing...')
  const [healthResponse, setHealthResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [adminLoginTest, setAdminLoginTest] = useState<string>('Not tested')

  useEffect(() => {
    testApiConnection()
  }, [])

  const testApiConnection = async () => {
    setApiStatus('Testing connection...')
    setError(null)
    
    try {
      // Test basic fetch to API using HTTP
      const response = await fetch(`${API_CONFIG.baseUrl}/Health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }
      
      const data = await response.json()
      setHealthResponse(data)
      setApiStatus('Connected successfully')
    } catch (err: any) {
      setApiStatus('Connection failed')
      setError(err.message || 'Unknown error')
    }
  }

  const testAdminLogin = async () => {
    setAdminLoginTest('Testing...')
    
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/Admins/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'admin',
          password: 'admin123'
        }),
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Login failed: ${response.status} - ${errorText}`)
      }
      
      const data = await response.json()
      setAdminLoginTest('Success: ' + JSON.stringify(data))
    } catch (err: any) {
      setAdminLoginTest('Failed: ' + (err.message || 'Unknown error'))
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
      
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">API Configuration</h2>
        <p><strong>URL:</strong> {API_CONFIG.baseUrl}</p>
        <p><strong>Timeout:</strong> {API_CONFIG.timeout}ms</p>
        <p><strong>Mock Data:</strong> {API_CONFIG.useMockData ? 'Yes' : 'No'}</p>
      </div>
      
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Health Check</h2>
        <p><strong>Status:</strong> <span className={apiStatus.includes('failed') ? 'text-red-500' : 'text-green-500'}>{apiStatus}</span></p>
        {error && <p className="text-red-500"><strong>Error:</strong> {error}</p>}
        
        <button 
          onClick={testApiConnection}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Connection
        </button>
        
        {healthResponse && (
          <div className="mt-4 p-2 bg-gray-100 rounded">
            <h3 className="font-semibold">Response:</h3>
            <pre className="overflow-auto p-2">{JSON.stringify(healthResponse, null, 2)}</pre>
          </div>
        )}
      </div>
      
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Login Test</h2>
        <p><strong>Status:</strong> <span className={adminLoginTest.includes('Failed') ? 'text-red-500' : adminLoginTest.includes('Success') ? 'text-green-500' : 'text-gray-500'}>{adminLoginTest}</span></p>
        
        <button 
          onClick={testAdminLogin}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Admin Login
        </button>
      </div>
    </div>
  )
} 