import Brazier from "./components/Brazier";
import MemoryBlobs from "./components/MemoryBlobs";
import Mirror from "./components/Mirror";
import Pillar from "./components/Pillar";

export function MirrorScene() {
  return (
    <>
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
    </>
  );
}
