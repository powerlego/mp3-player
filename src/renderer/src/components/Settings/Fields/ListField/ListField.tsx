import { SettingsListField } from "@/types";
import Tooltip from "@renderer/components/Tooltip";
import React from "react";
import ReactModal from "react-modal";
import "./ListField.css";

ReactModal.setAppElement("#settings");

type ListFieldProps = {
  className?: string;
  field: SettingsListField;
  value: string[];
  onChange: (value: any) => void;
};

type ListFieldState = {
  showInputModal: boolean;
  itemToAdd: string;
  selectedIndex: number;
  selectedValue: string;
};

export default class ListField extends React.Component<ListFieldProps, ListFieldState> {
  constructor(props: ListFieldProps) {
    super(props);
    this.state = {
      showInputModal: false,
      itemToAdd: "",
      selectedIndex: 0,
      selectedValue: "",
    };
  }
  render() {
    return (
      <div className={`${this.className} field-list key-${this.field.key}`}>
        <div aria-label={this.label} className="font-bold mb-3 text-base text-black dark:text-white">
          {this.label}
        </div>
        <Tooltip className="w-full" content={this.description}>
          <div>
            <select
              className="min-w-1/4 text-sm text-black dark:text-white bg-gray-100 dark:bg-gray-800 border border-solid border-gray-350 dark:border-gray-700 rounded-lg m-0.5 p-0 outline-nothing transition-[border-color] duration-300 ease-out focus:m-0 focus:border-blue-500 focus:border-2 dark:focus:border-blue-400 group"
              size={this.size}
              value={this.state.selectedValue}
              onChange={this.selectItem.bind(this)}
            >
              {this.value.map((item, index) => {
                return (
                  <option
                    aria-label={item}
                    className="px-1 py-0.5 checked:bg-gray-200 dark:checked:bg-gray-700 text-black dark:text-white group-focus:checked:!bg-blue-500 dark:group-focus:checked:!bg-blue-400"
                    key={index}
                    value={item}
                  >
                    {item}
                  </option>
                );
              })}
            </select>
            <div className="ml-0.5 mt-0.5">
              <button
                aria-label="Add"
                className="bg-gray-50 dark:bg-gray-800 cursor-pointer border-t border-r border-b border-solid border-gray-800 dark:border-gray-300 p-1 text-sm first:border first:rounded-tl-lg first:rounded-bl-lg last:border last:border-l-0 last:rounded-tr-lg last:rounded-br-lg enabled:active:border-blue-500 dark:enabled:active:border-blue-400 enabled:active:text-blue-500 dark:enabled:active:text-blue-400 disabled:bg-gray-100 dark:disabled:bg-gray-850 disabled:text-gray-450 dark:disabled:text-gray-200 enabled:hover:bg-gray-100 dark:enabled:hover:bg-gray-700 transition ease-in-out disabled:cursor-default"
                disabled={this.max > 0 && this.length >= this.max}
                onClick={this.addItem.bind(this)}
              >
                <span className="px-2">+</span>
              </button>
              <button
                aria-label="Remove"
                className="bg-gray-50 dark:bg-gray-800 cursor-pointer border-t border-r border-b border-solid border-gray-800 dark:border-gray-300 p-1 text-sm first:border first:rounded-tl-lg first:rounded-bl-lg last:border last:border-l-0 last:rounded-tr-lg last:rounded-br-lg enabled:active:border-blue-500 dark:enabled:active:border-blue-400 enabled:active:text-blue-500 dark:enabled:active:text-blue-400 disabled:bg-gray-100 dark:disabled:bg-gray-850 disabled:text-gray-450 dark:disabled:text-gray-200 enabled:hover:bg-gray-100 dark:enabled:hover:bg-gray-700 transition ease-in-out disabled:cursor-default"
                disabled={this.min >= this.length}
                onClick={this.removeItem.bind(this)}
              >
                <span className="px-2">-</span>
              </button>
              {this.orderable && (
                <>
                  <button
                    aria-label="Move Up"
                    className="bg-gray-50 dark:bg-gray-800 cursor-pointer border-t border-r border-b border-solid border-gray-800 dark:border-gray-300 p-1 text-sm first:border first:rounded-tl-lg first:rounded-bl-lg last:border last:border-l-0 last:rounded-tr-lg last:rounded-br-lg enabled:active:border-blue-500 dark:enabled:active:border-blue-400 enabled:active:text-blue-500 dark:enabled:active:text-blue-400 disabled:bg-gray-100 dark:disabled:bg-gray-850 disabled:text-gray-450 dark:disabled:text-gray-200 enabled:hover:bg-gray-100 dark:enabled:hover:bg-gray-700 transition ease-in-out disabled:cursor-default"
                    disabled={this.state.selectedIndex <= 0}
                    onClick={this.moveItemUp.bind(this)}
                  >
                    <span className="px-2">↑</span>
                  </button>
                  <button
                    aria-label="Move Down"
                    className="bg-gray-50 dark:bg-gray-800 cursor-pointer border-t border-r border-b border-solid border-gray-800 dark:border-gray-300 p-1 text-sm first:border first:rounded-tl-lg first:rounded-bl-lg last:border last:border-l-0 last:rounded-tr-lg last:rounded-br-lg enabled:active:border-blue-500 dark:enabled:active:border-blue-400 enabled:active:text-blue-500 dark:enabled:active:text-blue-400 disabled:bg-gray-100 dark:disabled:bg-gray-850 disabled:text-gray-450 dark:disabled:text-gray-200 enabled:hover:bg-gray-100 dark:enabled:hover:bg-gray-700 transition ease-in-out disabled:cursor-default"
                    disabled={this.state.selectedIndex >= this.length - 1}
                    onClick={this.moveItemDown.bind(this)}
                  >
                    <span className="px-2">↓</span>
                  </button>
                </>
              )}
            </div>
            <ReactModal
              closeTimeoutMS={this.modalCloseTimeoutMS}
              contentLabel="Add Item"
              isOpen={this.state.showInputModal}
              shouldCloseOnOverlayClick={true}
              style={{
                content: {
                  top: "50%",
                  left: "50%",
                  right: "auto",
                  bottom: "auto",
                  marginRight: "-50%",
                  transform: "translate(-50%, -50%)",
                  width: "320px",
                },
              }}
            >
              <div className="w-full flex flex-col justify-end text-sm">
                <div>
                  <label className="block font-bold text-black dark:text-white">{this.addItemLabel}</label>
                  <input
                    aria-label={this.addItemLabel}
                    autoFocus={true}
                    className="block w-full text-sm rounded-lg m-0.5 p-2 bg-gray-100 dark:bg-gray-800 border border-solid border-gray-350 dark:border-gray-700 transition-[border-color] duration-300 ease-out focus:m-0 focus:border-blue-500 dark:focus:border-blue-400 focus:border-2 text-black dark:text-white outline-nothing"
                    type="text"
                    value={this.state.itemToAdd}
                    onChange={this.itemToAddChange.bind(this)}
                  />
                </div>
                <div className="mt-5 w-full flex flex-row justify-end">
                  <button
                    aria-label="Cancel"
                    className="bg-gray-50 dark:bg-gray-800 flex-auto flex-grow-0 rounded-lg p-1.5 m-1 border-2 border-solid border-gray-400 dark:border-gray-600 text-black dark:text-white disabled:border-gray-300 dark:disabled:opacity-70 enabled:active:border-blue-500 dark:enabled:active:border-blue-400 enabled:hover:bg-gray-100 dark:enabled:hover:bg-gray-700 transition ease-in-out disabled:cursor-default"
                    onClick={this.cancelAdd.bind(this)}
                  >
                    Cancel
                  </button>
                  <button
                    aria-label="Save"
                    className="bg-gray-50 dark:bg-gray-800 flex-auto flex-grow-0 rounded-lg p-1.5 m-1 border-2 border-solid border-gray-400 dark:border-gray-600 text-black dark:text-white disabled:border-gray-300 dark:disabled:opacity-70 enabled:active:border-blue-500 dark:enabled:active:border-blue-400 enabled:hover:bg-gray-100 dark:enabled:hover:bg-gray-700 transition ease-in-out disabled:cursor-default"
                    disabled={this.addItemValidator.test(this.state.itemToAdd) === false}
                    onClick={this.saveItem.bind(this)}
                  >
                    Save
                  </button>
                </div>
              </div>
            </ReactModal>
          </div>
        </Tooltip>
      </div>
    );
  }

