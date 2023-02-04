/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent, screen, waitFor, cleanup } from "@testing-library/react";
import PlayButton from ".";
import { debug } from "console";

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});
describe("PlayButton", () => {
  it("should render", () => {
    render(<PlayButton />);
  });
  it("should be grayed out when audio is not available", () => {
    render(<PlayButton />);
    const playIcon = screen.queryByTestId("playing");
    expect(playIcon).toHaveClass("fill-gray-450 hover:fill-gray-550 dark:fill-gray-550 hover:dark:fill-gray-150");
  });
  it("should be not grayed out when audio is available", () => {
    render(<PlayButton audio={new Audio("./assets/audio/test.mp3")} />);
    const playIcon = screen.queryByTestId("play");
    expect(playIcon).toHaveClass("fill-gray-150 dark:fill-gray-800");
  });
  it("should toggle play/pause when clicked when audio is available", () => {
    const togglePlay = jest.fn();
    render(<PlayButton audio={new Audio("./assets/audio/test.mp3")} togglePlay={togglePlay} />);
    const playButton = screen.queryByTestId("play-button");
    if (!playButton) {
      throw new Error("Play button not found");
    }
    fireEvent.click(playButton);
    expect(togglePlay).toHaveBeenCalledTimes(1);
  });

  it("should not toggle play/pause when clicked when audio is not available", () => {
    const togglePlay = jest.fn();
    render(<PlayButton togglePlay={togglePlay} />);
    const playButton = screen.queryByTestId("play-button");
    if (!playButton) {
      throw new Error("Play button not found");
    }
    fireEvent.click(playButton);
    expect(togglePlay).toHaveBeenCalledTimes(0);
  });

  it("should set the play state to true when clicked and not playing", () => {
    const audio = new Audio("./assets/audio/test.mp3");
    const setStateMock = jest.fn();
    const togglePlay = () => {
      audio.dispatchEvent(new Event("play"));
    };
    const useStateMock: any = (initState: any) => [initState, setStateMock];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);
    render(<PlayButton audio={audio} togglePlay={togglePlay} />);
    const playButton = screen.queryByTestId("play-button");
    if (!playButton) {
      throw new Error("Play button not found");
    }
    fireEvent.click(playButton);
    expect(setStateMock).toHaveBeenCalledWith(true);
  });
  it("should set the play state to false when clicked and already playing", () => {
    const audio = new Audio("./assets/audio/test.mp3");
    const setStateMock = jest.fn();
    const togglePlay = () => {
      audio.dispatchEvent(new Event("pause"));
    };
    const useStateMock: any = (initState: any) => [initState, setStateMock];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);
    render(<PlayButton audio={audio} togglePlay={togglePlay} />);
    const playButton = screen.queryByTestId("play-button");
    if (!playButton) {
      throw new Error("Play button not found");
    }
    fireEvent.click(playButton);
    expect(setStateMock).toHaveBeenCalledWith(false);
  });

  it("should set play state to false when audio is finished", () => {
    const audio = new Audio("./assets/audio/test.mp3");
    const setStateMock = jest.fn();
    const togglePlay = () => {
      audio.dispatchEvent(new Event("ended"));
    };
    const useStateMock: any = (initState: any) => [initState, setStateMock];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);
    render(<PlayButton audio={audio} togglePlay={togglePlay} />);
    const playButton = screen.queryByTestId("play-button");
    if (!playButton) {
      throw new Error("Play button not found");
    }
    fireEvent.click(playButton);
    expect(setStateMock).toHaveBeenCalledWith(false);
  });
});
