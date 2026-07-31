"use client";

import { useEffect, useState } from "react";

const CustomCursor = () => {
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 });
  const [middlePosition, setMiddlePosition] = useState({ x: 0, y: 0 });
  const [outerPosition, setOuterPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let dotX = 0, dotY = 0;
    let middleX = 0, middleY = 0;
    let outerX = 0, outerY = 0;

    const moveCursor = (e: MouseEvent) => {
      dotX = e.clientX;
      dotY = e.clientY;
    };

    const animate = () => {
      // Smooth following for middle ring
      middleX += (dotX - middleX) * 0.15;
      middleY += (dotY - middleY) * 0.15;

      // Even smoother for outer ring
      outerX += (dotX - outerX) * 0.08;
      outerY += (dotY - outerY) * 0.08;

      setDotPosition({ x: dotX, y: dotY });
      setMiddlePosition({ x: middleX, y: middleY });
      setOuterPosition({ x: outerX, y: outerY });

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", moveCursor);
    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      {/* Center Dot */}
      <div
        className="cursor-dot"
        style={{
          left: `${dotPosition.x}px`,
          top: `${dotPosition.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Middle Ring */}
      <div
        className="cursor-middle"
        style={{
          left: `${middlePosition.x}px`,
          top: `${middlePosition.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Outer Ring */}
      <div
        className="cursor-outer"
        style={{
          left: `${outerPosition.x}px`,
          top: `${outerPosition.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      />
    </>
  );
};

export default CustomCursor;