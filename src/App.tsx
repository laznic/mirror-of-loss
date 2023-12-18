import { Canvas } from "@react-three/fiber";
import "./App.css";
import { Html, KeyboardControls, Loader } from "@react-three/drei";

import { Suspense, useEffect, useState } from "react";
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
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("uuid")) {
      localStorage.setItem("uuid", window.crypto.randomUUID());
    }
  }, []);

  return (
    <>
      {!start && !localStorage.getItem("memoryGroupId") && (
        <div
          style={{
            position: "fixed",
            zIndex: 1,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <h1>Mirror of Loss</h1>
          <button onClick={() => setStart(true)}>{"Venture forth"}</button>
        </div>
      )}
      <Canvas
        shadows
        style={{ width: "100%", height: "100%", background: "#000" }}
      >
        {(start || localStorage.getItem("memoryGroupId")) && (
          <KeyboardControls map={keyboardMap}>
            <ambientLight color={"#fff"} />
            <Suspense fallback={null}>
              <SceneContextProvider>
                <MainScene />
              </SceneContextProvider>
            </Suspense>
          </KeyboardControls>
        )}
      </Canvas>
      <Loader />
    </>
  );
}

export default App;
