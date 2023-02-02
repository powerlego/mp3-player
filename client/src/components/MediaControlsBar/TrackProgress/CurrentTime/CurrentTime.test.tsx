/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import CurrentTime from ".";

describe("CurrentTime", () => {
  it("should render", () => {
    render(<CurrentTime defaultCurrentTime="" timeFormat="auto" />);
  });
  it("should render with time", () => {
    render(<CurrentTime defaultCurrentTime="00:00" timeFormat="auto" />);
    const currentTime = screen.queryByTestId("current-time");
    expect(currentTime).toHaveTextContent("00:00");
  });
  it("should render with time format", () => {
    render(<CurrentTime defaultCurrentTime="00:00" timeFormat="auto" />);
    const currentTime = screen.queryByTestId("current-time");
    expect(currentTime).toHaveTextContent("00:00");
  });
  it("should not update time when audio is not present", () => {
    const audio = new Audio("./assets/audio/test.mp3");
    render(<CurrentTime defaultCurrentTime="00:00" timeFormat="auto" />);
    const currentTime = screen.queryByTestId("current-time");
    if (!currentTime) {
      throw new Error("Current time not found");
    }
    fireEvent.timeUpdate(audio);
    expect(currentTime).toHaveTextContent("00:00");
  });
  it("should display the audio's current time", () => {
    const audio = new Audio("./assets/audio/test.mp3");
    render(<CurrentTime audio={audio} defaultCurrentTime="00:00" timeFormat="auto" />);
    audio.currentTime = 20;
    const currentTime = screen.queryByTestId("current-time");
    if (!currentTime) {
      throw new Error("Current time not found");
    }
    fireEvent.timeUpdate(audio);
    expect(currentTime).toHaveTextContent("00:20");
  });
  it("should update the current time when the metadata is loaded", () => {
    const audio = new Audio("./assets/audio/test.mp3");
    render(<CurrentTime audio={audio} defaultCurrentTime="00:00" timeFormat="auto" />);
    audio.currentTime = 20;
    const currentTime = screen.queryByTestId("current-time");
    if (!currentTime) {
      throw new Error("Current time not found");
    }
    fireEvent.loadedMetadata(audio);
    expect(currentTime).toHaveTextContent("00:20");
  });
});
