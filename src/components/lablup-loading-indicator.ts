/**
 @license
 Copyright (c) 2015-2019 Lablup Inc. All rights reserved.
 */

import {css, customElement, html, property, LitElement} from "lit-element";
import 'weightless/progress-spinner';

@customElement("lablup-loading-indicator")
export default class LablupLoadingIndicator extends LitElement {
  @property({type: Object}) indicator;

  constructor() {
    super();
  }

  static get styles() {
    return [
      // language=CSS
      css`
        wl-progress-spinner {
          --progress-spinner-size: 48px;
          --progress-spinner-stroke-width: 12px;
          width: 48px;
          height: 48px;
          position: fixed;
          bottom: 60px;
          right: 60px;
        }
      `];
  }

  static get properties() {
    return {
      active: {
        type: Boolean
      },
      indicator: {
        type: Object
      }
    };
  }

  render() {
    // language=HTML
    return html`
      <wl-progress-spinner id="indicator"></wl-progress-spinner>
    `;
  }

  shouldUpdate() {
    return this.active;
  }

  firstUpdated() {
    this.indicator = this.shadowRoot.querySelector('#indicator');
    this.active = true;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  async getMoreState() {

  }

  async show() {
    this.active = true;
    await this.updateComplete;
    this.indicator.style.display = 'block';
  }

  async hide() {
    this.active = true;
    await this.updateComplete;
    this.indicator.style.display = 'none';
    this.active = false;
  }

  async toggle() {
    await this.updateComplete;
    if (this.indicator.active === true) {
      this.active = true;
      this.indicator.style.display = 'none';
      this.active = false;
    } else {
      this.active = true;
      this.indicator.style.display = 'block';
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lablup-loading-indicator": LablupLoadingIndicator;
  }
}
