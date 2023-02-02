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
import SongDetails from ".";

describe("SongDetails", () => {
  it("should render", () => {
    render(<SongDetails artistName="" coverArt="https://via.placeholder.com/150" songName="" />);
  });

  it("should render with artist name", () => {
    render(<SongDetails artistName="Test Artist" coverArt="https://via.placeholder.com/150" songName="" />);
    const artistName = screen.queryByTestId("artist-name");
    expect(artistName).toHaveTextContent("Test Artist");
  });
  it("should expand when clicked", () => {
    const toggleExpand = jest.fn();
    render(
      <SongDetails
        artistName="Test Artist"
        coverArt="https://via.placeholder.com/150"
        expandFunc={toggleExpand}
        songName=""
      />
    );
    const expandButton = screen.queryByTestId("expand-button");
    if (!expandButton) {
      throw new Error("Expand button not found");
    }
    fireEvent.click(expandButton);
    expect(toggleExpand).toBeCalledTimes(1);
  });
  it("should not expand when clicked if no expand function is provided", () => {
    render(<SongDetails artistName="Test Artist" coverArt="https://via.placeholder.com/150" songName="" />);
    const expandButton = screen.queryByTestId("expand-button");
    if (!expandButton) {
      throw new Error("Expand button not found");
    }
    fireEvent.click(expandButton);
  });
});
