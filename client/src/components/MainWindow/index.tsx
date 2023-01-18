import React from "react";
import Topbar from "../Topbar";

function MainWindow() {
    return (
        <div className="h-full">
            <Topbar />
            <div className="content">
                <div className="h-16 sticky top-0" />
                <div className="content-list">
                    <p className="content-item">Hello</p>
                </div>
            </div>
        </div>
    );
}

export default MainWindow;
