/**
 @license
 Copyright (c) 2015-2020 Lablup Inc. All rights reserved.
 */

import {translate as _t} from "lit-translate";
import {css, customElement, html, property} from "lit-element";

import '@vaadin/vaadin-grid/theme/lumo/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column';
import '@vaadin/vaadin-grid/vaadin-grid-sorter';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column';
import '@vaadin/vaadin-icons/vaadin-icons';

import 'weightless/card';
import 'weightless/dialog';
import 'weightless/checkbox';
import 'weightless/title';
import 'weightless/expansion';
import 'weightless/icon';
import 'weightless/button';
import 'weightless/label';

import './lablup-loading-spinner';
import './backend-ai-indicator';
import '../plastics/lablup-shields/lablup-shields';

import {BackendAiStyles} from './backend-ai-general-styles';
import {BackendAIPage} from './backend-ai-page';
import {IronFlex, IronFlexAlignment} from '../plastics/layout/iron-flex-layout-classes';

/**
 Backend.AI Error Log List

 @group Backend.AI Console
 @element backend-ai-error-log-list
 */

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
  @property({type: Object}) spinner = Object();
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
          height: calc(100vh - 275px);
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

        wl-button.pagination[disabled] wl-icon.pagination {
          color: var(--paper-grey-300);
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
          --button-bg-disabled: var(--paper-grey-50);
          --button-color-disabled: var(--paper-grey-200);
        }
      `];
  }

  firstUpdated() {
    this.spinner = this.shadowRoot.querySelector('#loading-spinner');
    this._updatePageItemSize();
    this._grid = this.shadowRoot.querySelector('#list-grid');
    if (!globalThis.backendaiclient || !globalThis.backendaiclient.is_admin) {
      this.shadowRoot.querySelector('vaadin-grid').style.height = 'calc(100vh - 275px)!important';
    }
    this.notification = globalThis.lablupNotification;
    document.addEventListener('log-message-refresh', () => this._refreshLogData());
    document.addEventListener('log-message-clear', () => this._clearLogData());
  }

  /**
   * Update the page size according to tab size.
   */
  _updatePageItemSize() {
    let tableSize = window.innerHeight - 275 - 30;
    this._pageSize = Math.floor(tableSize / 31);
  }

  /**
   * Refresh log data.
   */
  _refreshLogData() {
    this.spinner.show();
    this._updatePageItemSize();
    this.logs = JSON.parse(localStorage.getItem('backendaiconsole.logs') || '{}');
    this._totalLogCount = this.logs.length > 0 ? this.logs.length : 1;
    this._updateItemsFromPage(1);
    this._grid.clearCache();
    this.spinner.hide();
  }

  /**
   * Clear log data.
   */
  _clearLogData() {
    this.logs = [];
    this.logView = [];
    this._totalLogCount = 1;
    this._currentPage = 1;
    this._grid.clearCache();
  }

  /**
   * Update items from page target.
   * 
   * @param page 
   */
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
      let logData = this.logs.slice(start, end);
      logData.forEach(item => {
        item.timestamp_hr = this._humanReadableTime(item.timestamp);
      });

      this.logView = logData; //this.logs.slice(start, end);
    }
  }

  /**
   * Change d of any type to human readable date time.
   * 
   * @param {any} d 
   */
  _humanReadableTime(d: any) {
    d = new Date(d);
    return d.toLocaleString();
  }

  /**
   * Change d of any type to ISO date time.
   * 
   * @param {any} d 
   */
  _toISOTime(d: any) {
    d = new Date(d);
    return d.toISOString();
  }

  render() {
    // language=HTML
    return html`
      <lablup-loading-spinner id="loading-spinner"></lablup-loading-spinner>
      <vaadin-grid id="list-grid" page-size="${this._pageSize}"
                   theme="row-stripes column-borders compact wrap-cell-content"
                   aria-label="Error logs" .items="${this.logView}">
        <vaadin-grid-column width="250px" flex-grow="0" text-align="start" auto-width header="${_t("logs.TimeStamp")}">
          <template>
              <div class="layout vertical" error-cell$="[[item.isError]]">
                <span class="monospace">[[item.timestamp_hr]]</span>
              </div>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable flex-grow="0" text-align="start" auto-width header="${_t("logs.Status")}">
          <template>
              <div class="layout vertical" error-cell$="[[item.isError]]">
                <span>[[item.statusCode]] [[item.statusText]]</span>
              </div>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable flex-grow="0" text-align="start" auto-width header="${_t("logs.ErrorTitle")}">
          <template>
              <div class="layout vertical" error-cell$="[[item.isError]]">
                <span>[[item.title]]</span>
              </div>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable flex-grow="0" text-align="start" auto-width header="${_t("logs.ErrorMessage")}">
          <template>
              <div class="layout vertical" error-cell$="[[item.isError]]">
                <span>[[item.message]]</span>
              </div>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column width="50px" flex-grow="0" text-align="start" auto-width header="${_t("logs.ErrorType")}">
          <template>
              <div class="layout vertical" error-cell$="[[item.isError]]">
                <span>[[item.type]]</span>
              </div>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable flex-grow="0" text-align="start" auto-width header="${_t("logs.Method")}">
          <template>
              <div class="layout vertical" error-cell$="[[item.isError]]">
                <span>[[item.requestMethod]]</span>
              </div>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable flex-grow="0" text-align="start" auto-width header="${_t("logs.RequestUrl")}">
          <template>
              <div class="layout vertical" error-cell$="[[item.isError]]">
                <span class="monospace">[[item.requestUrl]]</span>
              </div>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable auto-width flex-grow="0" text-align="start" header="${_t("logs.Parameters")}">
          <template>
              <div class="layout vertical" error-cell$="[[item.isError]]">
                <span class="monospace">[[item.requestParameters]]</span>
              </div>
          </template>
        </vaadin-grid-column>
      </vaadin-grid>
      <div class="horizontal center-justified layout flex" style="padding: 10px;border-top:1px solid #ccc;">
        <wl-button class="pagination" id="previous-page"
                   ?disabled="${this._currentPage === 1}"
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
