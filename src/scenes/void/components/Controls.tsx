import { useFrame, useThree, extend } from "@react-three/fiber";
import * as THREE from "three";
import CameraControls from "camera-controls";
import { useKeyboardControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { useCameraContext } from "../context/CameraContext";

CameraControls.install({ THREE });
extend({ CameraControls });

export default function Controls() {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const [, get] = useKeyboardControls();
  const { camPos, lookAt } = useCameraContext();

  const controls = useMemo(() => {
    const cc = new CameraControls(camera, gl.domElement);
    cc.dollyToCursor = true;
    cc.maxDistance = 500;
    return cc;
  }, []);

  const shouldUpdate = useRef(false);
  const currentPos = useRef(camPos);

  console.log(camPos);

  shouldUpdate.current = !camPos.equals(currentPos.current);
  currentPos.current = camPos;

  useFrame((state, delta) => {
    const { forward, backward, left, right, jump, crouch } = get();

    if (forward) {
      controls.forward(50 * delta, true);
    }

    if (backward) {
      controls.forward(-50 * delta, true);
    }

    if (left) {
      controls.truck(-50 * delta, 0, true);
    }

    if (right) {
      controls.truck(50 * delta, 0, true);
    }

    if (jump) {
      controls.elevate(50 * delta, true);
    }

    if (crouch) {
      controls.elevate(-50 * delta, true);
    }

    if (shouldUpdate.current) {
      state.camera.position.lerp(camPos, 0.75);
      state.camera.updateProjectionMatrix();
      controls.setLookAt(
        state.camera.position.x,
        state.camera.position.y,
        state.camera.position.z,
        lookAt.x,
        lookAt.y,
        lookAt.z,
        true
      );
    }

    controls.update(delta);

    if (!controls.active && shouldUpdate.current) {
      shouldUpdate.current = false;
    }
  });

  return null;
}
