import {
  Billboard,
  MeshReflectorMaterial,
  Plane,
  useTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3Tuple } from "three";
import brazier from "../../../assets/brazier-animated.png";

interface BrazierProps {
  position: Vector3Tuple;
}

export default function Brazier({ position }: BrazierProps) {
  const texture = useTexture(brazier);
  const offset = useRef(0);

  useFrame(({ clock }, delta) => {
    texture.repeat.x = 0.2;

    const interval = 1 / 8;

    if ((clock.getElapsedTime() / delta) % (1 - interval) < interval) {
      texture.offset.set(offset.current, 0);
      offset.current += 0.2;

      if (offset.current === 1) {
        offset.current = 0;
      }
    }
  });

  return (
    <Billboard>
      <Plane args={[50, 40]} position={position}>
        <MeshReflectorMaterial map={texture} mirror={0.1} alphaTest={0.5} />
      </Plane>
    </Billboard>
  );
}
