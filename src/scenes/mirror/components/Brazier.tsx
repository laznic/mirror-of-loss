import {
  Billboard,
  MeshReflectorMaterial,
  Plane,
  useTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { DoubleSide, Vector3Tuple } from "three";
import brazier from "../../../assets/brazier-animated.png";

interface BrazierProps {
  position: Vector3Tuple;
  rotation?: Vector3Tuple;
}

export default function Brazier({ position, rotation }: BrazierProps) {
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
    <Billboard position={position}>
      <Plane args={[4, 3]} rotation={rotation}>
        <MeshReflectorMaterial
          map={texture}
          mirror={0.1}
          alphaTest={0.5}
          side={DoubleSide}
        />
      </Plane>
    </Billboard>
  );
}
