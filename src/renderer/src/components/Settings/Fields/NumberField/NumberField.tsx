import { SettingsNumberField } from "@/types";
import Tooltip from "@renderer/components/Tooltip";
import { evaluate, round } from "mathjs";
import React from "react";

type NumberFieldProps = {
  className?: string;
  field: SettingsNumberField;
  value: number;
  onChange: (value: any) => void;
};

type NumberFieldState = {
  value: string | number;
  oldValue: number;
};

export default class NumberField extends React.Component<NumberFieldProps, NumberFieldState> {
  _timer: ReturnType<typeof setTimeout> | null = null;

  static SPEED = 50;
  static DELAY = 500;

  constructor(props: NumberFieldProps) {
    super(props);
    this.state = {
      value: this.props.value || 0,
      oldValue: this.props.value || 0,
    };
  }

  render() {
    return (
      <div className={`${this.className} field-number key-${this.field.key}`}>
        <div className="font-bold mb-3 text-base text-black dark:text-white">{this.label}</div>
        <Tooltip className="w-full" content={this.description}>
          <div className="flex flex-row w-full content-center rounded-lg m-[1px] p-1 bg-gray-100 dark:bg-gray-800 border border-solid border-gray-350 dark:border-gray-700 transition-[border-color] duration-300 ease-out focus-within:m-0 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:border-2 outline-nothing group">
            <input
              aria-label={this.label}
              className="w-full text-sm text-black dark:text-white bg-gray-100 dark:bg-gray-800 focus:outline-none"
              type="text"
              value={this.value}
              onBlur={this.eval.bind(this)}
              onChange={this.onChange.bind(this)}
            />
            <div className="w-5 flex flex-col gap-[1px]">
              <button
                aria-label="button"
                className="transition-[opacity, background-color] duration-300 ease-out opacity-0 group-hover:opacity-100 py-1 w-full h-1/2 rounded-t-md bg-gray-50 dark:bg-gray-650 hover:bg-gray-150 dark:hover:bg-gray-500 active:bg-gray-200 dark:active:bg-gray-700"
                onMouseDown={() => {
                  this.handleMouseDown("up");
                }}
                onMouseUp={() => {
                  this.handleMouseUp();
                }}
              >
                <svg
                  className="h-full w-3/4 mx-auto fill-none stroke-black dark:stroke-white stroke-2"
                  viewBox="0 0 26 16"
                >
                  <path className="non-scale-stroke" d="M 0.99999989,14.353554 13,2.3535533 25,14.353554" />
                </svg>
              </button>
              <button
                aria-label="button"
                className="opacity-0 transition-[opacity, background-color] duration-300 ease-out group-hover:opacity-100 w-full py-1 h-1/2 rounded-b-md bg-gray-50 dark:bg-gray-650 hover:bg-gray-150 dark:hover:bg-gray-500 active:bg-gray-200 dark:active:bg-gray-700"
                onMouseDown={() => {
                  this.handleMouseDown("down");
                }}
                onMouseUp={() => {
                  this.handleMouseUp();
                }}
              >
                <svg
                  className="h-full w-3/4 fill-none stroke-black dark:stroke-white stroke-2 mx-auto"
                  viewBox="0 0 26 16"
                >
                  <path className="non-scale-stroke" d="M 0.99999989,1.6464465 13,13.646447 25,1.6464465" />
                </svg>
              </button>
            </div>
          </div>
        </Tooltip>
      </div>
    );
  }

  get className() {
    return this.props.className || "";
  }

  get description() {
    return this.field.description || "";
  }
  get field() {
    return this.props.field;
  }

  get label() {
    return this.field.label;
  }

  get min() {
    return this.field.min ?? Number.MIN_SAFE_INTEGER;
  }

  get max() {
    return this.field.max ?? Number.MAX_SAFE_INTEGER;
  }

  get step() {
    return this.field.step ?? 1;
  }

  get precision() {
    const _precision = this.field.precision ?? 0;
    if (_precision < 0) {
      return 0;
    }
    return _precision;
  }

  get value() {
    return this.state.value ?? "";
  }

  stop() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  handleMouseUp() {
    this.stop();
    this.props.onChange(this.value);
  }

  handleMouseDown(dir: "up" | "down") {
    if (dir === "up") {
      this.increment();
    }
    else {
      this.decrement();
    }
  }

  handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      this.eval();
    }
  }

  increment(recurse = false) {
    this.stop();
    let value = this.value as number;
    value += this.step;
    if (value > this.max) {
      value = this.max;
    }
    this.setState({ value, oldValue: value });
    if (value < this.max || isNaN(value)) {
      this._timer = setTimeout(
        () => {
          this.increment(true);
        },
        recurse ? NumberField.SPEED : NumberField.DELAY
      );
    }
  }

  decrement(recurse = false) {
    this.stop();
    let value = this.value as number;
    value -= this.step;
    if (value < this.min) {
      value = this.min;
    }
    this.setState({ value, oldValue: value });
    if (value > this.min || isNaN(value)) {
      this._timer = setTimeout(
        () => {
          this.decrement(true);
        },
        recurse ? NumberField.SPEED : NumberField.DELAY
      );
    }
  }

  eval() {
    const value = this.value as string;
    try {
      let result = evaluate(value) as number | undefined;
      if (typeof result === "undefined" || isNaN(result)) {
        const oldValueClamped = this.clamp(this.state.oldValue);
        this.setState({ value: oldValueClamped, oldValue: oldValueClamped });
        return this.props.onChange(oldValueClamped);
      }
      result = round(result, this.precision);
      if (result < this.min || result > this.max) {
        const oldValueClamped = this.clamp(this.state.oldValue);
        this.setState({ value: oldValueClamped, oldValue: oldValueClamped });
        return this.props.onChange(oldValueClamped);
      }
      this.setState({ value: result, oldValue: result });
      return this.props.onChange(result);
    }
    catch (e) {
      const oldValueClamped = this.clamp(this.state.oldValue);
      this.setState({ value: oldValueClamped, oldValue: oldValueClamped });
      return this.props.onChange(oldValueClamped);
    }
  }

  clamp(value: number) {
    if (value < this.min) {
      return this.min;
    }
    if (value > this.max) {
      return this.max;
    }
    return value;
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ value: e.target.value });
  }
}
