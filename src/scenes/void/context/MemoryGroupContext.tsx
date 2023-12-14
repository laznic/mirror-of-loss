import { ReactNode, createContext, useContext, useState } from "react";

interface MemoryGroupContext {
  currentGroup: number | null;
  showBlobsForGroup: (id: number | null) => void;
}

export const MemoryGroupContext = createContext<MemoryGroupContext>({
  currentGroup: null,
  showBlobsForGroup: () => {},
});

interface MemoryGroupContextProviderProps {
  children: ReactNode;
}

export default function MemoryGroupContextProvider({
  children,
}: MemoryGroupContextProviderProps) {
  const [currentGroup, setCurrentGroup] = useState<number | null>(null);

  return (
    <MemoryGroupContext.Provider
      value={{ currentGroup, showBlobsForGroup: setCurrentGroup }}
    >
      {children}
    </MemoryGroupContext.Provider>
  );
}

export function useMemoryGroupContext() {
  return useContext(MemoryGroupContext);
}
