import { Box, Cloud, Plane, Sphere, useTexture } from "@react-three/drei";
import Brazier from "./components/Brazier";
import MemoryBlobs from "./components/MemoryBlobs";
import Mirror from "./components/Mirror";
import Pillar from "./components/Pillar";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import Controller from "ecctrl";

import Flooring from "../../assets/flooring.png";
import WallDecor from "../../assets/walldecor.png";
import WallDecorBack from "../../assets/walldecor-back.png";

import { RepeatWrapping } from "three";
import SidePillar from "./components/SidePillar";
import Arc from "./components/Arc";
import Wall from "./components/Wall";
import Entrance from "./components/Entrance";

export function MirrorScene() {
  const flooring = useTexture(Flooring);
  const wallDecor = useTexture(WallDecor);
  const wallDecorBack = useTexture(WallDecorBack);

  flooring.wrapS = RepeatWrapping;
  flooring.wrapT = RepeatWrapping;
  flooring.repeat.set(240, 240);

  wallDecorBack.wrapS = RepeatWrapping;
  wallDecorBack.wrapT = RepeatWrapping;
  wallDecorBack.repeat.set(1, 1);

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

        {/* floor */}
        <RigidBody type="fixed" colliders={false}>
          <mesh receiveShadow position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial map={flooring} />
          </mesh>
          <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]} />
        </RigidBody>

        <Cloud position={[0, 1, 20]} volume={10} fade={200} speed={0.2} />

        <Mirror />

        <MemoryBlobs />

        <Entrance position={[0, 6.35, 0]} />

        <Arc position={[0, 0, 0]} />
        <Arc position={[0, 0, -11.7]} />
        <Arc position={[0, 0, -24]} />
        <Arc position={[0, 0, -36]} />

        <SidePillar position={[-10, 0, -10]} />
        <SidePillar brazierFlipped position={[10, 0, -10]} />

        <SidePillar position={[-10, 0, -34.1]} />
        <SidePillar brazierFlipped position={[10, 0, -34.1]} />

        <Plane
          args={[5, 5]}
          position={[-10.7, 6, -22]}
          rotation={[0, 1.57079, 0]}
        >
          <meshLambertMaterial map={wallDecor} />
        </Plane>

        <Plane
          args={[5, 5]}
          position={[10.7, 6, -22]}
          rotation={[0, -1.57079, 0]}
        >
          <meshLambertMaterial map={wallDecor} />
        </Plane>

        <Box args={[0.5, 5.5, 5.5]} position={[11, 6, -22]}>
          <meshLambertMaterial map={wallDecorBack} />
        </Box>

        <Box args={[0.5, 5.5, 5.5]} position={[-11, 6, -22]}>
          <meshLambertMaterial map={wallDecorBack} />
        </Box>

        <Wall position={[11, 8.5, -25]} />
        <Wall position={[-11, 8.5, -25]} />
      </Physics>
    </>
  );
}
