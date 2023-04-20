import { SettingsDropdownField } from "@/types";
import Tooltip from "@renderer/components/Tooltip";
import React from "react";

type DropdownFieldProps = {
  className?: string;
  field: SettingsDropdownField;
  value: string | number;
  onChange: (value: any) => void;
};

type DropdownFieldState = {
  isOpen: boolean;
  value: string | number;
  currentIndex: number;
};

export default class DropdownField extends React.Component<DropdownFieldProps, DropdownFieldState> {
  outsideClickRef: React.RefObject<HTMLDivElement>;
  options: JSX.Element[];
  optionsRefs: React.RefObject<HTMLOptionElement>[];

  constructor(props: DropdownFieldProps) {
    super(props);
    const optionsRefs = [
      React.createRef<HTMLOptionElement>(),
      ...props.field.options.map(() => React.createRef<HTMLOptionElement>()),
    ];
    const options = [
      <option key={0} ref={optionsRefs[0]} value="hide">
        -- Select One --
      </option>,
      ...props.field.options.map((option, index) => (
        <option aria-label={option.label} key={index + 1} ref={optionsRefs[index + 1]} value={option.value}>
          {option.label}
        </option>
      )),
    ];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    let currentIndex = options.findIndex((option) => option.props.value === props.value);
    if (currentIndex === -1) {
      currentIndex = 0;
    }
    this.outsideClickRef = React.createRef<HTMLDivElement>();
    this.options = options;
    this.optionsRefs = optionsRefs;
    this.state = {
      isOpen: false,
      value: props.value ?? "",
      currentIndex,
    };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleOutsideClick.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleOutsideClick.bind(this));
  }

  render() {
    const listOptions = this.options.map((option, index) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (option.props.value === "hide") {
        return (
          <li
            className="m-0 py-2 indent-4 transition-all duration-150 ease-in bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 hidden border-t border-solid border-gray-350 dark:border-gray-700 outline-nothing [&:nth-child(2)]:rounded-t-lg last:rounded-b-lg last:mb-1"
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            id={option.props.value}
            key={index}
            tabIndex={0}
            onClick={this.handleOptionClick.bind(this)}
          >
            {this.optionsRefs[index].current?.innerText}
          </li>
        );
      }
      return (
        <li
          className="m-0 py-2 indent-4 transition-all duration-150 ease-in bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-t border-solid border-gray-350 dark:border-gray-700 outline-nothing [&:nth-child(2)]:rounded-t-lg last:rounded-b-lg last:mb-1"
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          id={option.props.value}
          key={index}
          tabIndex={0}
          onClick={this.handleOptionClick.bind(this)}
        >
          {this.optionsRefs[index].current?.innerText}
        </li>
      );
    });

    return (
      <div className={`${this.className} field-dropdown key-${this.field.key}`}>
        <div className="font-bold mb-3 text-base text-black dark:text-white">{this.label}</div>
        <Tooltip className="w-full" content={this.description}>
          <div
            className="text-sm text-black dark:text-white cursor-pointer relative w-full h-10"
            ref={this.outsideClickRef}
          >
            <select
              aria-label={this.label}
              className="hidden invisible"
              value={this.value}
              onChange={this.onChange.bind(this)}
            >
              {this.options}
            </select>
            <ul
              className={`absolute top-full w-full z-[999] m-0 p-0 list-none peer outline-nothing ${
                this.isOpen ? "block" : "hidden"
              }`}
            >
              {listOptions}
            </ul>
            <div
              tabIndex={0}
              className={`absolute w-full rounded-lg py-2 px-4 bg-gray-100 dark:bg-gray-800 border border-solid border-gray-350 dark:border-gray-700 outline-nothing transition-[border-color] duration-300 ease-out focus:m-0 focus:border-blue-500 focus:border-2 dark:focus:border-blue-400 peer-focus-within:m-0 peer-focus-within:border-blue-500 peer-focus-within:border-2 peer-focus-within:focus:border-blue-400 after:w-0 after:h-0 after:absolute after:right-3 after:border-8 after:border-transparent after:border-solid ${
                this.state.isOpen
                  ? "after:top-1.5 after:border-b-gray-900 dark:after:border-b-gray-200"
                  : "after:top-3.5 after:border-t-gray-900 dark:after:border-t-gray-200"
              }`}
              onClick={() => this.setState({ isOpen: !this.isOpen })}
            >
              {this.optionsRefs[this.currentIndex].current?.innerText}
            </div>
          </div>
        </Tooltip>
      </div>
    );
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

  get value() {
    return this.state.value;
  }

  get currentIndex() {
    return this.state.currentIndex;
  }

  get isOpen() {
    return this.state.isOpen;
  }

  handleOutsideClick(e: MouseEvent) {
    if (this.outsideClickRef.current && !this.outsideClickRef.current.contains(e.target as Node)) {
      this.setState({ isOpen: false });
    }
  }

  handleOptionClick(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    const value = e.currentTarget.id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const currentIndex = this.options.findIndex((option) => option.props.value === value);
    this.setState({ value, currentIndex, isOpen: false });
    return this.props.onChange(value);
  }

  onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    return this.props.onChange(e.target.value);
  }
}
