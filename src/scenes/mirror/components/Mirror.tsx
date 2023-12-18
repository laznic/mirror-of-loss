import {
  useTexture,
  Circle,
  MeshReflectorMaterial,
  Sphere,
  MeshTransmissionMaterial,
  MeshDistortMaterial,
  Plane,
} from "@react-three/drei";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, MathUtils } from "three";

import MirrorTexture from "../../../assets/mirror.png";
import Helmet from "../../../assets/helmet.png";
import { RigidBody } from "@react-three/rapier";
import { useSceneContext } from "../../main/context/SceneContext";

interface MirrorProps {
  transitionToVoid: boolean;
}

export default function Mirror({ transitionToVoid }: MirrorProps) {
  const texture = useTexture(MirrorTexture);
  const helmet = useTexture(Helmet);
  const sphereRef = useRef(null);
  const blackSphere = useRef(null);
  const distortRef = useRef(null);
  const { currentScene, setCurrentScene } = useSceneContext();

  useFrame(() => {
    if (!sphereRef.current) return;
    if (!transitionToVoid) return;

    sphereRef.current.position.z = MathUtils.lerp(
      sphereRef.current.position.z,
      -25,
      0.02
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
        window.location.href = "/void";
      }, 1000);
    }
  });

  return (
    <>
      <pointLight intensity={10} decay={2} position={[0, 4, -89]} />
      <pointLight intensity={20} decay={1.5} position={[8, -2, -85]} />
      <pointLight intensity={20} decay={1.5} position={[-8, -2, -85]} />
      <pointLight intensity={20} decay={1.5} position={[0, -2, -87]} />

      <RigidBody type={"fixed"} position={[0, -1, -90]}>
        <Plane args={[10, 10]} position={[0, 3.2, 0.1]}>
          <MeshReflectorMaterial
            map={helmet}
            mirror={0.1}
            alphaTest={1}
            side={DoubleSide}
          />
        </Plane>

        <Circle args={[5, 100]}>
          <MeshReflectorMaterial
            map={texture}
            mirror={0.1}
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
          visible={transitionToVoid}
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
