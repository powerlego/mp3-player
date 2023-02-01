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
    expect(screen.findByTestId("artist-name")).toHaveValue("Test Artist");
  });
});
