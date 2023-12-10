import {
  useGLTF,
  PerspectiveCamera,
  MeshDistortMaterial,
} from "@react-three/drei";
import MirrorGLTF from "../../../assets/mirror_of_loss_6.gltf";
import {
  Color,
  DebugLayerMaterial,
  Depth,
  Displace,
  Fresnel,
  LayerMaterial,
} from "lamina";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";

export default function Mirror() {
  const { nodes } = useGLTF(MirrorGLTF);
  const displaceRef = useRef(null);
  const strength = useRef(0);

  useFrame(({ clock }, delta) => {
    displaceRef.current.strength = MathUtils.lerp(
      displaceRef.current.strength, //
      0.2,
      0.1
    );

    displaceRef.current.offset.x += 0.3 * delta;
  });

  return (
    <group dispose={null} castShadow>
      <group scale={0.01} castShadow>
        <group name="Group" position={[21.251, 2198.83, -898.589]} castShadow>
          <mesh
            name="spike_right"
            castShadow
            receiveShadow
            geometry={nodes.spike_right.geometry}
            material={nodes.spike_right.material}
            position={[1253.778, 3440.847, 569.731]}
            rotation={[Math.PI, 0, -Math.PI]}
          />
          <mesh
            name="spike_left"
            castShadow
            receiveShadow
            geometry={nodes.spike_left.geometry}
            material={nodes.spike_left.material}
            position={[-1224.669, 3440.847, 569.731]}
            rotation={[-Math.PI, 0, -Math.PI]}
          />
          <mesh
            name="top_block"
            castShadow
            receiveShadow
            geometry={nodes.top_block.geometry}
            material={nodes.top_block.material}
            position={[51.749, 1239.473, -215.602]}
            rotation={[-Math.PI / 2, 0, 0]}
          />
          <mesh
            name="top_left_block"
            castShadow
            receiveShadow
            geometry={nodes.top_left_block.geometry}
            material={nodes.top_left_block.material}
            position={[-2090.101, -580.972, 0]}
            rotation={[-Math.PI / 2, -0.35, 0]}
          />
          <mesh
            name="mid_spikes"
            castShadow
            receiveShadow
            geometry={nodes.mid_spikes.geometry}
            material={nodes.mid_spikes.material}
            position={[0, -2324.663, 394.754]}
            rotation={[-Math.PI / 2, -1.564, 0]}
          />
          <mesh
            name="top_right_block"
            castShadow
            receiveShadow
            geometry={nodes.top_right_block.geometry}
            material={nodes.top_right_block.material}
            position={[2113.749, -587.366, 0]}
            rotation={[-Math.PI / 2, 0.38, 0]}
          />
        </group>
        <mesh
          name="frame_details"
          castShadow
          geometry={nodes.frame_details.geometry}
          material={nodes.frame_details.material}
          position={[-11.785, 14.134, 84.895]}
          rotation={[0, 0, -Math.PI]}
          scale={[1, 1, 1.726]}
        >
          <LayerMaterial>
            <Depth
              near={10}
              far={100}
              origin={[0, 0, 0]}
              colorA={"#000"}
              colorB={"#1a1024"}
              mapping="camera"
            />
          </LayerMaterial>
        </mesh>
        <group name="gem" position={[98.599, 3773.743, 218.1]}>
          <mesh
            name="gem_1"
            castShadow
            receiveShadow
            geometry={nodes.gem_1.geometry}
            position={[5.313, -27.229, 0]}
            rotation={[0, 0, 0]}
            scale={[1, 1, 2.515]}
          >
            <LayerMaterial
              color={"#fff"}
              lighting={"physical"} //
              transmission={1}
              roughness={0.1}
              thickness={2}
            >
              <Depth
                near={0.4854}
                far={0.7661999999999932}
                origin={[-0.4920000000000004, 0.4250000000000003, 0]}
                colorA={"#fff"}
                colorB={"#0c0333"}
              />
              <Fresnel
                color={"#5836c7"}
                bias={-0.3430000000000002}
                intensity={3.8999999999999946}
                power={3.3699999999999903}
                factor={1.119999999999999}
                mode={"screen"}
              />
            </LayerMaterial>
          </mesh>
          <mesh
            name="gem_frame"
            castShadow
            receiveShadow
            geometry={nodes.gem_frame.geometry}
            material={nodes.gem_frame.material}
            position={[0, 0, -53.11]}
            rotation={[-Math.PI / 2, -Math.PI / 2, 0]}
            scale={0.735}
          >
            <LayerMaterial color="#271c33" lighting="phong">
              <Depth
                near={1}
                far={25}
                origin={[5, 0, 2]}
                colorA={"#79708a"}
                colorB={"#352b40"}
              />
            </LayerMaterial>
          </mesh>
        </group>
        <group name="Group_1" position={[72.356, -5546.331, 45.748]}>
          <mesh
            name="bottom_pyramid"
            castShadow
            receiveShadow
            geometry={nodes.bottom_pyramid.geometry}
            material={nodes.bottom_pyramid.material}
            position={[-61.983, 611.423, 493.79]}
            rotation={[-0.406, Math.PI / 2, 0]}
          >
            <meshPhysicalMaterial
              ior={0.1}
              clearcoat={5}
              color={"#c4b48b"}
              reflectivity={0.5}
            />
          </mesh>
          <mesh
            name="bottom_front"
            castShadow
            receiveShadow
            geometry={nodes.bottom_front.geometry}
            material={nodes.bottom_front.material}
            position={[0, -739.175, -462.332]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[1, 1.746, 1]}
          >
            <meshPhysicalMaterial
              ior={0.1}
              clearcoat={5}
              color={"#c4b48b"}
              reflectivity={0.5}
            />
          </mesh>
          <group name="bottom_right" position={[1774.261, 284.942, -79.554]}>
            <mesh
              name="Cylinder_4"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder_4.geometry}
              material={nodes.Cylinder_4.material}
              position={[-386.52, -759.198, 0]}
              rotation={[0.061, 0.366, 1.402]}
              scale={[0.731, 1, 1]}
            >
              <meshPhysicalMaterial
                ior={0.1}
                clearcoat={5}
                color={"#c4b48b"}
                reflectivity={0.5}
              />
            </mesh>
            <mesh
              name="Cylinder_2"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder_2.geometry}
              material={nodes.Cylinder_2.material}
              position={[-352.444, -544.078, 0]}
              rotation={[Math.PI / 2, 1.414, 0]}
              scale={[0.731, 1, 1]}
            >
              <meshPhysicalMaterial
                ior={0.1}
                clearcoat={5}
                color={"#c4b48b"}
                reflectivity={0.5}
              />
            </mesh>
            <mesh
              name="Cylinder_2_1"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder_2_1.geometry}
              material={nodes.Cylinder_2_1.material}
              position={[1113.05, 1529.206, -9.116]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[1, 0.317, 1]}
            >
              <meshPhysicalMaterial
                ior={0.1}
                clearcoat={5}
                color={"#c4b48b"}
                reflectivity={0.5}
              />
            </mesh>
          </group>
          <group name="bottom_left" position={[-1793.822, 0, 0]}>
            <mesh
              name="Cylinder_3"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder_3.geometry}
              material={nodes.Cylinder_3.material}
              position={[200.091, -537.78, 0]}
              rotation={[-0.041, -0.255, 1.675]}
              scale={[0.731, 1, 1]}
            >
              <meshPhysicalMaterial
                ior={0.1}
                clearcoat={5}
                color={"#c4b48b"}
                reflectivity={0.5}
              />
            </mesh>
            <mesh
              name="Cylinder"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder.geometry}
              material={nodes.Cylinder.material}
              position={[125.409, -428.562, -79.554]}
              rotation={[-Math.PI / 2, 0.559, -Math.PI]}
              scale={[0.731, 1, 1]}
            >
              <meshPhysicalMaterial
                ior={0.1}
                clearcoat={5}
                color={"#c4b48b"}
                reflectivity={0.5}
              />
            </mesh>
            <mesh
              name="Cylinder_1"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder_1.geometry}
              material={nodes.Cylinder_1.material}
              position={[-1133.769, 1829.147, -96.67]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[1, 0.317, 1]}
            >
              <meshPhysicalMaterial
                ior={0.1}
                clearcoat={5}
                color={"#c4b48b"}
                reflectivity={0.5}
              />
            </mesh>
          </group>
        </group>
        <mesh
          name="glass"
          castShadow
          receiveShadow
          geometry={nodes.glass.geometry}
          material={nodes.glass.material}
          position={[-6.55, -23.68, -170.973]}
          rotation={[0, 0, 0]}
        >
          <LayerMaterial color={"#fff"} lighting={"physical"}>
            <Depth
              near={2}
              far={48}
              origin={[0, 0, 0]}
              colorA={"#4f187d"}
              colorB={"#110730"}
            />
            <Displace
              ref={displaceRef}
              strength={0}
              scale={1.5}
              offset={[1.2, 0.5, 0.2]}
            />
          </LayerMaterial>
        </mesh>
        <mesh
          name="frame"
          castShadow
          receiveShadow
          geometry={nodes.frame.geometry}
          material={nodes.frame.material}
          rotation={[Math.PI / 2, 0, Math.PI]}
          scale={[1, 6.915, 1]}
        >
          <LayerMaterial color="#271c33" lighting="phong">
            <Depth
              near={10}
              far={300}
              origin={[0, 0, 0]}
              colorA={"#8b8499"}
              colorB={"#483d54"}
              mapping="camera"
            />
          </LayerMaterial>
        </mesh>
      </group>
    </group>
  );
}
