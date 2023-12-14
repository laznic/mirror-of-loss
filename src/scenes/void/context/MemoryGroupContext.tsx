import { ReactNode, createContext, useContext, useState } from "react";

interface MemoryGroupContext {
  currentGroup: number | null;
  setCurrentGroup: (id: number | null) => void;
}

export const MemoryGroupContext = createContext<MemoryGroupContext>({
  currentGroup: null,
  setCurrentGroup: () => {},
});

interface MemoryGroupContextProviderProps {
  children: ReactNode;
}

export default function MemoryGroupContextProvider({
  children,
}: MemoryGroupContextProviderProps) {
  const [currentGroup, setCurrentGroup] = useState<number | null>(null);

  return (
    <MemoryGroupContext.Provider value={{ currentGroup, setCurrentGroup }}>
      {children}
    </MemoryGroupContext.Provider>
  );
}

export function useMemoryGroupContext() {
  return useContext(MemoryGroupContext);
}
