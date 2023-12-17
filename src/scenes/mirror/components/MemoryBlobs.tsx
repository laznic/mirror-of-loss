import { useEffect, useRef, useState } from "react";
import supabase from "../../../supabase";
import {
  Float,
  MeshTransmissionMaterial,
  Sphere,
  useTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group, MathUtils, Vector3Tuple } from "three";

export default function MemoryBlobs() {
  const [memories, setMemories] = useState([]);

  useEffect(() => {
    const channel = supabase
      .channel("memories")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "memories" },
        (payload) => {
          setMemories((prev) => prev.concat([payload.new]));
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return memories.map((memory: { id: number; image: string }) => (
    <Blob
      key={memory.id}
      position={[0, -2, -84]}
      imageUrl={memory.image}
      visible
    />
  ));
}

interface BlobProps {
  imageUrl: string;
  position: Vector3Tuple;
  visible: boolean;
}

function Blob({ imageUrl, position, visible }: BlobProps) {
  const texture = useTexture(imageUrl);
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    if (!visible) return;
    if (!groupRef.current) return;
    // if (groupRef.current.position.z <= -30) return;

    groupRef.current.position.z = MathUtils.lerp(
      groupRef.current.position.z,
      -100,
      0.0005
    );

    groupRef.current.position.y = MathUtils.lerp(
      groupRef.current.position.y,
      -0.5,
      0.0005
    );
  });

  return (
    <group visible={visible}>
      <Float speed={5} rotationIntensity={0.05} floatIntensity={1}>
        <group position={position} ref={groupRef}>
          <Sphere args={[0.33, 48, 48]} castShadow>
            <MeshTransmissionMaterial
              distortionScale={1}
              temporalDistortion={0.1}
              transmission={0.95}
              color={"#fbd9ff"}
              roughness={0}
              thickness={0.2}
              chromaticAberration={0.2}
              anisotropicBlur={0.5}
              distortion={1.2}
            />
          </Sphere>

          <Sphere args={[0.2, 48, 48]}>
            <meshPhysicalMaterial map={texture} roughness={0.1} />
          </Sphere>
        </group>
      </Float>
    </group>
  );
}
