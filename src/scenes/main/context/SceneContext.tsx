import { ReactNode, createContext, useContext, useState } from "react";

interface SceneContext {
  currentScene: string;
  setCurrentScene: (name: string) => void;
}

export const SceneContext = createContext<SceneContext>({
  currentScene: "mirror",
  setCurrentScene: () => {},
});

interface SceneContextProviderProps {
  children: ReactNode;
}

export default function SceneContextProvider({
  children,
}: SceneContextProviderProps) {
  const [currentScene, setCurrentScene] = useState("mirror");

  return (
    <SceneContext.Provider value={{ currentScene, setCurrentScene }}>
      {children}
    </SceneContext.Provider>
  );
}

export function useSceneContext() {
  return useContext(SceneContext);
}
