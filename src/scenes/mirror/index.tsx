import {
  Box,
  Cloud,
  Cylinder,
  Plane,
  Sphere,
  useTexture,
} from "@react-three/drei";
import Brazier from "./components/Brazier";
import MemoryBlobs from "./components/MemoryBlobs";
import Mirror from "./components/Mirror";
import Pillar from "./components/Pillar";
import {
  ConvexHullCollider,
  CuboidCollider,
  CylinderCollider,
  Physics,
  RigidBody,
} from "@react-three/rapier";
import Controller from "ecctrl";

import Flooring from "../../assets/flooring.png";
import WallDecor from "../../assets/walldecor.png";
import WallDecorBack from "../../assets/walldecor-back.png";
import FancyWall from "../../assets/fancy-wall.png";

import { DoubleSide, RepeatWrapping } from "three";
import SidePillar from "./components/SidePillar";
import Arc from "./components/Arc";
import Wall from "./components/Wall";
import Entrance from "./components/Entrance";

export function MirrorScene() {
  const flooring = useTexture(Flooring);
  const wallDecor = useTexture(WallDecor);
  const wallDecorBack = useTexture(WallDecorBack);
  const fancyWall = useTexture(FancyWall);

  flooring.wrapS = RepeatWrapping;
  flooring.wrapT = RepeatWrapping;
  flooring.repeat.set(240, 20);

  wallDecorBack.wrapS = RepeatWrapping;
  wallDecorBack.wrapT = RepeatWrapping;
  wallDecorBack.repeat.set(1, 1);

  fancyWall.wrapS = RepeatWrapping;
  fancyWall.wrapT = RepeatWrapping;
  fancyWall.repeat.set(4, 4);

  return (
    <>
      <Physics gravity={[0, -30, 0]} timeStep={"vary"} debug>
        {/** @ts-expect-error the export is slightly broken in TypeScript so just disabling the TS check here */}
        <Controller
          camInitDis={-0.01}
          camMinDis={-0.01}
          camFollowMult={100}
          autoBalance={false}
          camMaxDis={-0.01}
          sprintMult={6}
        >
          <Sphere />
        </Controller>

        {/* floor */}
        <RigidBody type="fixed" colliders={false}>
          <mesh receiveShadow position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[1000, 100]} />
            <meshStandardMaterial map={flooring} />
          </mesh>
          <CuboidCollider args={[1000, 2, 50]} position={[0, -2, 0]} />
        </RigidBody>

        <Cloud position={[0, 1, 20]} volume={10} fade={200} speed={0.2} />

        <Mirror />

        <RigidBody type={"fixed"} position={[0, -0.5, -52.5]}>
          <Box args={[5, 1, 2]} position={[0, 0, 1.5]}>
            <meshStandardMaterial color={"#000000"} />
          </Box>
          <Box args={[5, 1, 2]} position={[0, -0.3, -0.5]}>
            <meshStandardMaterial color={"#000000"} />
          </Box>
          <Box args={[5, 1, 2]} position={[0, -0.6, -2.5]}>
            <meshStandardMaterial color={"#000000"} />
          </Box>
          <Box args={[5, 1, 2]} position={[0, -0.9, -4.5]}>
            <meshStandardMaterial color={"#000000"} />
          </Box>
          <Box args={[5, 1, 2]} position={[0, -1.2, -6.5]}>
            <meshStandardMaterial color={"#000000"} />
          </Box>
          <Box args={[5, 1, 2]} position={[0, -1.4, -8.5]}>
            <meshStandardMaterial color={"#000000"} />
          </Box>
          <Box args={[5, 1, 2]} position={[0, -1.6, -10.5]}>
            <meshStandardMaterial color={"#000000"} />
          </Box>
          <Box args={[5, 1, 2]} position={[0, -1.8, -12.5]}>
            <meshStandardMaterial color={"#000000"} />
          </Box>
          <Box args={[5, 1, 2]} position={[0, -2.0, -14.5]}>
            <meshStandardMaterial color={"#000000"} />
          </Box>
          <Box args={[5, 1, 2]} position={[0, -2.2, -16.5]}>
            <meshStandardMaterial color={"#000000"} />
          </Box>
          <Box args={[5, 1, 2]} position={[0, -2.4, -18.5]}>
            <meshStandardMaterial color={"#000000"} />
          </Box>
          <Box args={[5, 1, 2]} position={[0, -2.6, -20.5]}>
            <meshStandardMaterial color={"#000000"} />
          </Box>
          <Box args={[5, 1, 2]} position={[0, -2.8, -22.5]}>
            <meshStandardMaterial color={"#000000"} />
          </Box>
          <Box args={[5, 1, 2]} position={[0, -3, -24.5]}>
            <meshStandardMaterial color={"#000000"} />
          </Box>
          <Box args={[5, 1, 2]} position={[0, -3.2, -26.5]}>
            <meshStandardMaterial color={"#000000"} />
          </Box>

          <Cylinder args={[10, 1, 5, 32]} position={[0, -5.5, -32.5]}>
            <meshStandardMaterial color={"#000000"} />
          </Cylinder>
        </RigidBody>

        <RigidBody position={[0, -3.5, -85.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <Plane args={[4, 3]}>
            <meshStandardMaterial transparent opacity={0} />
          </Plane>

          <CuboidCollider
            args={[2, 2, 1]}
            sensor
            onIntersectionEnter={() => console.log("ask for memories")}
          />
        </RigidBody>

        <RigidBody
          type={"fixed"}
          position={[2.5, 0, -63.75]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <Plane args={[27.5, 10]}>
            <meshStandardMaterial transparent opacity={0} />
          </Plane>
        </RigidBody>

        <RigidBody
          type={"fixed"}
          position={[-2.5, 0, -63.75]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <Plane args={[27.5, 10]}>
            <meshStandardMaterial transparent opacity={0} />
          </Plane>
        </RigidBody>

        <RigidBody position={[0, -5.5, -85.1]} colliders={false}>
          <Cylinder args={[10, 10, 20, 32, undefined, true, 0.25, 5.75]}>
            <meshStandardMaterial transparent opacity={0} />
          </Cylinder>
          {/* <ConvexHullCollider args={[[10, 10, 10]]} /> */}
        </RigidBody>

        <Cylinder
          args={[40, 40, -200, undefined, 64, true, 0.28, 5.72]}
          position={[0, 0, -88.4]}
        >
          <meshLambertMaterial map={fancyWall} />
        </Cylinder>

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
