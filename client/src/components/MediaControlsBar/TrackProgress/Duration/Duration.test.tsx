/**`
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Duration from ".";

beforeEach(() => {
  jest.clearAllMocks();
});
describe("Duration", () => {
  it("should render", () => {
    render(<Duration defaultDuration="" timeFormat="auto" />);
  });
  it("should render with time", () => {
    render(<Duration defaultDuration="00:00" timeFormat="auto" />);
    const duration = screen.queryByTestId("duration");
    expect(duration).toHaveTextContent("00:00");
  });
  it("should render with time format", () => {
    render(<Duration defaultDuration="00:00" timeFormat="auto" />);
    const duration = screen.queryByTestId("duration");
    expect(duration).toHaveTextContent("00:00");
  });
  it("should not update time when audio is not present", () => {
    const audio = new Audio("./src/assets/audio/test.mp3");
    render(<Duration defaultDuration="--:--" timeFormat="auto" />);
    const duration = screen.queryByTestId("duration");
    if (!duration) {
      throw new Error("Duration not found");
    }
    fireEvent.durationChange(audio);
    expect(duration).toHaveTextContent("--:--");
  });
  it("should display the audio's duration", async () => {
    const audio = new Audio("./test.mp3");
    render(<Duration audio={audio} defaultDuration="00:00" timeFormat="auto" />);
    const duration = screen.queryByTestId("duration");
    if (!duration) {
      throw new Error("Duration not found");
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: error TS2540: Cannot assign to 'duration' because it is a read-only property.
    audio.duration = 3;
    console.log(audio.duration);
    fireEvent.durationChange(audio);
    await waitFor(() => {
      expect(duration).toHaveTextContent("00:03");
    });
  });

  it("should update the duration when the audio src changes", async () => {
    const audio = new Audio("./src/assets/audio/test.mp3");
    render(<Duration audio={audio} defaultDuration="00:00" timeFormat="auto" />);
    const duration = screen.queryByTestId("duration");
    if (!duration) {
      throw new Error("Duration not found");
    }
    fireEvent.durationChange(audio);
    await waitFor(() => {
      expect(duration).toHaveTextContent("00:03");
    });
    audio.src = "./src/assets/audio/32.mp3";
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: error TS2540: Cannot assign to 'duration' because it is a read-only property.
    audio.duration = 32;
    fireEvent.durationChange(audio);
    await waitFor(() => {
      expect(duration).toHaveTextContent("00:32");
    });
  });

  // it("should update duration time state when audio duration changes", () => {
  //   const audio = new Audio("./assets/audio/test.mp3");
  //   const setStateMock = jest.fn();
  //   const useStateMock: any = (initState: any) => [initState, setStateMock];
  //   jest.spyOn(React, "useState").mockImplementation(useStateMock);
  //   render(<Duration audio={audio} defaultDuration="00:00" timeFormat="auto" />);
  //   const duration = screen.queryByTestId("duration");
  //   if (!duration) {
  //     throw new Error("Duration not found");
  //   }
  //   fireEvent.loadedMetadata(audio);
  //   void waitFor(() => {
  //     expect(duration).toHaveTextContent("00:03");
  //   });
  //   expect(setStateMock).toHaveBeenCalledWith("00:03");
  // });
});
