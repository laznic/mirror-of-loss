import {
  useTexture,
  Circle,
  MeshReflectorMaterial,
  Sphere,
  MeshTransmissionMaterial,
  MeshDistortMaterial,
} from "@react-three/drei";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, MathUtils } from "three";

import mirror from "../../../assets/mirror.png";
import { RigidBody } from "@react-three/rapier";
import { useSceneContext } from "../../main/context/SceneContext";
import { useLocation } from "wouter";

interface MirrorProps {
  transitionToVoid: boolean;
}

export default function Mirror({ transitionToVoid }: MirrorProps) {
  const texture = useTexture(mirror);
  const sphereRef = useRef(null);
  const blackSphere = useRef(null);
  const distortRef = useRef(null);
  const { currentScene, setCurrentScene } = useSceneContext();
  const [, setLocation] = useLocation();

  useFrame(() => {
    if (!sphereRef.current) return;
    if (!transitionToVoid) return;

    sphereRef.current.position.z = MathUtils.lerp(
      sphereRef.current.position.z,
      -25,
      0.0025
    );

    if (
      sphereRef.current.position.z <= -25 &&
      sphereRef.current.position.z >= -26 &&
      currentScene !== "void"
    ) {
      blackSphere.current.visible = true;

      setTimeout(() => {
        // Can't get the camera working properly without doing a reload
        setCurrentScene("void");
        setLocation("/void");
        window.location.reload();
      }, 1000);
    }
  });

  return (
    <>
      <RigidBody type={"fixed"} position={[0, -1, -90]}>
        <Circle args={[5, 100]}>
          <MeshReflectorMaterial
            map={texture}
            mirror={0.3}
            alphaTest={0.1}
            side={DoubleSide}
          />
        </Circle>

        <Sphere
          args={[35, 100, 20, undefined, undefined, 0, 0.1]}
          position={[0, 0, -34.86]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <MeshTransmissionMaterial
            color={"#443a61"}
            distortion={1}
            temporalDistortion={0.5}
            distortionScale={1}
            chromaticAberration={1}
            anisotropicBlur={0.5}
            roughness={0}
            thickness={0.7}
            transmission={0.95}
          />
        </Sphere>

        <Sphere
          ref={sphereRef}
          args={[30, 100, 20, undefined, undefined, 0, 0.1]}
          position={[0, 0, -32]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <MeshDistortMaterial
            ref={distortRef}
            color={"#443a61"}
            distort={0.1}
            roughness={0}
            thickness={0.1}
            transmission={0.95}
            side={DoubleSide}
          />
        </Sphere>
      </RigidBody>
      <Sphere
        ref={blackSphere}
        visible={false}
        args={[2]}
        position={[0, -1.5, -85]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshLambertMaterial color={"#000"} side={DoubleSide} />
      </Sphere>
    </>
  );
}
