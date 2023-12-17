import { Plane, useTexture } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { DoubleSide, Vector3Tuple } from "three";
import ArcTexture from "../../../assets/arc.png";

interface ArcProps {
  position: Vector3Tuple;
}

export default function Arc({ position }: ArcProps) {
  const arc = useTexture(ArcTexture);

  return (
    <RigidBody type={"fixed"} colliders={false} position={position}>
      <Plane args={[25, 20]} position={[0, 9, -4.2]} castShadow>
        <meshLambertMaterial map={arc} alphaTest={1} side={DoubleSide} />
      </Plane>
      <CuboidCollider args={[1, 5, 0.25]} position={[-9.5, 5, -4.2]} />
      <CuboidCollider args={[1, 5, 0.25]} position={[-5.5, 5, -4.2]} />
      <CuboidCollider args={[1, 5, 0.25]} position={[9.5, 5, -4.2]} />
      <CuboidCollider args={[1, 5, 0.25]} position={[5.5, 5, -4.2]} />
    </RigidBody>
  );
}
