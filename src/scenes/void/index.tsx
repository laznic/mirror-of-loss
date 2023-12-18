import {
  CameraControls,
  Environment,
  KeyboardControls,
  PointerLockControls,
  Sphere,
} from "@react-three/drei";
import MemoryGroup from "./components/MemoryGroup";
import { useEffect, useState } from "react";
import supabase from "../../supabase";
import Controls from "./components/Controls";
import CameraContextProvider from "./context/CameraContext";
import MemoryGroupContextProvider from "./context/MemoryGroupContext";
import { useSceneContext } from "../main/context/SceneContext";
import Controller from "ecctrl";
import { Physics } from "@react-three/rapier";

export default function VoidScene() {
  const [memoryGroups, setMemoryGroups] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const { currentScene } = useSceneContext();

  useEffect(() => {
    async function fetchMemoryGroups() {
      const { data } = await supabase
        .rpc("memory_groups_with_position")
        .limit(100)
        .range(currentPage * 100, currentPage * 100 + 100 - 1);

      if (data) {
        setMemoryGroups((prev) => prev.concat(data));
      }
    }

    fetchMemoryGroups();
  }, [currentPage]);

  useEffect(() => {
    const channel = supabase
      .channel("memory_groups")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "memory_groups" },
        async (payload) => {
          const { data } = await supabase
            .rpc("memory_groups_with_position")
            .eq("id", payload.new.id)
            .single();

          setMemoryGroups((prev) => prev.concat([data]));
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);
  // display groups of blobs in space 🕒 LATER
  // click group of blobs 🕒 LATER
  // Zoom in 🕒 LATER
  // load images 🕒 LATER

  // hover on a blob to highlight ✅ DONE-ish

  // click a blob ✅ DONE-ish
  // move camera above ✅ DONE-ish
  // display animation? on a plane ✅ DONE-ish
  // click anywhere ⏭️ NEXT
  // move camre to blobs ⏭️ NEXT

  return (
    <CameraContextProvider>
      <MemoryGroupContextProvider>
        <KeyboardControls map={keyboardMap}>
          <Controls />

          {memoryGroups.map((group) => (
            <MemoryGroup
              date={group.created_at}
              key={group.id}
              id={group.id}
              memory={group.memory}
              position={[group.x, group.y, group.z]}
            />
          ))}
        </KeyboardControls>
        <Environment preset="night" background blur={2} />
      </MemoryGroupContextProvider>
    </CameraContextProvider>
  );
}

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "w", "W"] },
  { name: "backward", keys: ["ArrowDown", "s", "S"] },
  { name: "leftward", keys: ["ArrowLeft", "a", "A"] },
  { name: "rightward", keys: ["ArrowRight", "d", "D"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
  { name: "crouch", keys: ["c", "C"] },
];
