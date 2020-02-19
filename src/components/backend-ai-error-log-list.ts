/**
 @license
 Copyright (c) 2015-2020 Lablup Inc. All rights reserved.
 */

import {css, customElement, html, property} from "lit-element";

import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-icons/hardware-icons';
import '@polymer/iron-icons/av-icons';
import '@polymer/paper-dialog/paper-dialog';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-icon-button/paper-icon-button';
import '@vaadin/vaadin-grid/theme/lumo/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column';
import '@vaadin/vaadin-grid/vaadin-grid-sorter';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column';
import '@vaadin/vaadin-icons/vaadin-icons';
import '@vaadin/vaadin-progress-bar/vaadin-progress-bar';

import 'weightless/card';
import 'weightless/dialog';
import 'weightless/checkbox';
import 'weightless/title';
import 'weightless/expansion';
import 'weightless/icon';
import 'weightless/button';
import 'weightless/label';

import './lablup-loading-indicator';
import './backend-ai-indicator';
import '../plastics/lablup-shields/lablup-shields';

import {BackendAiStyles} from './backend-ai-console-styles';
import {BackendAIPage} from './backend-ai-page';
import {IronFlex, IronFlexAlignment} from '../plastics/layout/iron-flex-layout-classes';

@customElement("backend-ai-error-log-list")
export default class BackendAiErrorLogList extends BackendAIPage {
  @property({type: String}) timestamp = '';
  @property({type: String}) errorType = '';
  @property({type: String}) requestUrl = '';
  @property({type: String}) statusCode = '';
  @property({type: String}) statusText = '';
  @property({type: String}) title = '';
  @property({type: String}) message = '';
  @property({type: Array}) logs = Array();
  @property({type: Array}) _selected_items = Array();
  @property({type: Object}) loadingIndicator = Object();
  @property({type: Object}) _grid = Object();
  @property({type: Object}) logView = Object();
  @property({type: Number}) _pageSize = 25;
  @property({type: Number}) _currentPage = 1;
  @property({type: Number}) _totalLogCount = 0;

  constructor() {
      super();
  }

  static get styles() {
    return [
      BackendAiStyles,
      IronFlex,
      IronFlexAlignment,
      // language=CSS
      css`
        vaadin-grid {
          width: 100%;
          border: 0;
          font-size: 12px;
          height: calc(100vh - 320px);
        }

        vaadin-grid-cell {
          font-size: 10px;
        }

        [error-cell] {
          color: red;
        }

        wl-label {
          --label-font-family: Roboto, Noto, sans-serif;
          --label-color: black;
        }

        wl-icon.pagination {
          color: var(--paper-grey-700);
        }

        wl-button.pagination {
          width: 15px;
          height: 15px;
          padding: 10px;
          box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
          --button-bg: transparent;
          --button-bg-hover: var(--paper-teal-100);
          --button-bg-active: var(--paper-teal-600);
          --button-bg-active-flat: var(--paper-teal-600);
        }
      `];
  }

  firstUpdated() {
    this.loadingIndicator = this.shadowRoot.querySelector('#loading-indicator');
    this._grid = this.shadowRoot.querySelector('#list-grid');
    if (!window.backendaiclient || !window.backendaiclient.is_admin) {
      this.shadowRoot.querySelector('vaadin-grid').style.height = 'calc(100vh - 320px)!important';
    }
    this.notification = window.lablupNotification;

    document.addEventListener('log-message-refresh', () => this._refreshLogData());
    document.addEventListener('log-message-clear', () => this._clearLogData());
  }

  _refreshLogData() {
    this.loadingIndicator.show();
    this.logs = JSON.parse(localStorage.getItem('backendaiconsole.logs') || '{}');
    this._totalLogCount = this.logs.length > 0 ? this.logs.length : 1;
    this._updateItemsFromPage(1);
    this._grid.clearCache();
    this.loadingIndicator.hide();
  }

  _clearLogData() {
    this.logs = [];
    this.logView = [];
    this._totalLogCount = 1;
    this._currentPage = 1;
    this._grid.clearCache();
  }

  _updateItemsFromPage(page) {
    if (typeof page !== 'number') {
      let page_action = page.target;
      if (page_action['role'] !== 'button') {
        page_action = page.target.closest('wl-button');
      }
      page_action.id === 'previous-page' ? this._currentPage -= 1 : this._currentPage += 1;
    }
    let start = (this._currentPage - 1) * this._grid.pageSize;
    let end = this._currentPage * this._grid.pageSize;
    if (this.logs.length > 0) {
      this.logView = this.logs.slice(start, end);
    }
  }

  render() {
    // language=HTML
    return html`
      <lablup-loading-indicator id="loading-indicator"></lablup-loading-indicator>
      <vaadin-grid id="list-grid" page-size="${this._pageSize}"
                   theme="row-stripes column-borders compact wrap-cell-content"
                   aria-label="Error logs" .items="${this.logView}">
        <vaadin-grid-column resizable flex-grow="0" text-align="start" auto-width header="TimeStamp">
          <template>
              <div class="layout vertical" error-cell$="[[item.isError]]">
                <span>[[item.timestamp]]</span>
              </div>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable flex-grow="0" text-align="start" auto-width header="Status">
          <template>
              <div class="layout vertical" error-cell$="[[item.isError]]">
                <span>[[item.statusCode]] [[item.statusText]]</span>
              </div>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable flex-grow="0" text-align="start" auto-width header="Error Title">
          <template>
              <div class="layout vertical" error-cell$="[[item.isError]]">
                <span>[[item.title]]</span>
              </div>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable flex-grow="0" text-align="start" auto-width header="Error Message">
          <template>
              <div class="layout vertical" error-cell$="[[item.isError]]">
                <span>[[item.message]]</span>
              </div>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable flex-grow="0" text-align="start" auto-width header="Method">
          <template>
              <div class="layout vertical" error-cell$="[[item.isError]]">
                <span>[[item.requestMethod]]</span>
              </div>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable flex-grow="0" text-align="start" auto-width header="Request Url">
          <template>
              <div class="layout vertical" error-cell$="[[item.isError]]">
                <span>[[item.requestUrl]]</span>
              </div>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable flex-grow="0" text-align="start" auto-width header="Parameters">
          <template>
              <div class="layout vertical" error-cell$="[[item.isError]]">
                <span>[[item.requestParameters]]</span>
              </div>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable flex-grow="0" text-align="start" auto-width header="Error Type">
          <template>
              <div class="layout vertical" error-cell$="[[item.isError]]">
                <span>[[item.type]]</span>
              </div>
          </template>
        </vaadin-grid-column>
      </vaadin-grid>
      <div class="horizontal center-justified layout flex" style="padding: 10px;">
        <wl-button class="pagination" id="previous-page"
                   ?disabled="${this._currentPage === 1 }"
                   @click="${(e) => {this._updateItemsFromPage(e)}}">
          <wl-icon class="pagination">navigate_before</wl-icon>
        </wl-button>
        <wl-label style="padding: 5px 15px 0px 15px;">
          ${this._currentPage} / ${Math.ceil( this._totalLogCount / this._pageSize)}
        </wl-label>
        <wl-button class="pagination" id="next-page"
                   ?disabled="${this._totalLogCount <= this._pageSize * this._currentPage }"
                   @click="${(e) => {this._updateItemsFromPage(e)}}">
          <wl-icon class="pagination">navigate_next</wl-icon>
        </wl-button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "backend-ai-error-log-list": BackendAiErrorLogList;
  }
}
