import { useFrame } from "@react-three/fiber";
import { createContext, useContext, useRef, useState } from "react";
import { Vector3 } from "three";

interface CameraContext {
  camPos: Vector3;
  lookAt: Vector3;
  setCamPos: (position: Vector3) => void;
  setLookAt: (position: Vector3) => void;
}

export const CameraContext = createContext<CameraContext>({
  camPos: new Vector3(),
  lookAt: new Vector3(),
  setCamPos: () => {},
  setLookAt: () => {},
});

interface CameraContextProviderProps {
  children: React.ReactNode;
}

export default function CameraContextProvider({
  children,
}: CameraContextProviderProps) {
  const [camPos, setCamPos] = useState(new Vector3(0, 0, 0));
  const [lookAt, setLookAt] = useState(new Vector3(0, 0, 0));

  return (
    <CameraContext.Provider value={{ camPos, lookAt, setCamPos, setLookAt }}>
      {children}
    </CameraContext.Provider>
  );
}

export function useCameraContext() {
  return useContext(CameraContext);
}
