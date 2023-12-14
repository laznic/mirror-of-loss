import { config, useSpring, animated } from "@react-spring/three";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import { useState } from "react";
import Blobs from "./Blobs";
import { Vector3Tuple } from "three";

interface MemoryGroupProps {
  position?: Vector3Tuple;
  id: number;
}

export default function MemoryGroup({ position, id }: MemoryGroupProps) {
  const [hovering, setHovering] = useState(false);
  const [showBlobs, setShowBlobs] = useState(false);
  const [blobsHidden, setBlobsHidden] = useState(true);

  const { scale } = useSpring({
    scale: hovering ? 1.2 : 1,
    config: config.wobbly,
  });

  const [{ scale: scale2 }, api] = useSpring(() => ({
    scale: 0,
    onStart: {
      scale: () => {
        if (!showBlobs) {
          setBlobsHidden(false);
        }
      },
    },
    onRest: {
      scale: () => {
        if (showBlobs) {
          setBlobsHidden(true);
        }
      },
    },
  }));

  return (
    <>
      <group
        position={position}
        onClick={() => {
          setShowBlobs((prev) => !prev);

          api.start({ scale: showBlobs ? 0 : 1 });
        }}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
      >
        <animated.mesh scale={scale}>
          <Sphere args={[2]}>
            <MeshDistortMaterial
              distort={0.4}
              color={"#fbd9ff"}
              reflectivity={0.5}
              roughness={0.1}
              transmission={0.75}
              sheen={0.5}
              sheenColor={"#f0a3ff"}
            />
          </Sphere>
        </animated.mesh>
      </group>
      <group position={position} visible={!blobsHidden}>
        <animated.mesh scale={scale2}>
          <Blobs visible={!blobsHidden} groupId={id} />
        </animated.mesh>
      </group>
    </>
  );
}
