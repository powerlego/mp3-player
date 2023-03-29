import { SettingsSection } from "@/types";
import React from "react";
import _ from "lodash";
import SettingsGroup from "../Fields/SettingsGroup";

type SettingsWindowProps = {
  activeSection?: string;
  sections: SettingsSection[];
  preferences: { [key: string]: any };
  onFieldChange: (key: string, value: any) => void;
};

export default class SettingsWindow extends React.Component<SettingsWindowProps> {
  private mainRef: React.RefObject<HTMLDivElement>;
  constructor(props: SettingsWindowProps) {
    super(props);
    this.mainRef = React.createRef();
  }

  componentDidUpdate(prevProps: Readonly<SettingsWindowProps>): void {
    if (this.props.activeSection !== prevProps.activeSection) {
      this.mainRef.current?.scrollTo({ top: 0 });
    }
  }

  render() {
    const { preferences, section, onFieldChange } = this;
    const groups = this.form?.groups.map((group, idx) => (
      <SettingsGroup
        group={group}
        key={idx}
        label={group.label}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-non-null-assertion
        preferences={preferences[section!.id]}
        onFieldChange={onFieldChange}
      />
    ));

    return (
      <div
        className="settings-window h-full min-h-full w-[600px] min-w-[600px] max-w-[600px] p-3 text-sm cursor-default overflow-x-hidden overflow-y-auto"
        ref={this.mainRef}
      >
        {groups}
      </div>
    );
  }

  get preferences() {
    return this.props.preferences;
  }

  get section() {
    return _.find(this.sections, { id: this.activeSection });
  }

  get sections() {
    return this.props.sections;
  }

  get activeSection() {
    return this.props.activeSection;
  }

  get form() {
    return this.section?.form;
  }

  get onFieldChange() {
    return this.props.onFieldChange;
  }
}
