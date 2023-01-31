/**
 * @jest-environment jsdom
 */

/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import RepeatButton from ".";

describe("RepeatButton", () => {
  it("should render", () => {
    render(<RepeatButton />);
  });
  it("should be grayed out when not repeating", () => {
    render(<RepeatButton />);
    const repeatIcon = screen.queryByTestId("repeat-icon");
    expect(repeatIcon).toHaveClass("fill-gray-450 hover:fill-gray-550 dark:fill-gray-550 hover:dark:fill-gray-150");
  });
  it("should be green when repeating", () => {
    render(<RepeatButton />);
    const repeatButton = screen.queryByTestId("repeat-button");
    if (!repeatButton) {
      throw new Error("repeatButton is null");
    }
    fireEvent.click(repeatButton);
    const repeatIcon = screen.queryByTestId("repeat-icon");
    expect(repeatIcon).toHaveClass("fill-green-450 hover:fill-green-500 dark:fill-green-350 hover:dark:fill-green-450");
  });

  it("should be green when repeating once", () => {
    render(<RepeatButton />);
    const repeatButton = screen.queryByTestId("repeat-button");
    if (!repeatButton) {
      throw new Error("repeatButton is null");
    }
    fireEvent.click(repeatButton);
    fireEvent.click(repeatButton);
    const repeatIcon = screen.queryByTestId("repeat-icon");
    expect(repeatIcon).toHaveClass("fill-green-450 hover:fill-green-500 dark:fill-green-350 hover:dark:fill-green-450");
  });

  it("should repeat all when clicked once", () => {
    render(<RepeatButton />);
    const repeatButton = screen.queryByTestId("repeat-button");
    if (!repeatButton) {
      throw new Error("repeatButton is null");
    }
    fireEvent.click(repeatButton);
    const repeatIcon = screen.queryByTestId("repeat-icon");
    expect(repeatIcon).toHaveAttribute("id", "repeat-all");
  });
  it("should repeat once when clicked twice", () => {
    render(<RepeatButton />);
    const repeatButton = screen.queryByTestId("repeat-button");
    if (!repeatButton) {
      throw new Error("repeatButton is null");
    }
    fireEvent.click(repeatButton);
    fireEvent.click(repeatButton);
    const repeatIcon = screen.queryByTestId("repeat-icon");
    expect(repeatIcon).toHaveAttribute("id", "repeat-one");
  });
  it("should not repeat when clicked thrice", () => {
    render(<RepeatButton />);
    const repeatButton = screen.queryByTestId("repeat-button");
    if (!repeatButton) {
      throw new Error("repeatButton is null");
    }
    fireEvent.click(repeatButton);
    fireEvent.click(repeatButton);
    fireEvent.click(repeatButton);
    const repeatIcon = screen.queryByTestId("repeat-icon");
    expect(repeatIcon).toHaveAttribute("id", "repeat-none");
  });
});
