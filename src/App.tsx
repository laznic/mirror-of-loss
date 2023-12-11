import { Canvas, useFrame } from "@react-three/fiber";
import "./App.css";
import Mirror from "./scenes/mirror/components/Mirror";
import {
  AccumulativeShadows,
  Billboard,
  Box,
  CameraControls,
  Float,
  MeshReflectorMaterial,
  MeshTransmissionMaterial,
  Plane,
  RandomizedLight,
  Sphere,
  useTexture,
} from "@react-three/drei";
import pillar from "./assets/pillar.png";
import brazier from "./assets/brazier-animated.png";
import { useEffect, useRef, useState } from "react";
import supabase from "./supabase";

function App() {
  return (
    <>
      <Canvas
        camera={{ position: [0, 0.5, 20], fov: 90 }}
        shadows
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight />
        <color attach={"background"} args={["#000"]} />
        <fog color="#000" attach="fog" near={50} far={700} />
        <directionalLight
          intensity={5}
          color={"#fff"}
          position={[-3, 1.5, 3]}
        />
        <CameraControls />
        <Mirror />

        <MemoryBlobs />

        <Pillar position={[-100, 0, 0]} />
        <Pillar position={[-100, 0, 100]} />
        <Pillar position={[-100, 0, 200]} />
        <Pillar position={[100, 0, 0]} />
        <Pillar position={[100, 0, 100]} />
        <Pillar position={[100, 0, 200]} />
        <Brazier position={[-50, -65, 0]} />
        <Brazier position={[50, -65, 0]} />

        <AccumulativeShadows
          temporal
          frames={100}
          color="#666"
          colorBlend={2}
          toneMapped={true}
          alphaTest={0.75}
          opacity={2}
          scale={200}
          position={[0, -100, 0]}
        >
          <RandomizedLight
            intensity={Math.PI}
            amount={8}
            radius={10}
            ambient={0.5}
            position={[5, 5, -10]}
            bias={0.001}
          />
        </AccumulativeShadows>
        <Plane
          receiveShadow
          args={[1000, 1000]}
          rotation={[4.737, 0, 0]}
          position={[0, -100, 300]}
        >
          <meshPhongMaterial color={"#8a82a1"} />
        </Plane>
      </Canvas>
    </>
  );
}

function Brazier({ position }) {
  const texture = useTexture(brazier);
  const offset = useRef(0);
  useFrame(({ clock }, delta) => {
    texture.repeat.x = 0.2;

    const interval = 1 / 8;

    if ((clock.getElapsedTime() / delta) % (1 - interval) < interval) {
      texture.offset.set(offset.current, 0);
      offset.current += 0.2;

      if (offset.current === 1) {
        offset.current = 0;
      }
    }
  });

  return (
    <Billboard>
      <Plane args={[50, 40]} position={position}>
        <MeshReflectorMaterial map={texture} mirror={0.1} alphaTest={0.5} />
      </Plane>
    </Billboard>
  );
}

function Pillar({ position }) {
  const texture = useTexture(pillar);

  return (
    // <Billboard>
    <Box args={[25, 175, 25]} position={position}>
      <meshLambertMaterial map={texture} alphaTest={0} />
    </Box>
    // </Billboard>
  );
}

function MemoryBlobs() {
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

  return (
    <>
      <Blob
        position={[0, 0, 20]}
        imageUrl={memories[0]?.image}
        key={"blob-1"}
        visible={memories.length > 0}
      />
      <Blob
        position={[0, 10, 40]}
        imageUrl={memories[1]?.image}
        key={"blob-2"}
        visible={memories.length > 1}
      />
      <Blob
        position={[0, 20, 60]}
        imageUrl={memories[2]?.image}
        key={"blob-3"}
        visible={memories.length > 2}
      />
      <Blob
        position={[0, 30, 80]}
        imageUrl={memories[3]?.image}
        key={"blob-4"}
        visible={memories.length > 3}
      />
    </>
  );
}

function Blob({ imageUrl, position, visible }) {
  const texture = useTexture(imageUrl ?? {});
  const groupRef = useRef();

  useFrame(() => {
    if (!visible) return;
    if (groupRef.current.position.z <= -25) return;

    groupRef.current.position.z -= 0.1;
    groupRef.current.scale.x -= 0.001;
    groupRef.current.scale.y -= 0.001;
    groupRef.current.scale.z -= 0.001;
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

export default App;
