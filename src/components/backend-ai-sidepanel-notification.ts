/**
 @license
 Copyright (c) 2015-2020 Lablup Inc. All rights reserved.
 */
import {translate as _t} from "lit-translate";
import {css, customElement, html, property} from "lit-element";
import '../plastics/mwc/mwc-drawer';
import '@material/mwc-dialog';
import '@material/mwc-icon';
import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';

import {BackendAIPage} from './backend-ai-page';
import {BackendAiConsoleStyles} from './backend-ai-console-styles';
import {
  IronFlex,
  IronFlexAlignment,
  IronFlexFactors,
  IronPositioning
} from "../plastics/layout/iron-flex-layout-classes";

/**
 Backend.AI Sidepanel notification viewer for Console

 `backend-ai-sidepanel-notification` is a sidepanel notification viewer for console.

 Example:
 @group Backend.AI Console
 @element backend-ai-sidepanel-notification
 */
@customElement("backend-ai-sidepanel-notification")
export default class BackendAiSidepanelNotification extends BackendAIPage {
  public shadowRoot: any;
  public updateComplete: any;

  @property({type: Boolean}) active = true;
  @property({type: Array}) notifications = Array();

  /**
   *  Backend.AI Task manager for Console
   *
   */
  constructor() {
    super();
  }

  static get styles() {
    return [
      BackendAiConsoleStyles,
      IronFlex,
      IronFlexAlignment,
      IronFlexFactors,
      IronPositioning,
      // language=css
      css`
        h3 {
          font-size: 16px;
          color: #242424;
          display: block;
          width: 100%;
          height: 25px;
          padding: 5px 15px;
          border-bottom: 1px solid #cccccc;
        }

        mwc-list {
          padding: 0;
          margin: 0;
        }
      `
    ];
  }

  async _viewStateChanged(active: boolean) {
    await this.updateComplete;
    if (active === false) {
      return;
    }
  }

  render() {
    // language=HTML
    return html`
      <div id="container">
        <h3>${_t("sidepanel.Notification")}</h3>
        <mwc-list>
        ${this.notifications.map(item =>
      html`
          <mwc-list-item twoline>
            <span>${item.outerText}</span>
            <span slot="secondary">${item.getAttribute('created')}</span>
          </mwc-list-item>
          <li divider role="separator"></li>`)}
          ${this.notifications.length === 0 ? html`
            <div style="padding:15px 0;width:100%;text-align:center;">
              ${_t("sidepanel.NoNotification")}
            </div>
        ` : html``}
        </mwc-list>
      </div>
    `;
  }

  shouldUpdate() {
    return this.active;
  }

  firstUpdated() {
    this.notifications = globalThis.lablupNotification.notifications;
    document.addEventListener('backend-ai-notification-changed', () => this.refresh());
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  async refresh() {
    this.notifications = globalThis.lablupNotification.notifications;
    await this.requestUpdate();
  }

}
declare global {
  interface HTMLElementTagNameMap {
    "backend-ai-sidepanel-notification": BackendAiSidepanelNotification;
  }
}
