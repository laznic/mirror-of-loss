import { useEffect, useMemo, useRef, useState } from "react";
import supabase from "../../../supabase";
import {
  Float,
  MeshTransmissionMaterial,
  Sphere,
  useTexture,
} from "@react-three/drei";
import { useFrame, useThree, extend } from "@react-three/fiber";
import { Group, Vector3Tuple } from "three";
import { useSpring, animated, config } from "@react-spring/three";
import * as THREE from "three";
import CameraControls from "camera-controls";
import * as holdEvent from "hold-event";

CameraControls.install({ THREE });
extend({ CameraControls });

const KEYCODE = {
  W: "KeyW",
  A: "KeyA",
  S: "KeyS",
  D: "KeyD",
  ARROW_LEFT: "ArrowLeft",
  ARROW_UP: "ArrowUp",
  ARROW_RIGHT: "ArrowRight",
  ARROW_DOWN: "ArrowDown",
};

const wKey = new holdEvent.KeyboardKeyHold(KEYCODE.W);
const aKey = new holdEvent.KeyboardKeyHold(KEYCODE.A);
const sKey = new holdEvent.KeyboardKeyHold(KEYCODE.S);
const dKey = new holdEvent.KeyboardKeyHold(KEYCODE.D);

function Controls({ pos = new THREE.Vector3(), look = new THREE.Vector3() }) {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const controls = useMemo(() => new CameraControls(camera, gl.domElement), []);
  const shouldUpdate = useRef(false);
  const currentPos = useRef(pos);
  shouldUpdate.current = !pos.equals(currentPos.current);
  currentPos.current = pos;

  useEffect(() => {
    controls.infinityDolly = true;

    function truckCamera(direction) {
      return (event) => {
        controls.truck(0.25 * direction * event.deltaTime, 0, false);
      };
    }

    function forwardCamera(direction) {
      return (event) => {
        controls.forward(0.25 * direction * event.deltaTime, 0, false);
      };
    }

    aKey.addEventListener("holding", truckCamera(-1));
    dKey.addEventListener("holding", truckCamera(1));
    wKey.addEventListener("holding", forwardCamera(1));
    sKey.addEventListener("holding", forwardCamera(-1));

    return () => {
      aKey.removeEventListener("holding", truckCamera(-1));
      dKey.removeEventListener("holding", truckCamera(1));
      wKey.removeEventListener("holding", forwardCamera(1));
      sKey.removeEventListener("holding", forwardCamera(-1));
    };
  }, []);

  useFrame((state, delta) => {
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
    setCamPos(new THREE.Vector3(0, blob.position.y, 150));
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
  const [hovering, setHovering] = useState(false);

  useFrame(() => {
    if (!visible) return;
    if (!groupRef.current) return;
    if (!floatRef.current) return;
  });

  const { scale } = useSpring({
    scale: hovering ? 1.2 : 1,
    config: config.wobbly,
  });

  return (
    <>
      {/* <Billboard> */}
      {/* <Plane args={[100, 100]} position={position}>
        <meshLambertMaterial map={texture} side={DoubleSide} />
      </Plane> */}
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
