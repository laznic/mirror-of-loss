import VoidScene from "../void";
import { MirrorScene } from "../mirror";
import { Route } from "wouter";

export default function MainScene() {
  return (
    <>
      <Route path="/">
        <fog color="#000" attach="fog" near={1} far={120} />
        <MirrorScene />
      </Route>
      <Route path="/void">
        <directionalLight
          intensity={2}
          color={"#fff"}
          position={[-3, 1.5, 3]}
        />
        <VoidScene />
      </Route>
    </>
  );
}
