

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { useLoader } from '@react-three/fiber';
import { OrbitControls } from "@react-three/drei";

function Model() {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <OrbitControls />
        <ModelComponent />
      </Suspense>
    </Canvas>
  );
}

function ModelComponent() {
  return (
    <group>
      <boxGeometry args={[2.2, 2.2, 2.2]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <ModelLoader />
    </group>
  );
}

function ModelLoader() {
  const gltfUrl = 'https://ipfs.io/ipfs/QmVK6qKpiCdBkDNJYtZE3VuZmmRGjjv1iiTGAUyoHwmhov';
  return (
    <Suspense fallback={null}>
      <ModelContent url={gltfUrl} />
    </Suspense>
  );
}

interface ModelContentProps {
  url: string;
}

function ModelContent({ url }: ModelContentProps) {
  const gltf = useLoader(GLTFLoader, url);
  gltf.scene.scale.set(10, 10, 10);
  return <primitive object={gltf.scene} />;
}

export default Model;
