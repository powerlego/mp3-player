import { $, append, prepend } from "@renderer/vs/base/common/dom";

export default class TitlebarTest {
  _container: HTMLElement;
  constructor() {
    this._container = $("div.cet-container");

    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";

    while (document.body.firstChild) {
      append(this._container, document.body.firstChild);
    }
    append(document.body, this._container);
  }
}
