import { Canvas } from "@react-three/fiber";
import "./App.css";
import { KeyboardControls } from "@react-three/drei";

// import { MirrorScene } from "./scenes/mirror";
import VoidScene from "./scenes/void";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    if (!localStorage.getItem("uuid")) {
      localStorage.setItem("uuid", window.crypto.randomUUID());
    }
  }, []);

  return (
    <>
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
          { name: "jump", keys: ["Space"] },
          { name: "crouch", keys: ["ControlLeft", "ControlRight", "c", "C"] },
        ]}
      >
        <Canvas
          camera={{ fov: 90 }}
          shadows
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight color={"#fff"} />

          {/* <fog color="#000" attach="fog" near={50} far={700} /> */}
          <directionalLight
            intensity={5}
            color={"#fff"}
            position={[-3, 1.5, 3]}
          />

          <VoidScene />
          {/* <MirrorScene /> */}
        </Canvas>
      </KeyboardControls>
    </>
  );
}

export default App;
