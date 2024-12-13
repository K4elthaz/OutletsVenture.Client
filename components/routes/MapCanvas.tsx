"use client";
import { useRef, useEffect, useState } from "react";

interface MapCanvasProps {
  imageSrc: string;
  initialPoints: Point[];
}

type Point = [number, number];

const MapCanvas: React.FC<MapCanvasProps> = ({ imageSrc, initialPoints }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [points, setPoints] = useState<Point[]>(initialPoints);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imgRef.current;

    if (canvas && ctx && img) {
      img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        drawOriginIcon(ctx); // Draw the origin icon immediately
      };
    }
  }, []);

  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animateRoute();
  }, [points]);

  useEffect(() => {
    setPoints(initialPoints);
  }, [initialPoints]);

  const drawOriginIcon = (ctx: CanvasRenderingContext2D) => {
    const originIcon = new Image();
    originIcon.src = "/origin.png";

    originIcon.onload = () => {
      if (points.length > 0) {
        const [originX, originY] = points[0];
        ctx.drawImage(originIcon, originX - 15, originY - 15, 60, 60);
      }
    };
  };

  const animateRoute = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || points.length < 2) return;

    let progress = 0;
    const totalSegments = points.length - 1;

    const drawSegment = (
      ctx: CanvasRenderingContext2D,
      segmentIndex: number,
      segmentProgress: number
    ) => {
      const [x1, y1] = points[segmentIndex];
      const [x2, y2] = points[segmentIndex + 1];
      const currentX = x1 + (x2 - x1) * segmentProgress;
      const currentY = y1 + (y2 - y1) * segmentProgress;

      // Draw white line (outline)
      ctx.strokeStyle = "white";
      ctx.lineWidth = 17;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();

      // Draw red line (foreground)
      ctx.strokeStyle = "red";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
    };

    const step = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !canvas || !imgRef.current) return;

      const img = imgRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      drawOriginIcon(ctx);

      const completedSegments = Math.floor(progress);
      const segmentProgress = progress - completedSegments;

      // Draw completed segments (both white and red)
      for (let i = 0; i < completedSegments; i++) {
        const [x1, y1] = points[i];
        const [x2, y2] = points[i + 1];

        // White line
        ctx.strokeStyle = "white";
        ctx.lineWidth = 17;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Red line
        ctx.strokeStyle = "red";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Animate the current segment
      if (completedSegments < totalSegments) {
        drawSegment(ctx, completedSegments, segmentProgress);
      }

      if (progress < totalSegments) {
        progress += 0.02; // Adjust speed by modifying this value
        animationRef.current = requestAnimationFrame(step);
      } else {
        drawDestinationIcon(ctx);
      }
    };

    step();
  };

  const drawDestinationIcon = (ctx: CanvasRenderingContext2D) => {
    const destinationIcon = new Image();
    destinationIcon.src = "/destination.png";

    destinationIcon.onload = () => {
      if (points.length > 1) {
        const [destX, destY] = points[points.length - 1];
        ctx.drawImage(destinationIcon, destX - 15, destY - 15, 60, 60);
      }
    };
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ position: "relative", marginBottom: "20px" }}>
        <img
          ref={imgRef}
          src={imageSrc}
          alt="map"
          style={{ display: "none" }}
        />
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "auto", cursor: "crosshair" }}
        />
      </div>
    </div>
  );
};

export default MapCanvas;
