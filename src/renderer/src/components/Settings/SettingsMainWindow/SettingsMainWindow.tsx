import { SettingsSection } from "@/types";
import React from "react";
import _ from "lodash";
import SettingsGroup from "../Fields/SettingsGroup";
import CustomScrollbar from "@renderer/components/CustomScrollbar/CustomScrollbar";

type SettingsMainWindowProps = {
  activeSection?: string;
  sections: SettingsSection[];
  preferences: { [key: string]: any };
  onFieldChange: (key: string, value: any) => void;
};

export default class SettingsMainWindow extends React.Component<SettingsMainWindowProps> {
  private mainRef: React.RefObject<HTMLDivElement>;
  constructor(props: SettingsMainWindowProps) {
    super(props);
    this.mainRef = React.createRef();
  }

  componentDidUpdate(prevProps: Readonly<SettingsMainWindowProps>): void {
    if (this.props.activeSection !== prevProps.activeSection) {
      this.mainRef.current?.scrollTo({ top: 0 });
    }
  }

  render() {
    const groups = this.form?.groups.map((group, idx) => (
      <SettingsGroup
        group={group}
        key={idx}
        label={group.label}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-non-null-assertion
        preferences={this.preferences[this.section!.id]}
        onFieldChange={this.onFieldChange.bind(this)}
      />
    ));

    return (
      <CustomScrollbar
        className="h-full min-h-full w-4/5 min-w-[500px] text-sm cursor-default"
        ref={this.mainRef}
        scrollHostClassName="overflow-x-hidden overflow-y-auto p-3"
      >
        {groups}
      </CustomScrollbar>
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
