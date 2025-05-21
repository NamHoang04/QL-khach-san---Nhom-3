"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface MockContextType {
  useMockData: boolean;
  toggleMockData: () => void;
}

const MockContext = createContext<MockContextType | undefined>(undefined)

export function MockProvider({ children }: { children: ReactNode }) {
  const [useMockData, setUseMockData] = useState(false)

  const toggleMockData = () => {
    setUseMockData(prev => !prev)
  }

  return (
    <MockContext.Provider value={{ useMockData, toggleMockData }}>
      {children}
    </MockContext.Provider>
  )
}

export function useMock() {
  const context = useContext(MockContext)
  if (context === undefined) {
    throw new Error("useMock must be used within a MockProvider")
  }
  return context
} 