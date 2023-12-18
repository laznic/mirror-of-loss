import VoidScene from "../void";
import { MirrorScene } from "../mirror";
import { Route } from "wouter";

export default function MainScene() {
  return (
    <>
      <Route path="/">
        <MirrorScene />
      </Route>
      <Route path="/void">
        <VoidScene />
      </Route>
    </>
  );
}
