"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const CloudPanoPage = () => {
  const searchParams = useSearchParams();
  const sceneId = searchParams.get("sceneId");

  const iframeSrc = `https://app.cloudpano.com/tours/3sdXXD75f?sceneId=${sceneId}`;

  return (
    <div style={{ width: "100%", height: "750px" }}>
      <iframe
        src={iframeSrc}
        style={{ width: "100%", height: "100%" }}
        allowFullScreen
        frameBorder="0"
        title="CloudPano Viewer"
      ></iframe>
    </div>
  );
};

// Wrap the page with Suspense for client-side rendering
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CloudPanoPage />
    </Suspense>
  );
}
