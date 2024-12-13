"use client";
import { Rotate90DegreesCcw, ZoomIn, ZoomOut } from "@mui/icons-material";
import Image from "next/image";
import { useState } from "react";

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  containerClassName?: string;
  controlsClassName?: string;
  showControls?: boolean;
  maxScale?: number;
  minScale?: number;
  scaleStep?: number;
}

const ZoomableImage = ({
  src,
  alt,
  className,
  imageClassName,
  containerClassName,
  controlsClassName,
  showControls = true,
  maxScale = 3,
  minScale = 1,
  scaleStep = 0.2,
}: ZoomableImageProps) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + scaleStep, maxScale));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - scaleStep, minScale));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY / 500;
    const newScale = Math.max(minScale, Math.min(maxScale, scale + delta));
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {showControls && (
        <div className={`flex gap-2 ${controlsClassName} mt-2`}>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-full hover:bg-gray-100"
            title="Zoom Out"
          >
            <ZoomOut />
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-full hover:bg-gray-100"
            title="Reset"
          >
            {/* <RotateCcw className="w-6 h-6" /> */}
            <Rotate90DegreesCcw />
          </button>

          <button
            onClick={handleZoomIn}
            className="p-2 rounded-full hover:bg-gray-100"
            title="Zoom In"
          >
            {/* <ZoomIn className="w-6 h-6" /> */}
            <ZoomIn />
          </button>
        </div>
      )}
      <div
        className={`relative overflow-hidden ${containerClassName} h-fit`}
        style={{
          width: "100%",
        }}
        // onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: "center",
            transition: "transform 0.1s ease-out",
            width: "100%",
            height: "100%",
            cursor: isDragging ? "grabbing" : "grab",
          }}
        >
          <img
            src={src}
            alt={alt}
            className={`pointer-events-none object-contain ${imageClassName}`}
          />
        </div>
      </div>
    </div>
  );
};

export default ZoomableImage;
