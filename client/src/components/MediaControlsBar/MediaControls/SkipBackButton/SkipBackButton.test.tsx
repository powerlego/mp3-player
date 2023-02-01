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
});
