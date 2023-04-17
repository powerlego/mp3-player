import { SettingsColorField } from "@/types";
import Tooltip from "@renderer/components/Tooltip";
import { ChromePicker, ColorState, Color, RGBColor, HSLColor, HEXColor } from "react-color";
import React from "react";

type ColorFieldProps = {
  className?: string;
  field: SettingsColorField;
  value: string | RGBColor | HSLColor | HEXColor;
  onChange: (value: any) => void;
};

type ColorFieldState = {
  displayColorPicker: boolean;
};

export default class ColorField extends React.Component<ColorFieldProps, ColorFieldState> {
  wrapperRef: React.RefObject<HTMLDivElement>;
  constructor(props: ColorFieldProps) {
    super(props);
    this.wrapperRef = React.createRef();
    this.state = {
      displayColorPicker: false,
    };
  }
  render() {
    return (
      <div className={`${this.className} field-color key-${this.field.key}`} ref={this.wrapperRef}>
        <div className="font-bold mb-3 text-base text-black dark:text-white">{this.label}</div>
        <Tooltip className="w-full" content={this.description}>
          <div className="relative">
            <div
              className="p-1 bg-gray-50 dark:bg-gray-800 inline-block rounded-[1px] cursor-pointer"
              style={{
                boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
              }}
              onClick={this.handleClick.bind(this)}
            >
              <div className="w-9 h-4 rounded-sm" style={this.style} />
            </div>
            {this.state.displayColorPicker
              ? (
                <div className="absolute z-10 top-0 left-12">
                  <ChromePicker
                    className="!bg-gray-50 dark:!bg-gray-800"
                    color={this.value}
                    disableAlpha={this.format === "hex"}
                    onChange={this.onChange.bind(this)}
                  />
                </div>
              )
              : (
                <></>
              )}
          </div>
        </Tooltip>
      </div>
    );
  }

  handleClick() {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  }

  handleClose() {
    this.setState({ displayColorPicker: false });
  }

  componentDidMount(): void {
    document.addEventListener("click", this.handleClickOutside.bind(this), true);
  }

  componentWillUnmount(): void {
    document.removeEventListener("click", this.handleClickOutside.bind(this), true);
  }

  handleClickOutside(e: MouseEvent) {
    if (this.wrapperRef.current && !this.wrapperRef.current.contains(e.target as Node)) {
      this.handleClose();
    }
  }

  get className() {
    return this.props.className ?? "";
  }

  get description() {
    return this.field.description ?? "";
  }
  get field() {
    return this.props.field;
  }

  get label() {
    return this.field.label;
  }

  get format() {
    return this.field.format;
  }

  get value() {
    if (typeof this.props.value === "undefined" || this.props.value === null) {
      switch (this.format) {
      case "hex":
        return "#ffffff";
      case "rgb":
        return { r: 255, g: 255, b: 255, a: 1 };
      case "hsl":
        return { h: 0, s: 0, l: 1, a: 1 };
      }
    }
    return this.props.value;
  }

  get style() {
    let style = "";
    switch (this.format) {
    case "rgb":
      if (typeof this.value === "object" && "r" in this.value) {
        style = `rgba(${this.value.r}, ${this.value.g}, ${this.value.b}, ${this.value.a ?? 1})`;
      }
      break;
    case "hsl":
      if (typeof this.value === "object" && "h" in this.value) {
        style = `hsla(${this.value.h}, ${this.value.s * 100}%, ${this.value.l * 100}%, ${this.value.a ?? 1})`;
      }
      break;
    case "hex":
      if (typeof this.value === "string") {
        style = this.value;
      }
      else {
        const hex = this.value as HEXColor;
        style = hex.hex;
      }
      break;
    default:
      if (typeof this.value === "object" && "hex" in this.value) {
        style = this.value.hex;
      }
      break;
    }
    return {
      background: style,
    };
  }

  onChange(color: ColorState) {
    let clr: Color = "";
    switch (this.format) {
    case "hex":
      clr = color.hex;
      break;
    case "rgb":
      clr = color.rgb;
      break;
    case "hsl":
      clr = color.hsl;
      break;
    }
    return this.props.onChange(clr);
  }
}
