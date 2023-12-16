import { Plane, useTexture } from "@react-three/drei";
import Pillar from "./Pillar";
import PillarWithStep from "../../../assets/pillar-with-step.png";
import Brazier from "./Brazier";
import { DoubleSide, Vector3Tuple } from "three";

interface SidePillarProps {
  position: Vector3Tuple;
  hideRightPillar?: boolean;
  brazierFlipped?: boolean;
}

export default function SidePillar({
  position,
  hideRightPillar,
  brazierFlipped,
}: SidePillarProps) {
  const pillarWithStep = useTexture(PillarWithStep);

  return (
    <group position={position}>
      <Plane args={[12, 12]} position={[0, 4.75, 0]} rotation={[0, 1.55, 0]}>
        <meshLambertMaterial
          map={pillarWithStep}
          alphaTest={0.1}
          side={DoubleSide}
        />
      </Plane>

      {!hideRightPillar && <Pillar position={[0, 6.9, -5.65]} />}

      <Pillar position={[0, 6.9, 5.5]} />

      <Brazier position={[0.7 * (brazierFlipped ? 1 : -1), 2.22, 0]} />
    </group>
  );
}
