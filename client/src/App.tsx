import React from "react";
import MainWindow from "./components/MainWindow";
import MediaControlsBar from "./components/MediaControlsBar";
import Sidebar from "./components/Sidebar";
import testAudioFile from "./assets/audio/Hymn-For-The-Weekend.mp3";
import { format } from "url";

class App extends React.Component {
    audio = new Audio(testAudioFile);

    handleClick = () => {
        if (!process.env.REACT_APP_SERVER_URL) {
            console.log("No server URL provided");
            return;
        }
        if (!this.audio) {
            return;
        }
        const url = new URL(process.env.REACT_APP_SERVER_URL);
        fetch(this.audio.src)
            .then(async (res) => {
                if (res.ok) {
                    if (res.body) {
                        url.pathname = "/metadata";
                        const resText = await res.blob();
                        const form = new FormData();
                        form.append("track", resText);
                        const resp = await fetch(format(url), {
                            method: "POST",
                            body: form,
                        });
                        const respText = await resp.text();
                        console.log(respText);
                        // url.searchParams.append("track", resText);
                        // const fileInfo = {
                        //     size: parseInt(res.headers.get("Content-Length") || "0", 10),
                        //     mimeType: res.headers.get("Content-Type") || "audio/mpeg",
                        // };
                        // url.searchParams.append("fileInfo", JSON.stringify(fileInfo));
                        // fetch(format(url))
                        //     .then((resp) => {
                        //         resp.text()
                        //             .then((text) => {
                        //                 console.log(text);
                        //             })
                        //             .catch((er) => {
                        //                 console.log(er);
                        //             });
                        //     })
                        //     .catch((error) => {
                        //         console.log(error);
                        //     });
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    render() {
        return (
            <div className="app">
                <button className="h-8 w-full" onClick={this.handleClick} />
                <Sidebar />
                <MediaControlsBar src={this.audio.src} />
                <MainWindow />
            </div>
        );
    }
}
export default App;
