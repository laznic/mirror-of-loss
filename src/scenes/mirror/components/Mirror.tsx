import {
  useTexture,
  Circle,
  MeshReflectorMaterial,
  Sphere,
} from "@react-three/drei";

import { Depth, Displace, Fresnel, LayerMaterial } from "lamina";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";

import mirror from "../../../assets/mirror.png";

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
    <group>
      <Circle args={[75, 75]} position={[0, 0, 0]}>
        <MeshReflectorMaterial map={texture} mirror={0.1} alphaTest={0.5} />
      </Circle>
    </group>
  );
}
