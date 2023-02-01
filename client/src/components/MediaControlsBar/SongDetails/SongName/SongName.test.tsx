/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from "react";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import SongName from ".";

describe("SongName", () => {
  it("should render", () => {
    render(<SongName songName="" />);
  });
});
