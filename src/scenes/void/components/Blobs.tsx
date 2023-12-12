import { useEffect, useMemo, useRef, useState } from "react";
import supabase from "../../../supabase";
import {
  Float,
  MeshTransmissionMaterial,
  Plane,
  Sphere,
  useKeyboardControls,
  useTexture,
} from "@react-three/drei";
import { useFrame, useThree, extend } from "@react-three/fiber";
import { Group, Vector3Tuple, Vector3, DoubleSide } from "three";
import { useSpring, animated, config } from "@react-spring/three";
import * as THREE from "three";
import CameraControls from "camera-controls";

CameraControls.install({ THREE });
extend({ CameraControls });

function Controls({ pos = new Vector3(), look = new Vector3() }) {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const controls = useMemo(() => new CameraControls(camera, gl.domElement), []);
  const shouldUpdate = useRef(false);
  const currentPos = useRef(pos);
  shouldUpdate.current = !pos.equals(currentPos.current);
  currentPos.current = pos;
  const [, get] = useKeyboardControls();

  useEffect(() => {
    controls.infinityDolly = true;
  }, []);

  useFrame((state, delta) => {
    const { forward, backward, left, right, jump, crouch } = get();

    if (forward) {
      controls.forward(200 * delta, true);
    }

    if (backward) {
      controls.forward(-200 * delta, true);
    }

    if (left) {
      controls.truck(-200 * delta, 0, true);
    }

    if (right) {
      controls.truck(200 * delta, 0, true);
    }

    if (jump) {
      controls.elevate(200 * delta, true);
    }

    if (crouch) {
      controls.elevate(-200 * delta, true);
    }

    if (shouldUpdate.current) {
      state.camera.position.lerp(pos, 0.75);
      state.camera.updateProjectionMatrix();
      controls.setLookAt(
        state.camera.position.x,
        state.camera.position.y,
        state.camera.position.z,
        look.x,
        look.y,
        look.z,
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

export default function Blobs() {
  const [memories, setMemories] = useState([]);
  const groupRef = useRef<Group>(null);
  const [camPos, setCamPos] = useState();
  const [lookAt, setLookAt] = useState();

  function onClick(blob) {
    setCamPos(new Vector3(0, blob.position.y, 150));
    setLookAt(blob.position);
  }

  useEffect(() => {
    async function fetchMemories() {
      const { data, error } = await supabase
        .from("memories")
        .select()
        .order("id", { ascending: false })
        .limit(4);

      if (data) {
        setMemories(data);
      }
    }

    fetchMemories();
  }, []);

  useFrame(({ camera }) => {
    if (!groupRef.current) return;

    // state.camera.lookAt([0, 40, 80]);
    // state.camera.updateProjectionMatrix();
  });

  return (
    <>
      <Controls pos={camPos} look={lookAt} />
      <group ref={groupRef}>
        {memories.map(
          (memory: { id: number; image: string }, index: number) => (
            <Blob
              key={memory.id}
              position={[0, 40 * index, 80]}
              imageUrl={memory.image}
              onClick={onClick}
              visible
            />
          )
        )}
      </group>
    </>
  );
}

interface BlobProps {
  imageUrl: string;
  position: Vector3Tuple;
  visible: boolean;
}

function Blob({ imageUrl, position, visible, onClick }: BlobProps) {
  const texture = useTexture(imageUrl);
  const groupRef = useRef<Group>(null);
  const floatRef = useRef<Group>(null);
  const planeRef =
    useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>(
      null
    );
  const [hovering, setHovering] = useState(false);
  const [showImage, setShowImage] = useState(false);

  useFrame(() => {
    if (!visible) return;
    if (!groupRef.current) return;
    if (!floatRef.current) return;

    if (showImage) {
      planeRef.current.position.x = THREE.MathUtils.lerp(
        planeRef.current.position.x,
        groupRef.current.position.x + 100,
        0.01
      );

      planeRef.current.position.y = THREE.MathUtils.lerp(
        planeRef.current.position.y,
        groupRef.current.position.y,
        0.01
      );

      planeRef.current.position.z = THREE.MathUtils.lerp(
        planeRef.current.position.z,
        groupRef.current.position.z,
        0.01
      );
    }
  });

  const { scale } = useSpring({
    scale: hovering ? 1.2 : 1,
    config: config.wobbly,
  });

  return (
    <>
      {/* <Billboard> */}

      <Plane ref={planeRef} args={[100, 100]} visible={showImage}>
        <meshLambertMaterial map={texture} side={DoubleSide} />
      </Plane>
      {/* </Billboard> */}
      <Float
        ref={floatRef}
        speed={5}
        rotationIntensity={0.1}
        floatIntensity={0.5}
      >
        <group
          position={position}
          ref={groupRef}
          onDoubleClick={() => setShowImage(true)}
          onClick={() => onClick(groupRef.current)}
          onPointerEnter={() => setHovering(true)}
          onPointerLeave={() => setHovering(false)}
        >
          <animated.mesh scale={scale}>
            <Sphere args={[13.5, 48, 48]} castShadow>
              <MeshTransmissionMaterial
                distortionScale={0.1}
                temporalDistortion={1}
                transmission={0.95}
                color={"#fbd9ff"}
                roughness={0}
                thickness={0.9}
                chromaticAberration={0.4}
                anisotropicBlur={5}
                distortion={1}
              />
            </Sphere>

            <Sphere args={[10, 48, 48]}>
              <meshPhysicalMaterial map={texture} roughness={0.1} />
            </Sphere>
          </animated.mesh>
        </group>
      </Float>
    </>
  );
}
