import { Plane, useTexture } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { DoubleSide, RepeatWrapping, Vector3Tuple } from "three";
import BasicWall from "../../../assets/basic-wall.png";

interface WallProps {
  position: Vector3Tuple;
}

export default function Wall({ position }: WallProps) {
  const basicWall = useTexture(BasicWall);
  basicWall.wrapS = RepeatWrapping;
  basicWall.wrapT = RepeatWrapping;
  basicWall.repeat.set(3, 0.9);

  return (
    <RigidBody type={"fixed"} position={position}>
      <Plane args={[50, 20]} rotation={[0, 1.57079, 0]}>
        <meshLambertMaterial map={basicWall} side={DoubleSide} />
      </Plane>
    </RigidBody>
  );
}
