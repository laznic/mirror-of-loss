import { Canvas } from "@react-three/fiber";
import "./App.css";
import {
  AccumulativeShadows,
  CameraControls,
  Plane,
  RandomizedLight,
} from "@react-three/drei";

import { MirrorScene } from "./scenes/mirror";

function App() {
  return (
    <>
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
        <CameraControls />

        <MirrorScene />

        <AccumulativeShadows
          temporal
          frames={100}
          color="#666"
          colorBlend={2}
          toneMapped={true}
          alphaTest={0.75}
          opacity={2}
          scale={200}
          position={[0, -100, 0]}
        >
          <RandomizedLight
            intensity={Math.PI}
            amount={8}
            radius={10}
            ambient={0.5}
            position={[5, 5, -10]}
            bias={0.001}
          />
        </AccumulativeShadows>
        <Plane
          receiveShadow
          args={[1000, 1000]}
          rotation={[4.737, 0, 0]}
          position={[0, -100, 300]}
        >
          <meshPhongMaterial color={"#8a82a1"} />
        </Plane>
      </Canvas>
    </>
  );
}

export default App;
