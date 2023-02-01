/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import MediaControls from ".";

describe("MediaControls", () => {
  it("should render", () => {
    const audio = new Audio("./assets/audio/test.mp3");
    render(<MediaControls audio={audio} />);
  });
  it("should respond to click", () => {
    const audio = new Audio("./assets/audio/test.mp3");
    const togglePlay = jest.fn();
    render(<MediaControls audio={audio} togglePlay={togglePlay} />);
    const playButton = screen.queryByTestId("play-button");
    if (!playButton) {
      throw new Error("Play button not found");
    }
    fireEvent.click(playButton);
    expect(togglePlay).toHaveBeenCalledTimes(1);
  });
});
