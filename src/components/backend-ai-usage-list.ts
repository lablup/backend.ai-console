/**
 @license
 Copyright (c) 2015-2019 Lablup Inc. All rights reserved.
 */

import {css, customElement, html, property} from "lit-element";
import {BackendAIPage} from './backend-ai-page';

import 'weightless/card';
import 'weightless/tab-group';
import 'weightless/tab';
import 'weightless/select';

import {BackendAiStyles} from './backend-ai-console-styles';
import './backend-ai-chart.js'
import {
  IronFlex,
  IronFlexAlignment,
  IronFlexFactors,
  IronPositioning
} from '../plastics/layout/iron-flex-layout-classes';

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

  init() {
    if (typeof window.backendaiclient === 'undefined' || window.backendaiclient === null || window.backendaiclient.ready === false) {
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

  readUserStat() {
    return window.backendaiclient.resources.user_stats()
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
          ],
          axisTitle: {
            x: "Date",
            y: _map[key]
          },
          period,
          unit_hint: data[data.length - 1][key].unit_hint
        }
      })
    }
  }

  render() {
    // language=HTML
    return html`
      <wl-card elevation="0">
        <h3 class="horizontal center layout">
          <wl-select label="Select Period" style="width: 130px;" @input=${this.pulldownChange}>
            <option value disabled>Select Period</option>
            <option value="1D" selected>1 Day</option>
            <option value="1W">1 Week</option>
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
                width="1000"
                height="180"
                elevation="1"
                type="line"
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
