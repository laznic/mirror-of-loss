import { useEffect, useMemo, useRef, useState } from "react";
import supabase from "../../../supabase";
import {
  Box,
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
  const [, get] = useKeyboardControls();

  const controls = useMemo(() => {
    const cc = new CameraControls(camera, gl.domElement);
    cc.dollyToCursor = true;
    cc.maxDistance = 500;
    return cc;
  }, []);

  const shouldUpdate = useRef(false);
  const currentPos = useRef(pos);

  shouldUpdate.current = !pos.equals(currentPos.current);
  currentPos.current = pos;

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

interface BlobsProps {
  visible: boolean;
  groupId: number;
}

export default function Blobs({ visible, groupId }: BlobsProps) {
  const [memories, setMemories] = useState([]);
  const [camPos, setCamPos] = useState();
  const [lookAt, setLookAt] = useState();
  const [showVideo, setShowVideo] = useState<number | null>(null);

  function onClick(memoryId: number, blob: Group, plane: Group) {
    const newPosition = new Vector3(
      blob.position.x,
      blob.position.y + 9,
      blob.position.z + 10
    );

    setCamPos(newPosition);
    setLookAt(plane.position);

    setShowVideo(memoryId);
  }

  useEffect(() => {
    if (!visible) return;

    async function fetchMemories() {
      const { data } = await supabase
        .from("memories")
        .select()
        .order("id", { ascending: false })
        .eq("group_id", groupId)
        .limit(4);

      if (data) {
        setMemories(data);
      }
    }

    fetchMemories();
  }, [visible, groupId]);

  return (
    <>
      <Controls pos={camPos} look={lookAt} />
      <group>
        {memories.map(
          (memory: { id: number; image: string }, index: number) => (
            <Blob
              key={memory.id}
              position={[index * 5 - 7.5, 5, 0]}
              imageUrl={memory.image}
              onClick={(blobRef, planeRef) =>
                onClick(memory.id, blobRef, planeRef)
              }
              showVideo={showVideo === memory.id}
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
  onClick: (blobRef: Group) => void;
  showVideo: boolean;
}

function Blob({ imageUrl, position, visible, onClick, showVideo }: BlobProps) {
  const texture = useTexture(imageUrl);

  const [video] = useState(() => {
    const vid = document.createElement("video");
    vid.src =
      "https://replicate.delivery/pbxt/aPTXL6n2ZYqgFVNgT5OP7NdLsNVPh5PS7Ee5b0g3EHhnmpAJA/000087.mp4";
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.muted = true;
    vid.play();
    return vid;
  });

  const groupRef = useRef<Group>(null);
  const floatRef = useRef<Group>(null);
  const planeRef = useRef<Group>(null);
  const [hovering, setHovering] = useState(false);

  useFrame(() => {
    if (!visible) return;
    if (!groupRef.current) return;
    if (!floatRef.current) return;
    if (!planeRef.current) return;

    if (showVideo) {
      planeRef.current.position.x = THREE.MathUtils.lerp(
        planeRef.current.position.x,
        groupRef.current.position.x,
        0.01
      );

      planeRef.current.position.y = THREE.MathUtils.lerp(
        planeRef.current.position.y,
        groupRef.current.position.y + 9,
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
      <group ref={planeRef} visible={showVideo} position={position}>
        <Box args={[10, 10]}>
          <MeshTransmissionMaterial
            distortionScale={0.1}
            temporalDistortion={1}
            transmission={0.99}
            color={"#fbd9ff"}
            roughness={0}
            thickness={1}
            anisotropicBlur={1}
          />
        </Box>
        <Plane args={[9, 9]}>
          <meshLambertMaterial side={DoubleSide}>
            <videoTexture attach={"map"} args={[video]} />
          </meshLambertMaterial>
        </Plane>
      </group>

      <Float
        ref={floatRef}
        speed={5}
        rotationIntensity={0.5}
        floatIntensity={2}
      >
        <group
          position={position}
          ref={groupRef}
          onClick={() => onClick(groupRef.current, planeRef.current)}
          onPointerEnter={() => setHovering(true)}
          onPointerLeave={() => setHovering(false)}
        >
          <animated.mesh scale={scale}>
            <Sphere args={[1.625, 48, 48]} castShadow>
              <MeshTransmissionMaterial
                distortionScale={0.1}
                temporalDistortion={1}
                transmission={0.95}
                color={"#fbd9ff"}
                roughness={0}
                thickness={0.9}
                chromaticAberration={0.1}
                anisotropicBlur={0.5}
                distortion={0.5}
              />
            </Sphere>

            <Sphere args={[1, 48, 48]}>
              <meshPhysicalMaterial map={texture} roughness={0.1} />
            </Sphere>
          </animated.mesh>
        </group>
      </Float>
    </>
  );
}
