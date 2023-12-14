import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { Vector3 } from "three";

const SPEED = 5;
const direction = new Vector3();
const frontVector = new Vector3();
const sideVector = new Vector3();

export default function Player() {
  const bodyRef = useRef();

  const [, get] = useKeyboardControls();

  useFrame((state) => {
    const { forward, backward, left, right } = get();
    const velocity = bodyRef.current.linvel();

    const translation = bodyRef.current.translation();
    state.camera.position.set(translation.x, translation.y, translation.z);

    frontVector.set(0, 0, backward - forward);
    sideVector.set(left - right, 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(state.camera.rotation);

    bodyRef.current.setLinvel({
      x: direction.x,
      y: velocity.y,
      z: direction.z,
    });
  });

  return (
    <RigidBody
      ref={bodyRef}
      colliders={false}
      mass={1}
      type="dynamic"
      position={[0, 10, 0]}
      enabledRotations={[false, false, false]}
    >
      <CapsuleCollider args={[0.75, 0.5]} />
    </RigidBody>
  );
}
