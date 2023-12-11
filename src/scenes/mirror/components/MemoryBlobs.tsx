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
      position={[0, 0, 80]}
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
    if (groupRef.current.position.z <= -30) return;

    groupRef.current.position.z = MathUtils.lerp(
      groupRef.current.position.z,
      -30,
      0.002
    );
    groupRef.current.scale.x = MathUtils.lerp(
      groupRef.current.scale.x,
      0,
      0.0005
    );
    groupRef.current.scale.y = MathUtils.lerp(
      groupRef.current.scale.y,
      0,
      0.0005
    );
    groupRef.current.scale.z = MathUtils.lerp(
      groupRef.current.scale.z,
      0,
      0.0005
    );
  });

  return (
    <group visible={visible}>
      <Float speed={5} rotationIntensity={2} floatIntensity={5}>
        <group position={position} ref={groupRef}>
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
        </group>
      </Float>
    </group>
  );
}
