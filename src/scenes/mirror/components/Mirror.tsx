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
  const displaceRef = useRef(null);

  useFrame(({ clock }, delta) => {
    displaceRef.current.strength = MathUtils.lerp(
      displaceRef.current.strength, //
      0.05,
      0.025
    );

    displaceRef.current.offset.x += 0.3 * delta;
  });

  return (
    <group>
      <Circle args={[75, 75]} position={[0, 0, 0]}>
        <MeshReflectorMaterial map={texture} mirror={0.1} alphaTest={0.5} />
      </Circle>
      <Sphere
        args={[225, 48, 48, undefined, undefined, 0, 0.25]}
        position={[0, 0, -220]}
        rotation={[1.575, 0, 0]}
      >
        <LayerMaterial
          color={"#fff"}
          lighting={"physical"}
          transmission={2}
          roughness={0.05}
          thickness={5}
        >
          <Depth
            near={0.4854}
            far={0.7661999999999932}
            origin={[-0.4920000000000004, 0.4250000000000003, 0]}
            colorA={"#fec5da"}
            colorB={"#2d1347"}
          />
          <Displace ref={displaceRef} strength={0} scale={0} />
          <Fresnel
            color={"#723ba8"}
            bias={-0.3430000000000002}
            intensity={3.8999999999999946}
            power={3.3699999999999903}
            factor={1.119999999999999}
            mode={"screen"}
          />
        </LayerMaterial>
      </Sphere>
    </group>
  );
}
