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

  const shouldUpdatePos = useRef(false);
  const shouldUpdateLookAt = useRef(false);
  const currentPos = useRef(camPos);
  const currentLookAt = useRef(lookAt);

  shouldUpdatePos.current = !camPos.equals(currentPos.current);
  currentPos.current = camPos;
  shouldUpdateLookAt.current = !lookAt.equals(currentLookAt.current);
  currentLookAt.current = lookAt;

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

    if (shouldUpdatePos.current && shouldUpdateLookAt.current) {
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

    if (
      !controls.active &&
      shouldUpdatePos.current &&
      shouldUpdateLookAt.current
    ) {
      shouldUpdatePos.current = false;
      shouldUpdateLookAt.current = false;
    }
  });

  return null;
}
