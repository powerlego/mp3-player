/* eslint-disable @typescript-eslint/naming-convention */
import React from "react";

type ImageCardProps = {
  src: string;
  line1: string;
  line2: string;
  loading?: "lazy" | "eager";
  onClickButton?: () => void;
  onClickCard?: () => void;
  icon?: React.ReactNode;
};

interface CustomCSSProperties extends React.CSSProperties {
  "--card-container-border-radius"?: number | string;
  "--card-image-border-radius"?: number | string;
}

export function ImageCardSkeleton() {
  return (
    <div
      className="bg-gray-250 dark:bg-gray-800 group isolate relative w-full p-4 hover:bg-gray-300 hover:dark:bg-gray-750 transition-[background-color] duration-300 ease-[ease]"
      style={
        {
          "--card-container-border-radius": "clamp(4px,(var(--column-width,0px) - 32px) * 0.025,8px)",
          borderRadius: "calc(var(--card-container-border-radius) + 2px)",
        } as CustomCSSProperties
      }
    >
      <div className="h-full select-none">
        <div className="mb-4 relative">
          <div
            className="relative pb-[100%]"
            style={
              {
                "--card-image-border-radius": "clamp(4px,(var(--column-width,0px) - 32px) * 0.025,8px)",
                borderRadius: "var(--card-image-border-radius)",
                boxShadow: "0 8px 24px rgb(0 0 0 / 50%)",
              } as CustomCSSProperties
            }
          >
            <div
              className="absolute top-0 left-0 h-full w-full bg-gray-350 dark:bg-gray-700 animate-pulse"
              style={
                {
                  "--card-image-border-radius": "clamp(4px,(var(--column-width,0px) - 32px) * 0.025,8px)",
                  borderRadius: "var(--card-image-border-radius)",
                } as CustomCSSProperties
              }
            />
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="w-full h-5 rounded-full bg-gray-350 dark:bg-gray-700 animate-pulse" />
          <div className="w-2/3 h-4 rounded-full bg-gray-350 dark:bg-gray-700 animate-pulse mt-2" />
        </div>
      </div>
    </div>
  );
}

export default function ImageCard({ src, line1, line2, loading, onClickButton, icon, onClickCard }: ImageCardProps) {
  return (
    <div
      className="bg-gray-250 dark:bg-gray-800 group isolate relative w-full p-4 hover:bg-gray-300 hover:dark:bg-gray-750 transition-[background-color] duration-300 ease-[ease]"
      style={
        {
          "--card-container-border-radius": "clamp(4px,(var(--column-width,0px) - 32px) * 0.025,8px)",
          borderRadius: "calc(var(--card-container-border-radius) + 2px)",
        } as CustomCSSProperties
      }
    >
      <div className="h-full select-none">
        <div className="mb-4 relative">
          <div
            className="relative pb-[100%] bg-gray-350 dark:bg-gray-750"
            style={
              {
                "--card-image-border-radius": "clamp(4px,(var(--column-width,0px) - 32px) * 0.025,8px)",
                borderRadius: "var(--card-image-border-radius)",
                boxShadow: "0 8px 24px rgb(0 0 0 / 50%)",
              } as CustomCSSProperties
            }
          >
            <img
              className="h-full w-full absolute top-0 left-0 object-cover animate-imageFadeInAnimation"
              loading={loading || "lazy"}
              src={src}
              style={
                {
                  animationFillMode: "forwards",
                  animationIterationCount: "1",
                  "--card-image-border-radius": "clamp(4px,(var(--column-width,0px) - 32px) * 0.025,8px)",
                  borderRadius: "var(--card-image-border-radius)",
                  objectPosition: "center center",
                } as CustomCSSProperties
              }
            />
          </div>
          {onClickButton
            ? (
              <div
                className="bottom-2 right-2 rounded-full z-[2] opacity-0 pointer-events-none absolute transition-all duration-300 ease-[ease] translate-y-2 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 outline-nothing"
                style={{
                  boxShadow: "0 8px 8px rgb(0 0 0 / 30%)",
                }}
              >
                <button
                  className="relative z-[1] transition-[background-color, border-color, color, box-shadow, filter, transform] select-none touch-manipulation inline-block duration-[33ms] group/button cursor-default outline-nothing"
                  onClick={onClickButton}
                >
                  {icon}
                </button>
              </div>
            )
            : (
              <></>
            )}
        </div>
        <div className="min-h-[62px]">
          <a
            className="relative z-[1] inline-block w-full align-middle select-none touch-manipulation cursor-pointer"
            title={line1}
          >
            <div
              className="box-border overflow-hidden text-ellipsis whitespace-nowrap font-bold text-base text-gray-800 dark:text-gray-100"
              style={{
                marginBlock: "0px",
                paddingBlockEnd: "4px",
              }}
            >
              {line1}
            </div>
          </a>
          <div
            className="text-[0.8125rem] md:text-sm box-border font-normal text-gray-700 dark:text-gray-300 overflow-hidden mt-1 text-ellipsis whitespace-nowrap"
            style={{
              marginBlock: "0px",
            }}
          >
            <span>{line2}</span>
          </div>
        </div>
        <div
          className="absolute z-0 bottom-0 top-0 left-0 right-0 overflow-hidden cursor-pointer"
          onClick={onClickCard}
        />
      </div>
    </div>
  );
}
