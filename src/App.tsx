import { Canvas } from "@react-three/fiber";
import "./App.css";
import {
  AccumulativeShadows,
  CameraControls,
  KeyboardControls,
  Plane,
  RandomizedLight,
} from "@react-three/drei";

import { MirrorScene } from "./scenes/mirror";
import VoidScene from "./scenes/void";

function App() {
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
          camera={{ position: [0, 0.5, 20], fov: 90 }}
          shadows
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight />
          <color attach={"background"} args={["#000"]} />
          <fog color="#000" attach="fog" near={50} far={700} />
          <directionalLight
            intensity={5}
            color={"#fff"}
            position={[-3, 1.5, 3]}
          />

          {/* <CameraControls /> */}
          <VoidScene />
          <MirrorScene />

          <Plane
            receiveShadow
            args={[1000, 1000]}
            rotation={[4.737, 0, 0]}
            position={[0, -100, 300]}
          >
            <meshPhongMaterial color={"#8a82a1"} />
          </Plane>
        </Canvas>
      </KeyboardControls>
    </>
  );
}

export default App;
