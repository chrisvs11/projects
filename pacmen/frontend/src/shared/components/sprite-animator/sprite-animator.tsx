"use client"

import { FC, useEffect, useRef, useState } from "react";

interface SpriteAnimatorProps {
  src: string;
  frameWidth: {x:number,y:number};
  numFrames: number;
  fps: number;
  offsetX: number;
  offsetY: number;
  loopType?: "loop" | "ping-pong";
  isPlaying?: boolean;
  spriteDirection?: "horizontal" | "vertical";
  scale?:number
}

export const SpriteAnimator: FC<SpriteAnimatorProps> = ({
  src,
  frameWidth,
  numFrames,
  fps,
  offsetX,
  offsetY,
  loopType = "loop",
  isPlaying = true,
  spriteDirection = "horizontal",
  scale=1
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [direction, setDirection] = useState<number>(1);

  useEffect(() => {

    if (!isPlaying) return;

    let frameInterval: number;
    let lastUpdate = 0;

    const updateAnimation = (timestamp: number) => {
      const progress = timestamp - lastUpdate;

      if (progress > 1000 / fps) {
        lastUpdate = timestamp;
        setCurrentFrame((prev) => {
          const nextFrame = prev + direction;

          if (loopType === "loop") {
            return (nextFrame + numFrames) % numFrames;
          } else {
            if (nextFrame >= numFrames || nextFrame < 0) {
              setDirection(-direction);
              console.log(nextFrame);
              return Math.max(0, Math.min(numFrames - 1, nextFrame));
            } else {
              return nextFrame;
            }
          }
        });
      }

      frameInterval = requestAnimationFrame(updateAnimation);
    };

    frameInterval = requestAnimationFrame(updateAnimation);

    return () => cancelAnimationFrame(frameInterval);
  }, [fps, numFrames, src]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const sprite = new Image();
    (sprite.src = src),
      (sprite.onload = () => {
        ctx?.clearRect(0, 0, frameWidth.x * scale, frameWidth.y * scale);
        ctx!.imageSmoothingEnabled = false
        ctx?.drawImage(
          sprite,
          spriteDirection === "horizontal"
            ? offsetX + currentFrame * frameWidth.x
            : offsetX,
          spriteDirection === "vertical"
            ? offsetY + currentFrame * frameWidth.y
            : offsetY,
          frameWidth.x,
          frameWidth.y,
          0,
          0,
          frameWidth.x * scale,
          frameWidth.y * scale
        );
      });
  }, [currentFrame, src, frameWidth, frameWidth]);

  return (
    <div>
      <canvas ref={canvasRef} width={frameWidth.x*scale} height={frameWidth.y*scale}></canvas>
    </div>
  );
};
