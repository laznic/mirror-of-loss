import { Plane, useTexture } from "@react-three/drei";
import { DoubleSide, Vector3Tuple } from "three";
import EntranceTexture from "../../../assets/entrance.png";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

interface EntranceProps {
  position: Vector3Tuple;
}

export default function Entrance({ position }: EntranceProps) {
  const entrance = useTexture(EntranceTexture);

  return (
    <RigidBody type={"fixed"} colliders={false}>
      <Plane args={[22.2, 22.2]} position={position}>
        <meshLambertMaterial map={entrance} alphaTest={0.1} side={DoubleSide} />
      </Plane>

      <CuboidCollider args={[3.5, 5, 0.1]} position={[-7.5, 0, 0]} />
      <CuboidCollider args={[3.5, 5, 0.1]} position={[7.5, 0, 0]} />
    </RigidBody>
  );
}
