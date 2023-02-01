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
import SkipBackButton from ".";

describe("SkipBackButton", () => {
  it("should render", () => {
    render(<SkipBackButton />);
  });
  it("should respond to click", () => {
    const skipBack = jest.fn();
    render(<SkipBackButton skipBack={skipBack} />);
    const skipBackButton = screen.queryByTestId("skip-back-button");
    if (!skipBackButton) {
      throw new Error("Skip back button not found");
    }
    fireEvent.click(skipBackButton);
    expect(skipBack).toHaveBeenCalledTimes(1);
  });
});
