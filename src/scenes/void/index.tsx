import { Environment } from "@react-three/drei";
import MemoryGroup from "./components/MemoryGroup";
import { useEffect, useState } from "react";
import supabase from "../../supabase";
import Controls from "./components/Controls";
import MemoryGroupContextProvider from "./context/MemoryGroupContext";
import { useCameraContext } from "./context/CameraContext";
import { Vector3 } from "three";
import BackgroundMusic from "../../assets/void-background-music.mp3";

const audio = new Audio(BackgroundMusic);

export default function VoidScene() {
  const [memoryGroups, setMemoryGroups] = useState([]);
  // const [currentPage, setCurrentPage] = useState(0);
  const { setLookAt, setCamPos } = useCameraContext();

  useEffect(() => {
    async function fetchSingleMemoryGroup() {
      const { data } = await supabase
        .rpc("memory_groups_with_position")
        .eq("id", parseInt(localStorage.getItem("memoryGroupId"), 10))
        .single();

      if (data) {
        setCamPos(new Vector3(data.x, data.y, data.z + 20));
        setLookAt(new Vector3(data.x, data.y, data.z));
      }

      localStorage.removeItem("memoryGroupId");
    }

    if (localStorage.getItem("memoryGroupId") && memoryGroups.length > 0) {
      fetchSingleMemoryGroup();
    }
  }, [memoryGroups.length]);

  useEffect(() => {
    async function fetchMemoryGroups() {
      const { data } = await supabase
        .rpc("memory_groups_with_position")
        .limit(1000);
      // .range(currentPage * 100, currentPage * 100 + 100 - 1);

      if (data) {
        setMemoryGroups((prev) => prev.concat(data));
      }
    }

    audio.volume = 0.2;
    audio.loop = true;
    audio.play();

    fetchMemoryGroups();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("memory_groups")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "memory_groups" },
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

  return (
    <MemoryGroupContextProvider>
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
      <Environment preset="night" background blur={2} />
    </MemoryGroupContextProvider>
  );
}
