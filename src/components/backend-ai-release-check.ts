/**
 @license
 Copyright (c) 2015-2020 Lablup Inc. All rights reserved.
 */

import {get as _text} from "lit-translate";
import {customElement, html, LitElement, property} from "lit-element";

@customElement("backend-ai-release-check")
export default class BackendAiReleaseCheck extends LitElement {
  public shadowRoot: any; // ShadowRoot
  @property({type: String}) releaseURL = 'https://raw.githubusercontent.com/lablup/backend.ai-console/release/version.json';
  @property({type: String}) localVersion = '';
  @property({type: String}) localBuild = '';
  @property({type: String}) remoteVersion = '';
  @property({type: String}) remoteBuild = '';
  @property({type: String}) remoteRevision = '';
  @property({type: Boolean}) updateChecked = false;
  @property({type: Boolean}) updateNeeded = false;
  @property({type: String}) updateURL = '';
  @property({type: Object}) notification;

  constructor() {
    super();
  }

  static get styles() {
    return [];
  }

  render() {
    // language=HTML
    return html`
    `;
  }

  firstUpdated() {
    this.notification = globalThis.lablupNotification;
    if (globalThis.isElectron && globalThis.backendaioptions.get("automatic_update_check", true)) {
      this.checkRelease();
    }
  }

  async checkRelease() {
    if (!this.updateChecked) {
      fetch(this.releaseURL).then(
        response => response.json()
      ).then(
        json => {
          this.updateChecked = true;
          this.remoteVersion = json.package;
          this.remoteBuild = json.build;
          this.remoteRevision = json.revision;
          if (this.compareVersion(globalThis.packageVersion, this.remoteVersion) < 0) { // update needed.
            //if (this.compareVersion('20.03.3', this.remoteVersion) < 0) { // For testing
            this.updateNeeded = true;
            this.updateURL = `https://github.com/lablup/backend.ai-console/releases/tag/v${this.remoteVersion}`;
            if (globalThis.isElectron) {
              this.notification.text = _text("update.NewConsoleVersionAvailable") + ' ' + this.remoteVersion;
              this.notification.detail = _text("update.NewConsoleVersionAvailable");
              this.notification.url = this.updateURL;
              this.notification.show();
            }
          }
        }
      ).catch((e) => {
        let count = globalThis.backendaioptions.get("automatic_update_count_trial", 0);
        if (count > 3) { // Try 3 times.
          globalThis.backendaioptions.set("automatic_update_check", false); // Turn off automatic check.
        }
        globalThis.backendaioptions.set("automatic_update_count_trial", count + 1);
      });
    }
  }

  compareVersion(v1, v2) {
    if (typeof v1 !== 'string') return false;
    if (typeof v2 !== 'string') return false;
    v1 = v1.split('.');
    v2 = v2.split('.');
    const k = Math.min(v1.length, v2.length);
    for (let i = 0; i < k; ++i) {
      v1[i] = parseInt(v1[i], 10);
      v2[i] = parseInt(v2[i], 10);
      if (v1[i] > v2[i]) return 1;
      if (v1[i] < v2[i]) return -1;
    }
    return v1.length == v2.length ? 0 : (v1.length < v2.length ? -1 : 1);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "backend-ai-release-check": BackendAiReleaseCheck;
  }
}
