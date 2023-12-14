import { Box, useTexture } from "@react-three/drei";
import { Vector3Tuple } from "three";
import pillar from "../../../assets/pillar.png";

interface PillarProps {
  position: Vector3Tuple;
}

export default function Pillar({ position }: PillarProps) {
  const texture = useTexture(pillar);

  return (
    <Box args={[2, 14, 2]} position={position}>
      <meshLambertMaterial map={texture} alphaTest={0} />
    </Box>
  );
}
