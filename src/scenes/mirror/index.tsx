import { Cloud, Plane, Sphere, useTexture } from "@react-three/drei";
import Brazier from "./components/Brazier";
import MemoryBlobs from "./components/MemoryBlobs";
import Mirror from "./components/Mirror";
import Pillar from "./components/Pillar";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import Controller from "ecctrl";
import Entrance from "../../assets/entrance.png";

import { DoubleSide } from "three";
import SidePillar from "./components/SidePillar";

export function MirrorScene() {
  const entrance = useTexture(Entrance);

  return (
    <>
      <Physics gravity={[0, -30, 0]} timeStep={"vary"}>
        {/** @ts-expect-error the export is slightly broken in TypeScript so just disabling the TS check here */}
        <Controller
          camInitDis={-0.01}
          camMinDis={-0.01}
          camFollowMult={100}
          autoBalance={false}
          camMaxDis={-0.01}
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

        <Cloud position={[0, 1, 20]} volume={10} fade={200} speed={0.2} />

        <Mirror />

        <Plane args={[15, 15]} position={[0, 4.3, 0]}>
          <meshLambertMaterial
            map={entrance}
            alphaTest={0.1}
            side={DoubleSide}
          />
        </Plane>

        <MemoryBlobs />

        <SidePillar hideRightPillar position={[-10, 0, -10]} />
        <SidePillar hideRightPillar position={[-10, 0, -21.2]} />
        <SidePillar position={[-10, 0, -32.4]} />

        <SidePillar brazierFlipped hideRightPillar position={[10, 0, -10]} />
        <SidePillar brazierFlipped hideRightPillar position={[10, 0, -21.2]} />
        <SidePillar brazierFlipped position={[10, 0, -32.4]} />
      </Physics>
    </>
  );
}
