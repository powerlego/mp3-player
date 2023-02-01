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
import ShuffleButton from ".";

describe("ShuffleButton", () => {
  it("should render", () => {
    render(<ShuffleButton />);
  });
  it("should be grayed out when audio is not available", () => {
    render(<ShuffleButton />);
    const shuffleIcon = screen.queryByTestId("shuffle-icon");
    expect(shuffleIcon).toHaveClass("fill-gray-450 hover:fill-gray-550 dark:fill-gray-550 hover:dark:fill-gray-150");
  });
  it("should be not grayed out when audio is available", () => {
    render(<ShuffleButton audio={new Audio("./assets/audio/test.mp3")} />);
    const shuffleIcon = screen.queryByTestId("shuffle-icon");
    expect(shuffleIcon).toHaveClass("fill-gray-600 hover:fill-gray-550 dark:fill-gray-500 hover:dark:fill-gray-350");
  });
  it("should be green when shuffle is on", () => {
    render(<ShuffleButton audio={new Audio("./assets/audio/test.mp3")} />);
    const shuffleButton = screen.queryByTestId("shuffle-button");
    if (!shuffleButton) {
      throw new Error("Shuffle button not found");
    }
    fireEvent.click(shuffleButton);
    const shuffleIcon = screen.queryByTestId("shuffle-icon");
    expect(shuffleIcon).toHaveClass(
      "fill-green-450 hover:fill-green-500 dark:fill-green-350 hover:dark:fill-green-450"
    );
  });
  it("should toggle shuffle when clicked when audio is available", () => {
    const toggleShuffle = jest.fn();
    render(<ShuffleButton audio={new Audio("./assets/audio/test.mp3")} toggleShuffle={toggleShuffle} />);
    const shuffleButton = screen.queryByTestId("shuffle-button");
    if (!shuffleButton) {
      throw new Error("Shuffle button not found");
    }
    fireEvent.click(shuffleButton);
    expect(toggleShuffle).toHaveBeenCalledTimes(1);
  });
  it("should not toggle shuffle when clicked when audio is not available", () => {
    const toggleShuffle = jest.fn();
    render(<ShuffleButton toggleShuffle={toggleShuffle} />);
    const shuffleButton = screen.queryByTestId("shuffle-button");
    if (!shuffleButton) {
      throw new Error("Shuffle button not found");
    }
    fireEvent.click(shuffleButton);
    expect(toggleShuffle).toHaveBeenCalledTimes(0);
  });
});
