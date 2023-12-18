import { Canvas } from "@react-three/fiber";
import "./App.css";
import {
  KeyboardControls,
  MeshPortalMaterial,
  RoundedBox,
} from "@react-three/drei";

import { MirrorScene } from "./scenes/mirror";
import VoidScene from "./scenes/void";
import { useEffect } from "react";
import { DoubleSide } from "three";
import MainScene from "./scenes/main";
import SceneContextProvider from "./scenes/main/context/SceneContext";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "w", "W"] },
  { name: "backward", keys: ["ArrowDown", "s", "S"] },
  { name: "leftward", keys: ["ArrowLeft", "a", "A"] },
  { name: "rightward", keys: ["ArrowRight", "d", "D"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
  { name: "crouch", keys: ["c", "C"] },
];

function App() {
  useEffect(() => {
    if (!localStorage.getItem("uuid")) {
      localStorage.setItem("uuid", window.crypto.randomUUID());
    }
  }, []);

  return (
    <>
      <Canvas
        shadows
        style={{ width: "100%", height: "100%", background: "#000" }}
      >
        <KeyboardControls map={keyboardMap}>
          <ambientLight color={"#fff"} />

          <fog color="#000" attach="fog" near={1} far={120} />
          {/* <directionalLight
            intensity={5}
            color={"#fff"}
            position={[-3, 1.5, 3]}
          /> */}
          <SceneContextProvider>
            <MainScene />
          </SceneContextProvider>
        </KeyboardControls>
      </Canvas>
    </>
  );
}

export default App;
