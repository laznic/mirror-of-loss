import { Billboard, SpriteAnimator } from "@react-three/drei";
import { Vector3Tuple } from "three";
import brazier from "../../../assets/brazier-animated.png";

interface BrazierProps {
  position: Vector3Tuple;
}

export default function Brazier({ position }: BrazierProps) {
  return (
    <Billboard position={position}>
      <pointLight intensity={50} position={[0, 1, 0.1]} castShadow />
      <SpriteAnimator
        autoPlay
        startFrame={0}
        loop
        numberOfFrames={5}
        scale={3}
        textureImageURL={brazier}
      />
    </Billboard>
  );
}
