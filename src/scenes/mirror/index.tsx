import { PointerLockControls } from "@react-three/drei";
import Brazier from "./components/Brazier";
import MemoryBlobs from "./components/MemoryBlobs";
import Mirror from "./components/Mirror";
import Pillar from "./components/Pillar";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import Player from "./components/Player";

export function MirrorScene() {
  return (
    <>
      <PointerLockControls />
      <Physics gravity={[0, -30, 0]}>
        <RigidBody type="fixed" colliders={false}>
          <mesh receiveShadow position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial color="green" />
          </mesh>
          <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]} />
        </RigidBody>

        <Mirror />

        <Player />

        <MemoryBlobs />

        <Pillar position={[-100, 0, 0]} />
        <Pillar position={[-100, 0, 100]} />
        <Pillar position={[-100, 0, 200]} />
        <Pillar position={[100, 0, 0]} />
        <Pillar position={[100, 0, 100]} />
        <Pillar position={[100, 0, 200]} />
        <Brazier position={[-50, -65, 0]} />
        <Brazier position={[50, -65, 0]} />
      </Physics>
    </>
  );
}
