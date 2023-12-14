import { Box, Environment } from "@react-three/drei";
import Blobs from "./components/Blobs";
import MemoryGroup from "./components/MemoryGroup";

export default function VoidScene() {
  // display groups of blobs in space 🕒 LATER
  // click group of blobs 🕒 LATER
  // Zoom in 🕒 LATER
  // load images 🕒 LATER

  // hover on a blob to highlight ✅ DONE-ish

  // click a blob ⏭️ NEXT
  // move camera above ⏭️ NEXT
  // display animation? on a plane ⏭️ NEXT
  // click anywhere ⏭️ NEXT
  // move camre to blobs ⏭️ NEXT

  return (
    <>
      <MemoryGroup />
      {/* <Blobs />; */}
      <color attach={"background"} args={["#ffcc00"]} />
      <Environment preset="night" background blur={2} />
    </>
  );
}
