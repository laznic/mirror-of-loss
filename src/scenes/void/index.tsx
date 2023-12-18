import { Environment } from "@react-three/drei";
import MemoryGroup from "./components/MemoryGroup";
import { useEffect, useState } from "react";
import supabase from "../../supabase";
import Controls from "./components/Controls";
import CameraContextProvider from "./context/CameraContext";
import MemoryGroupContextProvider from "./context/MemoryGroupContext";

export default function VoidScene() {
  const [memoryGroups, setMemoryGroups] = useState([]);
  // const [currentPage, setCurrentPage] = useState(0);

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
    <CameraContextProvider>
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
    </CameraContextProvider>
  );
}
