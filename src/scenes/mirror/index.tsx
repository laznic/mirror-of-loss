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
            <meshStandardMaterial color="#2a2738" />
          </mesh>
          <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]} />
        </RigidBody>

        <Mirror />

        <Player />

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
      </Physics>
    </>
  );
}
