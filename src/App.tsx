import { Canvas } from "@react-three/fiber";
import "./App.css";
import Mirror from "./scenes/mirror/components/Mirror";
import { CameraControls } from "@react-three/drei";

function App() {
  return (
    <Canvas flat linear style={{ width: "100%", height: "100%" }}>
      <ambientLight color={"#ffcc00"} />
      <directionalLight
        intensity={5}
        color={"#fff"}
        position={[-2, 1.5, 0.25]}
      />
      <CameraControls />
      <Mirror />
    </Canvas>
  );
}

export default App;
