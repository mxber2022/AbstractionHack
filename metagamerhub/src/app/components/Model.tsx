

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { useLoader } from '@react-three/fiber';
import { OrbitControls } from "@react-three/drei";

interface ModelProps {
  gltfUrl: string;
}

function Model({ gltfUrl }: ModelProps) {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <OrbitControls />
        <ModelComponent gltfUrl={gltfUrl} />
      </Suspense>
    </Canvas>
  );
}

interface ModelComponentProps {
  gltfUrl: string;
}

function ModelComponent({ gltfUrl }: ModelComponentProps) {
  return (
    <group>
      <boxGeometry args={[2.2, 2.2, 2.2]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <ModelLoader gltfUrl={gltfUrl} />
    </group>
  );
}

function ModelLoader({ gltfUrl }: ModelComponentProps) {
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