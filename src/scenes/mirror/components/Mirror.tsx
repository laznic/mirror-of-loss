import {
  useTexture,
  Circle,
  MeshReflectorMaterial,
  Sphere,
  MeshDistortMaterial,
  MeshTransmissionMaterial,
} from "@react-three/drei";

import { Depth, Displace, Fresnel, LayerMaterial } from "lamina";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, MathUtils } from "three";

import mirror from "../../../assets/mirror.png";
import { RigidBody } from "@react-three/rapier";

export default function Mirror() {
  const texture = useTexture(mirror);
  // const displaceRef = useRef(null);

  // useFrame(({ clock }, delta) => {
  //   displaceRef.current.strength = MathUtils.lerp(
  //     displaceRef.current.strength, //
  //     0.05,
  //     0.025
  //   );

  //   displaceRef.current.offset.x += 0.3 * delta;
  // });

  return (
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
    </RigidBody>
  );
}
