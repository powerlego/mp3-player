import React from "react";

type SidebarProps = {
  className?: string;
};

function Sidebar({ className }: SidebarProps) {
  return (
    <div className={className}>
      <div className="flex flex-col">
        <i>A</i>
        <i>B</i>
      </div>
    </div>
  );
}
export default Sidebar;
