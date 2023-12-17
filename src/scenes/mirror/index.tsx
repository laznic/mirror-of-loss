import { Box, Cloud, Plane, Sphere, useTexture } from "@react-three/drei";
import Brazier from "./components/Brazier";
import MemoryBlobs from "./components/MemoryBlobs";
import Mirror from "./components/Mirror";
import Pillar from "./components/Pillar";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import Controller from "ecctrl";
import Entrance from "../../assets/entrance.png";
import BasicWall from "../../assets/fancy-wall.png";
import Flooring from "../../assets/flooring.png";
import WallDecor from "../../assets/walldecor.png";
import WallDecorBack from "../../assets/walldecor-back.png";
import Arc from "../../assets/arc.png";

import { DoubleSide, RepeatWrapping } from "three";
import SidePillar from "./components/SidePillar";

export function MirrorScene() {
  const entrance = useTexture(Entrance);
  const basicWall = useTexture(BasicWall);
  const flooring = useTexture(Flooring);
  const wallDecor = useTexture(WallDecor);
  const wallDecorBack = useTexture(WallDecorBack);
  const arc = useTexture(Arc);

  basicWall.wrapS = RepeatWrapping;
  basicWall.wrapT = RepeatWrapping;
  basicWall.repeat.set(3, 0.9);

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

        <Plane args={[15, 15]} position={[0, 4.3, 0]}>
          <meshLambertMaterial
            map={entrance}
            alphaTest={0.1}
            side={DoubleSide}
          />
        </Plane>

        <MemoryBlobs />

        <Plane args={[25, 20]} position={[0, 9, -4.2]}>
          <meshLambertMaterial map={arc} alphaTest={1} side={DoubleSide} />
        </Plane>
        {/* <Plane args={[25, 20]} position={[0, 9, -5.5]}>
          <meshLambertMaterial map={arc} alphaTest={1} side={DoubleSide} />
        </Plane> */}

        <SidePillar position={[-10, 0, -10]} />
        <SidePillar brazierFlipped position={[10, 0, -10]} />
        <Plane args={[25, 20]} position={[0, 9, -15.75]}>
          <meshLambertMaterial map={arc} alphaTest={1} side={DoubleSide} />
        </Plane>
        {/* <Plane args={[25, 20]} position={[0, 9, -16.7]}>
          <meshLambertMaterial map={arc} alphaTest={1} side={DoubleSide} />
        </Plane> */}

        <Plane args={[25, 20]} position={[0, 9, -27.3]}>
          <meshLambertMaterial map={arc} alphaTest={1} side={DoubleSide} />
        </Plane>
        {/* <Plane args={[25, 20]} position={[0, 9, -27.9]}>
          <meshLambertMaterial map={arc} alphaTest={1} side={DoubleSide} />
        </Plane> */}
        {/* <SidePillar hideRightPillar position={[-10, 0, -21.2]} /> */}

        {/* <SidePillar brazierFlipped hideRightPillar position={[10, 0, -21.2]} /> */}

        <SidePillar position={[-10, 0, -33]} />
        <SidePillar brazierFlipped position={[10, 0, -33]} />
        <Plane args={[25, 20]} position={[0, 9, -38.85]}>
          <meshLambertMaterial map={arc} alphaTest={1} side={DoubleSide} />
        </Plane>
        {/* <Plane args={[25, 20]} position={[0, 9, -39.1]}>
          <meshLambertMaterial map={arc} alphaTest={1} side={DoubleSide} />
        </Plane> */}

        <Plane
          args={[50, 20]}
          position={[-11, 8.5, -25]}
          rotation={[0, 1.57079, 0]}
        >
          <meshLambertMaterial map={basicWall} side={DoubleSide} />
        </Plane>

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

        <Plane
          args={[50, 20]}
          position={[11, 8.5, -25]}
          rotation={[0, 1.57079, 0]}
        >
          <meshLambertMaterial map={basicWall} side={DoubleSide} />
        </Plane>
      </Physics>
    </>
  );
}
