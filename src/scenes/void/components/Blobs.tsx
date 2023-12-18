import { useEffect, useRef, useState } from "react";
import supabase from "../../../supabase";
import {
  Float,
  MeshTransmissionMaterial,
  Plane,
  RoundedBox,
  Sphere,
  useCursor,
  useTexture,
} from "@react-three/drei";

import { useSpring, animated, config } from "@react-spring/three";
import { DoubleSide, Group, MathUtils, Vector3, Vector3Tuple } from "three";
import { useFrame } from "@react-three/fiber";
import { useCameraContext } from "../context/CameraContext";

interface BlobsProps {
  visible: boolean;
  groupId: number;
  position?: Vector3Tuple;
}

export default function Blobs({ visible, groupId, position }: BlobsProps) {
  const [memories, setMemories] = useState([]);
  const [showVideo, setShowVideo] = useState<number | null>(null);
  const { setCamPos, setLookAt } = useCameraContext();

  function onClick(memoryId: number, blob: Group) {
    const newPosition = new Vector3(
      position[0] + blob.position.x,
      position[1] + 17.5,
      position[2] + 12
    );
    const newLookAt = new Vector3(
      position[0] + blob.position.x,
      position[1] + 17.5,
      position[2]
    );

    setCamPos(newPosition);
    setLookAt(newLookAt);

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

  if (!visible) return;

  return (
    <>
      <group position={position}>
        {memories.map(
          (memory: { id: number; image: string }, index: number) => (
            <Blob
              index={index}
              key={memory.id}
              position={[index * 5 - 7.5, 8, 0]}
              imageUrl={memory.image}
              onClick={(blobRef) => onClick(memory.id, blobRef)}
              showVideo={showVideo === memory.id}
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
  index: number;
}

function Blob({ imageUrl, position, onClick, showVideo, index }: BlobProps) {
  const textureLoaded = useRef(false);
  const animatePosition = useRef(false);
  const texture = useTexture(
    imageUrl ?? {},
    () => (textureLoaded.current = true)
  );

  const groupRef = useRef<Group>(null);
  const floatRef = useRef<Group>(null);
  const planeRef = useRef<Group>(null);
  const [hovering, setHovering] = useState(false);
  useCursor(hovering);

  useFrame(() => {
    if (!groupRef.current) return;
    if (!floatRef.current) return;

    if (animatePosition.current) {
      groupRef.current.position.x = MathUtils.lerp(
        groupRef.current.position.x,
        position[0],
        0.1
      );

      groupRef.current.position.y = MathUtils.lerp(
        groupRef.current.position.y,
        position[1],
        0.1
      );

      groupRef.current.position.z = MathUtils.lerp(
        groupRef.current.position.z,
        position[2],
        0.1
      );
    }

    if (showVideo) {
      planeRef.current.position.x = MathUtils.lerp(
        planeRef.current.position.x,
        groupRef.current.position.x,
        0.01
      );

      planeRef.current.position.y = MathUtils.lerp(
        planeRef.current.position.y,
        groupRef.current.position.y + 9,
        0.01
      );

      planeRef.current.position.z = MathUtils.lerp(
        planeRef.current.position.z,
        groupRef.current.position.z,
        0.01
      );
    }
  });

  const { scale } = useSpring({
    scale: hovering ? 1.2 : textureLoaded.current ? 1 : 0,
    config: config.wobbly,
    delay: index * 150,
    onStart: () => {
      animatePosition.current = true;
    },
  });

  return (
    <>
      <group ref={planeRef} visible={showVideo} position={position}>
        <RoundedBox args={[10, 10, 0.5]} radius={1}>
          <MeshTransmissionMaterial
            distortionScale={0.1}
            temporalDistortion={1}
            transmission={0.99}
            color={"#fbd9ff"}
            roughness={0}
            thickness={1}
            anisotropicBlur={1}
          />
        </RoundedBox>
        <Plane args={[9, 9]}>
          <meshLambertMaterial map={texture} side={DoubleSide} />
        </Plane>
      </group>

      <Float
        ref={floatRef}
        speed={5}
        rotationIntensity={0.5}
        floatIntensity={2}
      >
        <group
          ref={groupRef}
          onClick={() => onClick(groupRef.current)}
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
