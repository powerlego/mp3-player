import { SettingsSection } from "@/types";
import React, { Component } from "react";
import "./SettingsSidebar.css";

type SettingsSidebarProps = {
  activeSection: string;
  sections: SettingsSection[];
  preferences: { [key: string]: any };
  onSelectSection: (sectionId: string) => any;
};

type SettingsSidebarState = {
  activeSection: string;
};

export default class SettingsSidebar extends Component<SettingsSidebarProps, SettingsSidebarState> {
  constructor(props: SettingsSidebarProps) {
    super(props);

    this.state = {
      activeSection: this.activeSection,
    };
  }

  render() {
    const { preferences } = this;

    const sections = this.sections.map((section) => {
      const isActive = section.id === this.activeSection;
      const style
        = typeof section.icon === "string"
          ? {
            mask: `url(${section.icon}) no-repeat center/contain`,
            WebkitMask: `url(${section.icon}) no-repeat center/contain`,
          }
          : {};
      return (
        <li
          aria-controls={`tabpanel-${section.id}`}
          aria-label={section.label}
          aria-selected={isActive}
          id={`tab-${section.id}`}
          key={section.id}
          role="tab"
          tabIndex={isActive ? 0 : -1}
          className={`h-10 min-h-[2.5rem] max-h-[2.5rem] w-1/5 min-w-[150px] max-w-[199px] overflow-hidden p-2 flex flex-row justify-start items-center transition-colors duration-200 ease-in-out cursor-pointer outline-nothing focus:border-2 focus:border-solid focus:border-blue-500 dark:focus:border-blue-500 text-black dark:text-white ${
            isActive
              ? "font-bold bg-gray-250 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-650"
              : " font-semibold bg-gray-50 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-650"
          }`}
          onClick={this.selectSection.bind(this, section.id)}
        >
          {section.icon && (
            <div
              style={style}
              className={`${section.icon && typeof section.icon !== "string" ? "" : "bg-gray-900 dark:bg-gray-50"}
            } mr-1 w-8 h-8 min-w-[2rem] max-w-[2rem] min-h-[2rem] max-h-[2rem]`}
            >
              {section.icon && typeof section.icon !== "string" && <>{section.icon}</>}
            </div>
          )}
          <span className="text-sm">{section.label}</span>
        </li>
      );
    });

    return (
      <ul
        aria-label="Sidebar"
        className="sidebar h-full min-h-full w-1/5 min-w-[150px] flex flex-col justify-start cursor-default overflow-x-hidden overflow-y-auto bg-gray-150 dark:bg-gray-850 p-0 m-0"
        role="tablist"
        onKeyDown={this.onTablistKeyDown.bind(this)}
      >
        {sections}
      </ul>
    );
  }

  get sections() {
    return this.props.sections;
  }

  get activeSection() {
    return this.props.activeSection;
  }

  get preferences() {
    return this.props.preferences;
  }

  get onSelectSection() {
    return this.props.onSelectSection;
  }

  selectSection(sectionId: string) {
    this.setState({ activeSection: sectionId });
    this.onSelectSection(sectionId);
  }

  onTablistKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.repeat) {
      return;
    }
    let tabIncrement = 0;
    if (event.code === "ArrowRight" || event.code === "ArrowDown") {
      tabIncrement++;
    }
    else if (event.code === "ArrowLeft" || event.code === "ArrowUp") {
      tabIncrement--;
    }

    if (tabIncrement === 0) {
      return;
    }

    const { activeSection, sections } = this;
    const sectionIds = sections.map((section) => section.id);
    if (sectionIds.length <= 0) {
      return;
    }
    const idx = sectionIds.indexOf(activeSection);
    if (idx === -1 || (tabIncrement > 0 && idx >= sectionIds.length - 1)) {
      this.selectSection(sectionIds[0]);
    }
    else if (idx === 0 && tabIncrement < 0) {
      this.selectSection(sectionIds[sectionIds.length - 1]);
    }
    else {
      this.selectSection(sectionIds[idx + tabIncrement]);
    }
  }
}