  selectItem(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({ selectedIndex: e.target.selectedIndex, selectedValue: e.target.value });
  }

  itemToAddChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ itemToAdd: e.target.value });
  }

  addItem() {
    this.setState({ showInputModal: true });
  }

  cancelAdd() {
    this.setState({ showInputModal: false, itemToAdd: "" });
  }

  saveItem() {
    if (typeof this.state.itemToAdd !== "undefined" && this.state.itemToAdd !== null && this.state.itemToAdd !== "") {
      this.props.onChange([...this.value, this.state.itemToAdd]);
    }

    this.setState({ showInputModal: false, itemToAdd: "" });
  }

  removeItem() {
    if (this.state.selectedIndex >= 0) {
      const { selectedIndex } = this.state;
      const newIdx = selectedIndex === 0 ? 0 : selectedIndex - 1;
      const newSelectedValue = this.value[newIdx];
      this.props.onChange(this.value.filter((_, index) => index !== this.state.selectedIndex));
      this.setState({ selectedIndex: newIdx, selectedValue: newSelectedValue });
    }
  }

  moveItemUp() {
    const { selectedIndex } = this.state;
    if (selectedIndex >= 1) {
      const newIdx = selectedIndex - 1;
      this.props.onChange([
        ...this.value.slice(0, newIdx),
        this.value[selectedIndex],
        this.value[newIdx],
        ...this.value.slice(selectedIndex + 1),
      ]);
      this.setState({ selectedIndex: this.state.selectedIndex - 1 });
    }
  }

  moveItemDown() {
    const { selectedIndex } = this.state;
    if (selectedIndex <= this.value.length - 2) {
      const newIndex = selectedIndex + 1;
      this.props.onChange([
        ...this.value.slice(0, selectedIndex),
        this.value[newIndex],
        this.value[selectedIndex],
        ...this.value.slice(newIndex + 1),
      ]);
      this.setState({ selectedIndex: this.state.selectedIndex + 1 });
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

  get value() {
    return this.props.value ?? [];
  }

  get size() {
    return this.field.size ?? 10;
  }

  get orderable() {
    return this.field.orderable ?? false;
  }

  get length() {
    const { value } = this;
    return Array.isArray(value) ? value.length : value ? 1 : 0;
  }

  get min() {
    return Math.max(this.field.min ?? 0, 0);
  }

  get max() {
    return Math.max(this.field.max ?? 0, 0);
  }

  get modalCloseTimeoutMS() {
    return this.field.modalCloseTimeoutMS ?? 100;
  }

  get addItemLabel() {
    return this.field.addItemLabel ?? "Add Item";
  }

  get addItemValidator() {
    if (this.field.addItemValidator) {
      const _string = this.field.addItemValidator;
      const lastSlash = _string.lastIndexOf("/");
      const validator = new RegExp(_string.slice(1, lastSlash), _string.slice(lastSlash + 1));
      return validator;
    }
    return /.+/;
  }
}
