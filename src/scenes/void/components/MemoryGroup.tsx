import { config, useSpring, animated } from "@react-spring/three";
import {
  MeshDistortMaterial,
  MeshTransmissionMaterial,
  Sphere,
  Text,
  useCursor,
} from "@react-three/drei";
import { useEffect, useState } from "react";
import Blobs from "./Blobs";
import { Vector3, Vector3Tuple } from "three";
import { useCameraContext } from "../context/CameraContext";
import { useMemoryGroupContext } from "../context/MemoryGroupContext";
import RedactionRegular from "../../../assets/Redaction-Regular.otf";
import RedactionItalic from "../../../assets/Redaction-Italic.otf";
import { format } from "date-fns";

interface MemoryGroupProps {
  position?: Vector3Tuple;
  id: number;
  date: string;
  memory: string;
}

export default function MemoryGroup({
  position,
  id,
  date,
  memory,
}: MemoryGroupProps) {
  const [hovering, setHovering] = useState(false);
  const { setCamPos, setLookAt } = useCameraContext();
  const { currentGroup, showBlobsForGroup } = useMemoryGroupContext();

  const { scale } = useSpring({
    scale: hovering ? 1.2 : 1,
    config: config.wobbly,
  });

  const [, api] = useSpring(() => ({
    scale: 0,
  }));

  useCursor(hovering);

  useEffect(() => {
    if (currentGroup === id) {
      api.start({ scale: 1 });
    }

    if (currentGroup !== id) {
      api.start({ scale: 0 });
    }
  }, [currentGroup, id, api]);

  return (
    <>
      <group
        position={position}
        onClick={() => {
          showBlobsForGroup(id);
          setCamPos(new Vector3(position[0], position[1], position[2] + 20));
          setLookAt(new Vector3(position[0], position[1], position[2]));
        }}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
      >
        <animated.mesh scale={scale}>
          <pointLight color={"#e06eff"} intensity={10} position={[0, 2, 2]} />
          <pointLight color={"#3f5db0"} intensity={30} position={[0, -2, -2]} />
          <Sphere args={[2]}>
            <MeshTransmissionMaterial
              distortion={2}
              distortionScale={0.2}
              temporalDistortion={0.5}
              color={"#fbd9ff"}
              roughness={0.2}
              chromaticAberration={5}
              anisotropicBlur={2}
              transmission={0.95}
              sheen={1}
              sheenColor={"#f0a3ff"}
            />
          </Sphere>
          <Sphere args={[1.1]}>
            <meshLambertMaterial color={"#290f3d"} />
          </Sphere>
        </animated.mesh>
        <Text
          visible={currentGroup === id}
          color={"#fff"}
          position={[0, 4.5, 0]}
          font={RedactionItalic}
          anchorX={"center"}
        >
          {`"${memory}"`}
        </Text>
        <Text
          visible={currentGroup === id}
          color={"#fff"}
          fontSize={0.65}
          position={[0, 3.25, 0]}
          font={RedactionRegular}
          anchorX={"center"}
        >
          {format(new Date(`${date}T00:00:00`), "MMM do, yyyy")}
        </Text>
      </group>
      <Blobs position={position} visible={currentGroup === id} groupId={id} />
    </>
  );
}
