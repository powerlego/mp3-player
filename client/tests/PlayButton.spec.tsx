/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from "react";
import PlayButton from "../src/components/MediaControlsBar/MediaControls/PlayButton";
import { test, expect } from "@playwright/experimental-ct-react";

test.use({ viewport: { width: 500, height: 500 } });
test.describe("PlayButton", () => {
  test("should render", async ({ mount }) => {
    const playButton = await mount(<PlayButton />);
    expect(playButton).toBeTruthy();
  });
  test("should be grayed out when audio is not available", async ({ mount }) => {
    const playButton = await mount(<PlayButton />);
    const playIcon = playButton.getByTestId("playing");
    await expect(playIcon).toHaveClass(
      "transition-all duration-300 ease-in-out fill-gray-350 dark:fill-gray-650 m-0 w-4 h-4 cursor-pointer"
    );
  });
  // test.it("should render", () => {
  //   render(<PlayButton />);
  // });
  // it("should be grayed out when audio is not available", () => {
  //   render(<PlayButton />);
  //   const playIcon = screen.queryByTestId("playing");
  //   expect(playIcon).toHaveClass("fill-gray-450 hover:fill-gray-550 dark:fill-gray-550 hover:dark:fill-gray-150");
  // });
  // it("should be not grayed out when audio is available", () => {
  //   render(<PlayButton audio={new Audio("./assets/audio/test.mp3")} />);
  //   const playIcon = screen.queryByTestId("play");
  //   expect(playIcon).toHaveClass("fill-gray-150 dark:fill-gray-800");
  // });
  // it("should toggle play/pause when clicked when audio is available", () => {
  //   const togglePlay = jest.fn();
  //   render(<PlayButton audio={new Audio("./assets/audio/test.mp3")} togglePlay={togglePlay} />);
  //   const playButton = screen.queryByTestId("play-button");
  //   if (!playButton) {
  //     throw new Error("Play button not found");
  //   }
  //   fireEvent.click(playButton);
  //   expect(togglePlay).toHaveBeenCalledTimes(1);
  // });

  // it("should not toggle play/pause when clicked when audio is not available", () => {
  //   const togglePlay = jest.fn();
  //   render(<PlayButton togglePlay={togglePlay} />);
  //   const playButton = screen.queryByTestId("play-button");
  //   if (!playButton) {
  //     throw new Error("Play button not found");
  //   }
  //   fireEvent.click(playButton);
  //   expect(togglePlay).toHaveBeenCalledTimes(0);
  // });

  // it("should set the play state to true when clicked and not playing", () => {
  //   const audio = new Audio("./assets/audio/test.mp3");
  //   const setStateMock = jest.fn();
  //   const togglePlay = () => {
  //     audio.dispatchEvent(new Event("play"));
  //   };
  //   const useStateMock: any = (initState: any) => [initState, setStateMock];
  //   jest.spyOn(React, "useState").mockImplementation(useStateMock);
  //   render(<PlayButton audio={audio} togglePlay={togglePlay} />);
  //   const playButton = screen.queryByTestId("play-button");
  //   if (!playButton) {
  //     throw new Error("Play button not found");
  //   }
  //   fireEvent.click(playButton);
  //   expect(setStateMock).toHaveBeenCalledWith(true);
  // });
  // it("should set the play state to false when clicked and already playing", () => {
  //   const audio = new Audio("./assets/audio/test.mp3");
  //   const setStateMock = jest.fn();
  //   const togglePlay = () => {
  //     audio.dispatchEvent(new Event("pause"));
  //   };
  //   const useStateMock: any = (initState: any) => [initState, setStateMock];
  //   jest.spyOn(React, "useState").mockImplementation(useStateMock);
  //   render(<PlayButton audio={audio} togglePlay={togglePlay} />);
  //   const playButton = screen.queryByTestId("play-button");
  //   if (!playButton) {
  //     throw new Error("Play button not found");
  //   }
  //   fireEvent.click(playButton);
  //   expect(setStateMock).toHaveBeenCalledWith(false);
  // });

  // it("should set play state to false when audio is finished", () => {
  //   const audio = new Audio("./assets/audio/test.mp3");
  //   const setStateMock = jest.fn();
  //   const togglePlay = () => {
  //     audio.dispatchEvent(new Event("ended"));
  //   };
  //   const useStateMock: any = (initState: any) => [initState, setStateMock];
  //   jest.spyOn(React, "useState").mockImplementation(useStateMock);
  //   render(<PlayButton audio={audio} togglePlay={togglePlay} />);
  //   const playButton = screen.queryByTestId("play-button");
  //   if (!playButton) {
  //     throw new Error("Play button not found");
  //   }
  //   fireEvent.click(playButton);
  //   expect(setStateMock).toHaveBeenCalledWith(false);
  // });

  // it("should show the pause icon when playing", async () => {
  //   const audio = new Audio("./assets/audio/test.mp3");
  //   const togglePlay = () => {
  //     audio.dispatchEvent(new Event("play"));
  //   };
  //   jest.spyOn(React, "useState").mockImplementation(() => [true, jest.fn()]);
  //   render(<PlayButton audio={audio} togglePlay={togglePlay} />);
  //   const playButton = screen.queryByTestId("play-button");
  //   if (!playButton) {
  //     throw new Error("Play button not found");
  //   }
  //   fireEvent.play(audio);
  //   await waitFor(() => {
  //     expect(screen.getByTestId("pause")).toBeInTheDocument();
  //   });
  // });
});
