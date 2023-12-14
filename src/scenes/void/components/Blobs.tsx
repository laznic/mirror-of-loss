import { useEffect, useRef, useState } from "react";
import supabase from "../../../supabase";
import {
  Box,
  Float,
  MeshTransmissionMaterial,
  Plane,
  Sphere,
  useTexture,
} from "@react-three/drei";

import { useSpring, animated, config } from "@react-spring/three";
import { DoubleSide, Group, MathUtils, Vector3, Vector3Tuple } from "three";
import { useFrame } from "@react-three/fiber";
import { useCameraContext } from "../context/CameraContext";

interface BlobsProps {
  visible: boolean;
  groupId: number;
}

export default function Blobs({ visible, groupId }: BlobsProps) {
  const [memories, setMemories] = useState([]);
  const [showVideo, setShowVideo] = useState<number | null>(null);
  const { setCamPos, setLookAt } = useCameraContext();

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

  if (!visible) return null;

  return (
    <>
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

  // const [video] = useState(() => {
  //   const vid = document.createElement("video");
  //   vid.src =
  //     "https://replicate.delivery/pbxt/aPTXL6n2ZYqgFVNgT5OP7NdLsNVPh5PS7Ee5b0g3EHhnmpAJA/000087.mp4";
  //   vid.crossOrigin = "Anonymous";
  //   vid.loop = true;
  //   vid.muted = true;
  //   vid.play();
  //   return vid;
  // });

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
    scale: hovering ? 1.2 : 1,
    config: config.wobbly,
  });

  if (!visible) return null;

  return (
    <>
      {/* <group ref={planeRef} visible={showVideo} position={position}>
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
      </group> */}

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
