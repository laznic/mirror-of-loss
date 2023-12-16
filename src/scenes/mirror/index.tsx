import { KeyboardControls, Sphere } from "@react-three/drei";
import Brazier from "./components/Brazier";
import MemoryBlobs from "./components/MemoryBlobs";
import Mirror from "./components/Mirror";
import Pillar from "./components/Pillar";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import Controller from "ecctrl";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "w", "W"] },
  { name: "backward", keys: ["ArrowDown", "s", "S"] },
  { name: "leftward", keys: ["ArrowLeft", "a", "A"] },
  { name: "rightward", keys: ["ArrowRight", "d", "D"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
  { name: "crouch", keys: ["c", "C"] },
];

export function MirrorScene() {
  return (
    <>
      <Physics gravity={[0, -30, 0]} timeStep={"vary"}>
        <KeyboardControls map={keyboardMap}>
          {/** @ts-expect-error the export is slightly broken in TypeScript so just disabling the TS check here */}
          <Controller
            camInitDis={-0.01}
            camMinDis={-0.01}
            camFollowMult={100}
            autoBalance={false}
          >
            <Sphere />
          </Controller>

          <RigidBody type="fixed" colliders={false}>
            <mesh receiveShadow position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
              <planeGeometry args={[1000, 1000]} />
              <meshStandardMaterial color="#2a2738" />
            </mesh>
            <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]} />
          </RigidBody>

          <Mirror />

          <MemoryBlobs />

          <Pillar position={[-10, 6.9, 0]} />
          <Pillar position={[-10, 6.9, 10]} />
          <Pillar position={[-10, 6.9, 20]} />
          <Pillar position={[10, 6.9, 0]} />
          <Pillar position={[10, 6.9, 10]} />
          <Pillar position={[10, 6.9, 20]} />

          <Brazier position={[10, 1.2, 5.5]} />
          <Brazier position={[-10, 1.2, 5.5]} />
          <Brazier position={[10, 1.2, 15.5]} />
          <Brazier position={[-10, 1.2, 15.5]} />
          <Brazier position={[10, 1.2, 25.5]} />
          <Brazier position={[-10, 1.2, 25.5]} />
        </KeyboardControls>
      </Physics>
    </>
  );
}
