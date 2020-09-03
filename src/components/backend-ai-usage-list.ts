/**
 @license
 Copyright (c) 2015-2020 Lablup Inc. All rights reserved.
 */

import {translate as _t} from "lit-translate";
import {css, customElement, html, property} from "lit-element";
import {BackendAIPage} from './backend-ai-page';

import 'weightless/card';
import 'weightless/tab-group';
import 'weightless/tab';
import 'weightless/select';
import {BackendAiStyles} from './backend-ai-general-styles';
import './backend-ai-chart';

import {
  IronFlex,
  IronFlexAlignment,
  IronFlexFactors,
  IronPositioning
} from '../plastics/layout/iron-flex-layout-classes';

/**
 Backend AI Usage List

 `backend-ai-usage-list` is usage list of resources.

 Example:

 <backend-ai-usage-list>
 ...
 </backend-ai-usage-list>

 @group Backend.AI Console
 @element backend-ai-usage-list
 */

@customElement("backend-ai-usage-list")
export default class BackendAIUsageList extends BackendAIPage {
  @property({type: Object}) _map = {
    "num_sessions": "Sessions",
    "cpu_allocated": "CPU",
    "mem_allocated": "Memory",
    "gpu_allocated": "GPU",
    "io_read_bytes": "IO-Read",
    "io_write_bytes": "IO-Write"
  };
  @property({type: Object}) templates = {
    "1D": {
      "interval": 15 / 15,
      "length": 4 * 24
    },
    "1W": {
      "interval": 15 / 15,
      "length": 4 * 24 * 7
    }
  };
  @property({type: Object}) collection = Object();
  @property({type: String}) period = '1D';
  @property({type: Boolean}) updating = false;
  public data: any;

  constructor() {
    super();
    this.data = [];
  }

  static get styles() {
    return [
      BackendAiStyles,
      IronFlex,
      IronFlexAlignment,
      IronFlexFactors,
      IronPositioning,
      // language=CSS
      css`
        wl-select {
          --input-font-family: Roboto, Noto, sans-serif;
          --input-color-disabled: #222222;
          --input-label-color-disabled: #222222;
          --input-label-font-size: 12px;
          --input-border-style-disabled: 1px solid #cccccc;
        }

        wl-card {
          --card-elevation: 0;
        }
      `
    ]
  }

  attributeChangedCallback(name, oldval, newval) {
    if (name === "active" && newval !== null) {
      if (!this.active) this._menuChanged(true);
      this.active = true;
    } else {
      this.active = false;
      this._menuChanged(false);
      this.shadowRoot.querySelectorAll("backend-ai-chart").forEach(e => {
        e.wipe();
      });
    }

    super.attributeChangedCallback(name, oldval, newval);
  }

  /**
   * Wipe all of backend-ai-chart if active is false. Else, initialize the backend-ai-chart.
   *
   * @param {Boolean} active - flag to decide whether to change menu or not
   * */
  async _menuChanged(active) {
    await this.updateComplete;
    if (active === false) {
      this.shadowRoot.querySelectorAll("backend-ai-chart").forEach(e => {
        e.wipe();
      });
      return;
    }
    this.init();
  }

  firstUpdated() {
    //this.init();
  }

  /**
   * Initialize backend-ai-chart
   * */
  init() {
    if (typeof globalThis.backendaiclient === 'undefined' || globalThis.backendaiclient === null || globalThis.backendaiclient.ready === false) {
      document.addEventListener("backend-ai-connected", () => {
        if (this.updating) {
          return;
        }
        this.updating = true;
        this.readUserStat()
          .then(res => {
            this.shadowRoot.querySelectorAll('backend-ai-chart').forEach(chart => {
              chart.init()
            });
            this.updating = false;
          }).catch(e => {
          this.updating = false;
        });
      }, true);
    } else {
      if (this.updating) {
        return;
      }
      this.updating = true;
      this.readUserStat()
        .then(res => {
          this.shadowRoot.querySelectorAll('backend-ai-chart').forEach(chart => {
            chart.init()
          });
          this.updating = false;
        }).catch(e => {
        this.updating = false;
      });
    }
  }

  /**
   * Read user stats that belongs to specific period
   * */
  readUserStat() {
    return globalThis.backendaiclient.resources.user_stats()
      .then(res => {
        const {period, templates} = this;
        this.data = res;
        let collection = {};
        collection[period] = {};
        Object.keys(this._map).forEach(key => {
          collection[period][key] = {
            data: [
              res
                .filter((e, i) => res.length - templates[period].length <= i)
                .map(e => ({x: new Date(1000 * e["date"]), y: e[key]["value"]})),
                //.map(e => ({x: 1000 * e["date"], y: e[key]["value"]})),
            ],
            labels: [
              res
                .filter((e, i) => res.length - templates[period].length <= i)
                .map(e => (new Date(1000 * e["date"]).toString())),
              //.map(e => ({x: 1000 * e["date"], y: e[key]["value"]})),
            ],
            axisTitle: {
              x: "Date",
              y: this._map[key]
            },
            period,
            unit_hint: res[0][key].unit_hint
          }

        });
        this.collection = collection;
        return this.updateComplete;
      }).catch(e => {
      });
  }

  /**
   * Change the data according to the item selected in the pull down menu.
   *
   * @param {Event} e - Dispatches from the native input event each time the input changes.
   * */
  pulldownChange(e) {
    this.period = e.target.value;

    const {data, period, collection, _map, templates} = this;

    if (!(period in collection)) {
      collection[period] = {};
      Object.keys(_map).forEach(key => {
        collection[period][key] = {
          data: [
            data
              .filter((e, i) => data.length - templates[period].length <= i)
              .map(e => ({x: new Date(1000 * e["date"]), y: e[key]["value"]})),
            //.map(e => ({x: 1000 * e["date"], y: e[key]["value"]})),
          ],
          axisTitle: {
            x: "Date",
            y: _map[key]
          },
          period,
          unit_hint: data[data.length - 1][key].unit_hint
        }
      });
    }
  }

  render() {
    // language=HTML
    return html`
      <wl-card elevation="0">
        <h3 class="horizontal center layout">
          <wl-select label="${_t("statistics.SelectPeriod")}" style="width: 130px;" @input=${this.pulldownChange}>
            <option value disabled>${_t("statistics.SelectPeriod")}</option>
            <option value="1D" selected>${_t("statistics.1Day")}</option>
            <option value="1W">${_t("statistics.1Week")}</option>
          </wl-select>
          <span class="flex"></span>
        </h3>
        ${Object.keys(this.collection).length > 0 ?
      Object.keys(this._map).map((key, idx) =>
        html`
          <wl-card>
            <h3 class="horizontal center layout">
              <span>${this._map[key]}</span>
              <span class="flex"></span>
            </h3>
            </div>
            <div style="width:100%;min-height:180px;">
              <backend-ai-chart
                idx=${idx}
                .collection=${this.collection[this.period][key]}
              ></backend-ai-chart>
            </div>
          </wl-card>
            `) : html``}
      </wl-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "backend-ai-usage-list": BackendAIUsageList;
  }
}
