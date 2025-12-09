import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Milestone {
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  order_index: number;
}

interface PaktData {
  name?: string;
  description?: string;
  category?: string;
  targetDate?: string;
  milestones: Milestone[];
  reminderEnabled: boolean;
  reminderFrequency?: 'daily' | 'weekly' | 'custom';
  reminderTime?: string;
}

interface PaktCreationContextType {
  paktData: PaktData;
  updatePaktData: (updates: Partial<PaktData>) => void;
  resetPaktData: () => void;
}

const initialPaktData: PaktData = {
  milestones: [],
  reminderEnabled: false,
};

const PaktCreationContext = createContext<PaktCreationContextType | undefined>(undefined);

export function PaktCreationProvider({ children }: { children: ReactNode }) {
  const [paktData, setPaktData] = useState<PaktData>(initialPaktData);

  const updatePaktData = (updates: Partial<PaktData>) => {
    setPaktData(prev => ({ ...prev, ...updates }));
  };

  const resetPaktData = () => {
    setPaktData(initialPaktData);
  };

  return (
    <PaktCreationContext.Provider value={{ paktData, updatePaktData, resetPaktData }}>
      {children}
    </PaktCreationContext.Provider>
  );
}

export function usePaktCreation() {
  const context = useContext(PaktCreationContext);
  if (!context) {
    throw new Error('usePaktCreation must be used within PaktCreationProvider');
  }
  return context;
}

