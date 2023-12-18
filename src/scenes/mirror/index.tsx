import {
  Box,
  Cloud,
  Cylinder,
  Html,
  MeshReflectorMaterial,
  Plane,
  Sphere,
  useTexture,
  Text,
} from "@react-three/drei";
import MemoryBlobs from "./components/MemoryBlobs";
import Mirror from "./components/Mirror";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import Controller from "ecctrl";

import Flooring from "../../assets/flooring.png";
import WallDecor from "../../assets/walldecor.png";
import WallDecorBack from "../../assets/walldecor-back.png";
import WallDecorBack2 from "../../assets/walldecor-back-2.png";
import FancyWall from "../../assets/fancy-wall.png";
import Step from "../../assets/step.png";
import Platform from "../../assets/platform.png";
import RedactionRegular from "../../assets/Redaction-Regular.otf";

import { DoubleSide, Object3D, RepeatWrapping } from "three";
import SidePillar from "./components/SidePillar";
import Arc from "./components/Arc";
import Wall from "./components/Wall";
import Entrance from "./components/Entrance";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import supabase from "../../supabase";

export function MirrorScene() {
  const flooring = useTexture(Flooring);
  const wallDecor = useTexture(WallDecor);
  const wallDecorBack = useTexture(WallDecorBack);
  const wallDecorBack2 = useTexture(WallDecorBack2);
  const step = useTexture(Step);
  const platform = useTexture(Platform);
  const fancyWall = useTexture(FancyWall);
  const inputRef = useRef(null);
  const [askForMemories, setAskForMemories] = useState(false);
  const [transitionToVoid, setTransitionToVoid] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const textRef = useRef(null);

  flooring.wrapS = RepeatWrapping;
  flooring.wrapT = RepeatWrapping;
  flooring.repeat.set(5, 20);

  wallDecorBack.wrapS = RepeatWrapping;
  wallDecorBack.wrapT = RepeatWrapping;
  wallDecorBack.repeat.set(1, 1);

  fancyWall.wrapS = RepeatWrapping;
  fancyWall.wrapT = RepeatWrapping;
  fancyWall.repeat.set(4, 4);

  useFrame(({ clock }, delta) => {
    if (askForMemories) {
      inputRef.current.focus();
    }

    const interval = 1 / 100;

    if ((clock.getElapsedTime() / delta) % (1 - interval) <= interval) {
      if (textRef.current && !generated) {
        if (textRef.current.text.includes("...")) {
          textRef.current.text =
            "You focus on the memory, \n and embrace the void.";
        } else {
          textRef.current.text += ".";
        }
      }
    }
  });

  useEffect(() => {
    return () => {
      document.exitPointerLock();
    };
  }, []);

  return (
    <group
      onPointerDown={() =>
        document.getElementsByTagName("canvas")[0].requestPointerLock()
      }
    >
      <Physics gravity={[0, -30, 0]}>
        {/* @ts-expect-error the export is slightly broken in TypeScript so just disabling the TS check here */}
        <Controller
          characterInitDir={9.5}
          camInitDir={{ x: 0, y: 9.5, z: 0 }}
          camInitDis={-0.01}
          camMinDis={-0.01}
          camFollowMult={100}
          autoBalance={false}
          camMaxDis={-0.01}
          sprintMult={2}
          maxVelLimit={askForMemories ? 0 : 20}
          jumpVel={askForMemories ? 0 : undefined}
        >
          <Sphere>
            <meshStandardMaterial transparent opacity={0} />
          </Sphere>
        </Controller>

        <group position={[0, 0, -40]}>
          {/* floor */}
          <RigidBody type="fixed" colliders={false}>
            <mesh receiveShadow position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
              <planeGeometry args={[22, 100]} />
              <meshStandardMaterial map={flooring} side={DoubleSide} />
            </mesh>
            <CuboidCollider args={[1000, 2, 50]} position={[0, -2, 0]} />
          </RigidBody>

          <Plane args={[22, 100]} position={[0, -50, -50]}>
            <meshStandardMaterial map={flooring} side={DoubleSide} />
          </Plane>

          <Cloud
            color={"#0c0a17"}
            scale={[1, 1.5, 1]}
            position={[-10, 1, 5]}
            volume={20}
            fade={150}
            speed={0.2}
          />

          <Cloud
            color={"#0c0a17"}
            scale={[1, 1.5, 1]}
            position={[10, 1, 5]}
            volume={20}
            fade={150}
            speed={0.2}
          />

          {generating && !generated ? (
            <Text
              ref={textRef}
              font={RedactionRegular}
              position={[0, -1.5, -89.5]}
              textAlign="center"
              color={"#eab5ff"}
              fontSize={0.2}
            >
              {"You focus on the memory, \n and embrace the void."}
            </Text>
          ) : !generated ? (
            <>
              <Text
                font={RedactionRegular}
                position={[0, -1, -89.5]}
                textAlign="center"
                color={"#eab5ff"}
                fontSize={0.3}
              >
                {"Which memory will you \n give to the mirror?"}
              </Text>

              <Text
                font={RedactionRegular}
                position={[0, -2.3, -89.5]}
                textAlign="center"
                color={"#eab5ff"}
                fontSize={0.125}
              >
                {"Press Enter to succumb to Shar's embrace"}
              </Text>
            </>
          ) : null}

          <Html center position={[0, -1.95, -88]}>
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                setGenerating(true);

                const data = new FormData(e.target);
                const input = data.get("memory");

                const { data: responseData } = await supabase.functions.invoke(
                  "generate-memories",
                  {
                    body: {
                      input,
                      playerId: localStorage.getItem("uuid"),
                    },
                  }
                );

                setGenerated(true);

                if (responseData) {
                  setTimeout(() => {
                    setTransitionToVoid(true);
                  }, 8000);
                }
              }}
            >
              <input
                className="memory-input"
                name="memory"
                style={{
                  display: !askForMemories || generating ? "none" : undefined,
                }}
                ref={inputRef}
                type="text"
                placeholder="Think of a memory..."
              />
            </form>
          </Html>

          <Mirror transitionToVoid={transitionToVoid} />

          <RigidBody type={"fixed"} position={[0, -0.5, -52.5]}>
            <Box args={[5, 1, 2]} position={[0, 0, 1.5]}>
              <meshLambertMaterial map={step} />
            </Box>
            <Box args={[5, 1, 2]} position={[0, -0.3, -0.5]}>
              <meshLambertMaterial map={step} />
            </Box>
            <Box args={[5, 1, 2]} position={[0, -0.6, -2.5]}>
              <meshLambertMaterial map={step} />
            </Box>
            <Box args={[5, 1, 2]} position={[0, -0.9, -4.5]}>
              <meshLambertMaterial map={step} />
            </Box>
            <Box args={[5, 1, 2]} position={[0, -1.2, -6.5]}>
              <meshLambertMaterial map={step} />
            </Box>
            <Box args={[5, 1, 2]} position={[0, -1.4, -8.5]}>
              <meshLambertMaterial map={step} />
            </Box>
            <Box args={[5, 1, 2]} position={[0, -1.6, -10.5]}>
              <meshLambertMaterial map={step} />
            </Box>
            <Box args={[5, 1, 2]} position={[0, -1.8, -12.5]}>
              <meshLambertMaterial map={step} />
            </Box>
            <Box args={[5, 1, 2]} position={[0, -2.0, -14.5]}>
              <meshLambertMaterial map={step} />
            </Box>
            <Box args={[5, 1, 2]} position={[0, -2.2, -16.5]}>
              <meshLambertMaterial map={step} />
            </Box>
            <Box args={[5, 1, 2]} position={[0, -2.4, -18.5]}>
              <meshLambertMaterial map={step} />
            </Box>
            <Box args={[5, 1, 2]} position={[0, -2.6, -20.5]}>
              <meshLambertMaterial map={step} />
            </Box>
            <Box args={[5, 1, 2]} position={[0, -2.8, -22.5]}>
              <meshLambertMaterial map={step} />
            </Box>
            <Box args={[5, 1, 2]} position={[0, -3, -24.5]}>
              <meshLambertMaterial map={step} />
            </Box>
            <Box args={[5, 1, 2]} position={[0, -3.2, -26.5]}>
              <meshLambertMaterial map={step} />
            </Box>

            <Cylinder
              name={"cylinder"}
              args={[10, 1, 5, 32]}
              position={[0, -5.5, -32.5]}
            >
              <MeshReflectorMaterial map={platform} mirror={0.5} />
            </Cylinder>
          </RigidBody>

          <RigidBody
            type={"fixed"}
            position={[0, -3.5, -85.5]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <Plane args={[4, 3]}>
              <meshStandardMaterial transparent opacity={0} />
            </Plane>

            <CuboidCollider
              args={[2, 2, 1]}
              sensor
              onIntersectionEnter={() => setAskForMemories(true)}
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

          <Plane
            args={[23, 40]}
            position={[0, 18.5, -22]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshLambertMaterial map={wallDecorBack2} />
          </Plane>

          <Plane args={[20, 300]} position={[21, 0, -22]}>
            <meshLambertMaterial color={"#000"} />
          </Plane>
          <Plane args={[20, 300]} position={[-21, 0, -22]}>
            <meshLambertMaterial color={"#000"} />
          </Plane>

          <Plane args={[100, 30]} position={[-21, 35, -22]}>
            <meshLambertMaterial color={"#000"} />
          </Plane>

          <Wall position={[11, 7.79, -25]} />
          <Wall position={[-11, 7.79, -25]} />
        </group>
      </Physics>
    </group>
  );
}
