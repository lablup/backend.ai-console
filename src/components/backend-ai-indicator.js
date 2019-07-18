/**
 @license
 Copyright (c) 2015-2019 Lablup Inc. All rights reserved.
 */
import {css, html, LitElement} from "lit-element";
import 'weightless/dialog';
import 'weightless/banner';

import 'weightless/progress-bar';
import 'weightless/title';

class BackendAIIndicator extends LitElement {
  constructor() {
    super();
    this.value = 0;
    this.text = '';
    this.mode = 'determinate';
  }

  static get is() {
    return 'backend-ai-indicator';
  }

  static get properties() {
    return {
      value: {
        type: Number
      },
      text: {
        type: String
      },
      dialog: {
        type: Object
      },
      mode: {
        type: String
      }
    };
  }

  static get styles() {
    return [
      // language=CSS
      css`
        wl-dialog {
          position: fixed;
          right: 20px;
          bottom: 20px;
          z-index: 9000;
          --dialog-height: 80px;
          --dialog-width: 250px;
          --dialog-content-padding: 15px;
        }
      `];
  }

  firstUpdated() {
    this.dialog = this.shadowRoot.querySelector('#app-progress-dialog');
  }

  connectedCallback() {
    super.connectedCallback();
  }

  start(mode = 'determinate') {
    this.value = 0;
    this.text = 'Initializing...';
    this.mode = mode;
    this.dialog.show();
  }

  set(value, text = '') {
    this.value = value / 100.0;
    this.text = text;
  }

  end(delay = 0) {
    setTimeout(() => {
      this.dialog.hide();
    }, delay);
  }

  render() {
    // language=HTML
    return html`
      <wl-dialog id="app-progress-dialog" blockscrolling>
        <wl-title level="5" id="app-progress-text" slot="header">${this.text}</wl-title>
        <div slot="content">
        <wl-progress-bar .mode="${this.mode}" id="app-progress" .value="${this.value}"></wl-progress-bar>
        </div>
      </wl-dialog>
    `;
  }
}

customElements.define(BackendAIIndicator.is, BackendAIIndicator);
