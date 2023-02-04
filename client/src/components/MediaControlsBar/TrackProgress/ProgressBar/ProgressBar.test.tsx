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
import ProgressBar from ".";

let progressRef: React.RefObject<HTMLDivElement>;

beforeAll(() => {
  progressRef = React.createRef();
});
beforeEach(() => {
  jest.clearAllMocks();
});
afterEach(() => {
  jest.clearAllMocks();
});

describe("ProgressBar", () => {
  it("should render", () => {
    const audio = new Audio("./src/assets/audio/test.mp3");
    render(<ProgressBar audio={audio} ref={progressRef} />);
  });
  it("should render with progress", async () => {
    const divElement = document.createElement("div");
    divElement.style.width = "75px";
    divElement.style.left = "0px";

    const mockRef = {
      current: {
        getBoundingClientRect: () => ({
          width: 60,
          left: 0,
        }),
      },
    } as React.RefObject<HTMLDivElement>;
    const audio = new Audio("./src/assets/audio/test.mp3");
    audio.currentTime = 1;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore: error TS2540: Cannot assign to 'duration' because it is a read-only property.
    audio.duration = 2;
    render(
      <ProgressBar
        audio={audio}
        ref={mockRef}
        style={{
          width: "75px",
          left: "0px",
        }}
      />,
      { container: document.body.appendChild(divElement) }
    );
    const progressBarContainer = screen.queryByTestId("progress-bar-container");
    if (!progressBarContainer) {
      throw new Error("Progress bar container not found");
    }
    fireEvent.mouseDown(progressBarContainer, { clientX: 30 });
    fireEvent.mouseUp(progressBarContainer);
    const progressBar = screen.queryByTestId("progress-bar");
    await waitFor(() => {
      expect(progressBar).toHaveStyle("width: 50.00%");
    });
  });

  // it("should use srcDuration if provided", () => {
  //   const audio = new Audio("./src/assets/audio/test.mp3");
  //   const progressComponent = render(<ProgressBar audio={audio} ref={progressRef} srcDuration={2} />);

  //   const progressBar = screen.queryByTestId("progress-bar");
  //   expect(progressBar).toHaveStyle("width: 50.00%");
  // });
  // it("should render 0 progress if audio is null", () => {
  //   render(<ProgressBar audio={null} ref={progressRef} />);
  //   const progressBar = screen.queryByTestId("progress-bar");
  //   expect(progressBar).toHaveStyle("width: 0%");
  // });
  // it("should render 0 progress when the mouse is down and audio is null", () => {
  //   render(<ProgressBar audio={null} ref={progressRef} />);
  //   const progressBarContainer = screen.queryByTestId("progress-bar-container");
  //   if (!progressBarContainer) {
  //     throw new Error("ProgressBar not found");
  //   }
  //   fireEvent.mouseDown(progressBarContainer, { clientX: 30 });
  //   fireEvent.mouseUp(progressBarContainer);
  //   const progressBar = screen.queryByTestId("progress-bar");
  //   expect(progressBar).toHaveStyle("width: 0%");
  // });

  // it("should have 0 progress when the mouse is far left of the progress bar", () => {
  //   const audio = new Audio("./src/assets/audio/test.mp3");
  //   render(<ProgressBar audio={audio} ref={progressRef} />);
  //   const progressBarContainer = screen.queryByTestId("progress-bar-container");
  //   if (!progressBarContainer) {
  //     throw new Error("ProgressBar not found");
  //   }
  //   fireEvent.mouseDown(progressBarContainer, { clientX: -50 });
  //   fireEvent.mouseUp(progressBarContainer);
  //   const progressBar = screen.queryByTestId("progress-bar");
  //   expect(progressBar).toHaveStyle("width: 0%");
  // });

  // it("should update the progress when the audio src changes", async () => {
  //   const audio = new Audio("./src/assets/audio/test.mp3");
  //   render(<ProgressBar audio={audio} progress={0.5} />);
  //   const progressBar = screen.queryByTestId("progress-bar");
  //   if (!progressBar) {
  //     throw new Error("ProgressBar not found");
  //   }
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore: error TS2540: Cannot assign to 'duration' because it is a read-only property.
  //   audio.duration = 3;
  //   fireEvent.durationChange(audio);
  //   await waitFor(() => {
  //     expect(progressBar).toHaveStyle("width: 0%");
  //   });
  // });
});
