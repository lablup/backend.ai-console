/**
 @license
 Copyright (c) 2015-2019 Lablup Inc. All rights reserved.
 */

import {css, html} from "lit-element";
import {BackendAIPage} from './backend-ai-page';

import {render} from 'lit-html';

import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-icons/hardware-icons';
import '@polymer/iron-icons/av-icons';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-listbox/paper-listbox';

import '@vaadin/vaadin-grid/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-sorter';
import '@vaadin/vaadin-icons/vaadin-icons';
import '@vaadin/vaadin-item/vaadin-item';
import 'weightless/button';
import 'weightless/icon';
import 'weightless/card';
import 'weightless/dialog';

import {default as PainKiller} from "./backend-ai-painkiller";
import './lablup-notification';
import '../plastics/lablup-shields/lablup-shields';
import {BackendAiStyles} from "./backend-ai-console-styles";
import {IronFlex, IronFlexAlignment} from "../plastics/layout/iron-flex-layout-classes";

class BackendAIResourceTemplateList extends BackendAIPage {
  public keypairs: any;
  public resourcePolicy: any;
  public keypairInfo: any;
  public is_admin: any;
  public cpu_metric: any;
  public ram_metric: any;
  public gpu_metric: any;
  public fgpu_metric: any;
  public rate_metric: any;
  public concurrency_metric: any;
  public container_per_session_metric: any;
  public idle_timeout_metric: any;
  public vfolder_capacity_metric: any;
  public vfolder_count_metric: any;
  public _boundResourceRenderer: any;
  public _boundControlRenderer: any;
  public shadowRoot: any;
  public resourcePresets: any;
  public gpu_allocatable: any;
  public notification: any;
  public updateComplete: any;
  public condition: any;

  constructor() {
    super();
    this.keypairs = {};
    this.resourcePolicy = {};
    this.keypairInfo = {};
    this.is_admin = false;
    this.active = false;
    this.cpu_metric = [1, 2, 3, 4, 8, 16, 24, "Unlimited"];
    this.ram_metric = [1, 2, 4, 8, 16, 24, 32, 64, 128, 256, 512, "Unlimited"];
    this.gpu_metric = [0, 1, 2, 3, 4, 5, 6, 7, 8, 12, 16, "Unlimited"];
    this.fgpu_metric = [0, 0.3, 0.6, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 12, 16, "Unlimited"];
    this.rate_metric = [1000, 2000, 3000, 4000, 5000, 10000, 50000];
    this.concurrency_metric = [1, 2, 3, 4, 5, 10, 50, "Unlimited"];
    this.container_per_session_metric = [1, 2, 3, 4, 8, "Unlimited"];
    this.idle_timeout_metric = [60, 180, 540, 900, 1800, 3600];
    this.vfolder_capacity_metric = [1, 2, 5, 10, 50, 100, 200, 1000];
    this.vfolder_count_metric = [1, 2, 3, 4, 5, 10, 30, 50, 100];
    this._boundResourceRenderer = this.resourceRenderer.bind(this);
    this._boundControlRenderer = this.controlRenderer.bind(this);
  }

  static get is() {
    return 'backend-ai-resource-template-list';
  }

  static get properties() {
    return {
      keypairs: {
        type: Object
      },
      resourcePresets: {
        type: Object
      },
      keypairInfo: {
        type: Object
      },
      is_admin: {
        type: Boolean
      },
      notification: {
        type: Object
      },
      active: {
        type: Boolean
      },
      cpu_metric: {
        type: Array
      },
      ram_metric: {
        type: Array
      },
      gpu_metric: {
        type: Array
      },
      fgpu_metric: {
        type: Array
      },
      rate_metric: {
        type: Array
      },
      concurrency_metric: {
        type: Array
      },
      container_per_session_metric: {
        type: Array
      },
      idle_timeout_metric: {
        type: Array
      },
      vfolder_capacity_metric: {
        type: Array
      },
      vfolder_count_metric: {
        type: Array
      }
    };
  }

  static get styles() {
    return [
      BackendAiStyles,
      IronFlex,
      IronFlexAlignment,
      // language=CSS
      css`
        vaadin-grid {
          border: 0;
          font-size: 14px;
            height: calc(100vh - 265px);
        }

        paper-item {
          height: 30px;
          --paper-item-min-height: 30px;
        }

        wl-button > wl-icon {
          --icon-size: 24px;
          padding: 0;
        }

        wl-icon {
          --icon-size: 16px;
          padding: 0;
        }

        vaadin-item {
          font-size: 13px;
          font-weight: 100;
        }

        div.indicator,
        span.indicator {
          font-size: 9px;
          margin-right: 5px;
        }

        div.configuration {
          width: 70px !important;
        }

        div.configuration wl-icon {
          padding-right: 5px;
        }

        wl-button.create-button {
          width: 335px;
          --button-bg: white;
          --button-bg-hover: var(--paper-yellow-100);
          --button-bg-active: var(--paper-yellow-600);
        }

        wl-button {
          --button-bg: var(--paper-yellow-50);
          --button-bg-hover: var(--paper-yellow-100);
          --button-bg-active: var(--paper-yellow-600);
        }

        wl-button#create-policy-button {
          width: 100%;
          box-sizing: border-box;
          margin-top: 15px;
        }

        wl-card {
          margin: 0;
        }
      `];
  }

  resourceRenderer(root, column?, rowData?) {
    render(
      html`
        <div class="layout horizontal wrap center">
          <div class="layout horizontal configuration">
            <wl-icon class="fg green">developer_board</wl-icon>
            <span>${this._markIfUnlimited(rowData.item.resource_slots.cpu)}</span>
            <span class="indicator">cores</span>
          </div>
          <div class="layout horizontal configuration">
            <wl-icon class="fg green">memory</wl-icon>
            <span>${this._markIfUnlimited(rowData.item.resource_slots.mem_gb)}</span>
            <span class="indicator">GB</span>
          </div>
        </div>
        <div class="layout horizontal wrap center">
        ${rowData.item.resource_slots['cuda.device'] ?
        html`
        <div class="layout horizontal configuration">
          <wl-icon class="fg green">view_module</wl-icon>
          <span>${this._markIfUnlimited(rowData.item.resource_slots['cuda.device'])}</span>
          <span class="indicator">GPU</span>
        </div>
      ` : html``}
        ${rowData.item.resource_slots['cuda.shares'] ?
        html`
            <div class="layout horizontal configuration">
              <wl-icon class="fg green">view_module</wl-icon>
              <span>${this._markIfUnlimited(rowData.item.resource_slots['cuda.shares'])}</span>
              <span class="indicator">GPU</span>
            </div>
          ` : html``}
        </div>
      `, root
    );
  }

  controlRenderer(root, column?, rowData?) {
    render(
      html`
            <div id="controls" class="layout horizontal flex center"
                 .preset-name="${rowData.item.name}">
              ${this.is_admin ? html`
                    <wl-button class="fg blue controls-running" fab flat inverted
                      @click="${(e) => this._launchResourcePresetDialog(e)}">
                       <wl-icon>settings</wl-icon>
                    </wl-button>
              ` : html``}
            </div>
      `, root
    );
  }

  _indexRenderer(root, column, rowData) {
    let idx = rowData.index + 1;
    render(
      html`
        <div>${idx}</div>
      `,
      root
    );
  }

  _launchPresetAddDialog(e) {
    this.shadowRoot.querySelector('#create-preset-dialog').show();
  }

  render() {
    // language=HTML
    return html`
      <wl-card>
        <h4 class="horizontal flex center center-justified layout">
          <span>Resource Presets</span>
          <span class="flex"></span>
          <wl-button class="fg orange" id="add-resource-preset" outlined @click="${e => this._launchPresetAddDialog(e)}">
            <wl-icon>add</wl-icon>
            Create Preset
          </wl-button>
        </h4>
        <div>
          <lablup-notification id="notification"></lablup-notification>
          <lablup-loading-indicator id="loading-indicator"></lablup-loading-indicator>

          <vaadin-grid theme="row-stripes column-borders compact" aria-label="Resource Policy list"
                      .items="${this.resourcePresets}">
            <vaadin-grid-column width="40px" flex-grow="0" header="#" .renderer="${this._indexRenderer}"></vaadin-grid-column>

            <vaadin-grid-column resizable>
              <template class="header">
                <vaadin-grid-sorter path="name">Name</vaadin-grid-sorter>
              </template>
              <template>
                <div class="layout horizontal center flex">
                  <div>[[item.name]]</div>
                </div>
              </template>
            </vaadin-grid-column>

            <vaadin-grid-column width="150px" resizable header="Resources" .renderer="${this._boundResourceRenderer}">
            </vaadin-grid-column>

            <vaadin-grid-column resizable header="Control" .renderer="${this._boundControlRenderer}">
            </vaadin-grid-column>
          </vaadin-grid>
        </div>
      </wl-card>
      <wl-dialog id="modify-template-dialog" fixed backdrop blockscrolling>
        <wl-card elevation="1" class="login-panel intro centered">
          <h3 class="horizontal center layout">
            <span>Modify resource preset</span>
            <div class="flex"></div>
            <wl-button fab flat inverted @click="${(e) => this._hideDialog(e)}">
              <wl-icon>close</wl-icon>
            </wl-button>
          </h3>
          <form id="login-form">
            <fieldset>
              <paper-input type="text" name="preset_name" id="id_preset_name" label="Preset Name"
                          auto-validate required
                          pattern="[a-zA-Z0-9]*"
                          error-message="Policy name only accepts letters and numbers"></paper-input>
              <h4>Resource Preset</h4>
              <div class="horizontal center layout">
                <paper-dropdown-menu id="cpu-resource" label="CPU">
                  <paper-listbox slot="dropdown-content" selected="0">
                  ${this.cpu_metric.map(item => html`
                    <paper-item value="${item}">${item}</paper-item>
                  `)}
                  </paper-listbox>
                </paper-dropdown-menu>
                <paper-dropdown-menu id="ram-resource" label="RAM (GB)">
                  <paper-listbox slot="dropdown-content" selected="0">
                  ${this.ram_metric.map(item => html`
                    <paper-item value="${item}">${item}</paper-item>
                  `)}
                  </paper-listbox>
                </paper-dropdown-menu>
              </div>
              <div class="horizontal center layout">
                <paper-dropdown-menu id="gpu-resource" label="GPU" ?disabled=${!this.gpu_allocatable}>
                  <paper-listbox slot="dropdown-content" selected="0">
                  ${this.gpu_metric.map(item => html`
                    <paper-item value="${item}">${item}</paper-item>
                  `)}
                  </paper-listbox>
                </paper-dropdown-menu>
                <paper-dropdown-menu id="fgpu-resource" label="fGPU" ?disabled=${!this.gpu_allocatable}>
                  <paper-listbox slot="dropdown-content" selected="0">
                  ${this.fgpu_metric.map(item => html`
                    <paper-item value="${item}">${item}</paper-item>
                  `)}
                  </paper-listbox>
                </paper-dropdown-menu>
              </div>
              <br/><br/>
              <wl-button class="fg orange create-button" outlined type="button"
                @click="${() => this._modifyResourceTemplate()}">
                <wl-icon>check</wl-icon>
                Save Changes
              </wl-button>
            </fieldset>
          </form>
        </wl-card>
      </wl-dialog>
      <wl-dialog id="create-preset-dialog" fixed backdrop blockscrolling>
        <wl-card elevation="1" class="login-panel intro centered" style="margin: 0;">
          <h3 class="horizontal center layout">
            <span>Create resource preset</span> 
            <div class="flex"></div>
            <wl-button fab flat inverted @click="${(e) => this._hideDialog(e)}">
              <wl-icon>close</wl-icon>
            </wl-button>
          </h3>
          <form id="preset-creation-form">
            <fieldset>
              <paper-input
                type="text"
                name="preset_name"
                id="create-preset-name"
                label="Preset Name"
                auto-validate
                required
                pattern="[a-zA-Z0-9]*"
                error-message="Policy name only accepts letters and numbers"
              ></paper-input>
              <h4>Resource Preset</h4>
              <div class="horizontal center layout">
                <paper-dropdown-menu id="create-cpu-resource" label="CPU">
                  <paper-listbox slot="dropdown-content" selected="0">
                  ${this.cpu_metric.map(item => html`
                    <paper-item value="${item}">${item}</paper-item>
                  `)}
                  </paper-listbox>
                </paper-dropdown-menu>
                <paper-dropdown-menu id="create-ram-resource" label="RAM (GB)">
                  <paper-listbox slot="dropdown-content" selected="0">
                  ${this.ram_metric.map(item => html`
                    <paper-item value="${item}">${item}</paper-item>
                  `)}
                  </paper-listbox>
                </paper-dropdown-menu>
              </div>
              <div class="horizontal center layout">
                <paper-dropdown-menu id="create-gpu-resource" label="GPU" ?disabled=${!this.gpu_allocatable}>
                  <paper-listbox slot="dropdown-content" selected="0">
                  ${this.gpu_metric.map(item => html`
                    <paper-item value="${item}">${item}</paper-item>
                  `)}
                  </paper-listbox>
                </paper-dropdown-menu>
                <paper-dropdown-menu id="create-fgpu-resource" label="fGPU" ?disabled=${!this.gpu_allocatable}>
                  <paper-listbox slot="dropdown-content" selected="0">
                  ${this.fgpu_metric.map(item => html`
                    <paper-item value="${item}">${item}</paper-item>
                  `)}
                  </paper-listbox>
                </paper-dropdown-menu>
              </div>
              <wl-button
                class="fg orange create-button"
                id="create-policy-button"
                outlined
                type="button"
                @click="${this._createPreset}"
              >
                <wl-icon>add</wl-icon>
                Add
              </wl-button>
            </fieldset>
          </form>
        </wl-card>
      </wl-dialog>
    `;
  }

  firstUpdated() {
    this.notification = window.lablupNotification;
  }

  async _viewStateChanged(active) {
    await this.updateComplete;
    if (active === false) {
      return;
    }
    if (window.backendaiclient === undefined || window.backendaiclient === null || window.backendaiclient.ready === false) {
      document.addEventListener('backend-ai-connected', () => {
        this._refreshTemplateData();
        this.is_admin = window.backendaiclient.is_admin;
      }, true);
    } else { // already connected
      this._refreshTemplateData();
      this.is_admin = window.backendaiclient.is_admin;
      window.backendaiclient.getResourceSlots()
        .then(res => {
          this.gpu_allocatable = (Object.keys(res).length !== 2);
        })
    }
  }

  _hideDialog(e) {
    let hideButton = e.target;
    let dialog = hideButton.closest('wl-dialog');
    dialog.hide();
  }

  _launchResourcePresetDialog(e) {
    this.updateCurrentPresetToDialog(e);
    this.shadowRoot.querySelector('#modify-template-dialog').show();
  }

  updateCurrentPresetToDialog(e) {
    const controls = e.target.closest('#controls');
    const preset_name = controls['preset-name'];

    console.log(preset_name);

    let resourcePresets = window.backendaiclient.utils.gqlToObject(this.resourcePresets, 'name');
    let resourcePreset = resourcePresets[preset_name];
    console.log(resourcePreset);
    console.log(resourcePreset.resource_slots['cuda.device']);
    //resourcePolicy['total_resource_slots'] = JSON.parse(resourcePolicy['total_resource_slots']);
    this.shadowRoot.querySelector('#id_preset_name').value = preset_name;
    this.shadowRoot.querySelector('#cpu-resource').value = resourcePreset.resource_slots.cpu;
    this.shadowRoot.querySelector('#gpu-resource').value = resourcePreset.resource_slots['cuda.device'];
    this.shadowRoot.querySelector('#fgpu-resource').value = resourcePreset.resource_slots['cuda.shares'];
    this.shadowRoot.querySelector('#ram-resource').value = parseFloat(window.backendaiclient.utils.changeBinaryUnit(resourcePreset.resource_slots['mem'], 'g'));
  }

  _refreshTemplateData() {
    return window.backendaiclient.resourcePreset.check().then((response) => {
      let resourcePresets = response.presets;
      Object.keys(resourcePresets).map((objectKey, index) => {
        let preset = resourcePresets[objectKey];
        preset.resource_slots.mem_gb = parseFloat(window.backendaiclient.utils.changeBinaryUnit(preset.resource_slots.mem, 'g'));
      });
      this.resourcePresets = resourcePresets;
    }).catch(err => {
      console.log(err);
      if (err && err.message) {
        this.notification.text = PainKiller.relieve(err.message);
        this.notification.show();
      }
    });
  }

  refresh() {
    //let user_id = window.backendaiclient_email;
    let user_id = null;
    this._refreshTemplateData();
  }

  _isActive() {
    return this.condition === 'active';
  }

  _readResourcePresetInput() {
    const wrapper = v => v !== undefined && v.includes('Unlimited') ? 'Infinity' : v;
    const cpu = wrapper(this.shadowRoot.querySelector('#cpu-resource').value),
      mem = wrapper(this.shadowRoot.querySelector('#ram-resource').value + 'g'),
      gpu_resource = wrapper(this.shadowRoot.querySelector('#gpu-resource').value),
      fgpu_resource = wrapper(this.shadowRoot.querySelector('#fgpu-resource').value);

    let resource_slots = {cpu, mem};
    if (gpu_resource !== undefined && gpu_resource !== null && gpu_resource !== "" && gpu_resource !== '0') {
      resource_slots["cuda.device"] = parseInt(gpu_resource);
    }
    if (fgpu_resource !== undefined && fgpu_resource !== null && fgpu_resource !== "" && fgpu_resource !== '0') {
      resource_slots["cuda.shares"] = parseFloat(fgpu_resource);
    }

    const input = {
      'resource_slots': JSON.stringify(resource_slots)
    };

    return input;
  }

  _modifyResourceTemplate() {
    let name = this.shadowRoot.querySelector('#id_preset_name').value;
    let input = this._readResourcePresetInput();
    window.backendaiclient.resourcePreset.mutate(name, input).then(response => {
      this.shadowRoot.querySelector('#modify-template-dialog').hide();
      this.notification.text = "Resource policy successfully updated.";
      this.notification.show();
      this._refreshTemplateData();
    }).catch(err => {
      console.log(err);
      if (err && err.message) {
        this.shadowRoot.querySelector('#modify-template-dialog').hide();
        this.notification.text = PainKiller.relieve(err.message);
        this.notification.show();
      }
    });
  }

  _deleteKey(e) {
    const termButton = e.target;
    const controls = e.target.closest('#controls');
    const accessKey = controls.accessKey;
    window.backendaiclient.keypair.delete(accessKey).then(response => {
      this.refresh();
    }).catch(err => {
      console.log(err);
      if (err && err.message) {
        this.notification.text = PainKiller.relieve(err.message);
        this.notification.show();
      }
    });
  }

  _findKeyItem(element) {
    return element.access_key = this;
  }

  _elapsed(start, end) {
    var startDate = new Date(start);
    if (this.condition == 'active') {
      var endDate = new Date();
    } else {
      var endDate = new Date();
    }
    var seconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
    var days = Math.floor(seconds / 86400);
    return days;
  }

  _humanReadableTime(d: any) {
    d = new Date(d);
    return d.toUTCString();
  }

  _indexFrom1(index) {
    return index + 1;
  }

  _markIfUnlimited(value) {
    if (['-', 0, 'Unlimited', Infinity, 'Infinity'].includes(value)) {
      return '∞';
    } else {
      return value;
    }
  }

  _createPreset() {
    const wrapper = v => v !== undefined && v.includes('Unlimited') ? 'Infinity' : v;
    const preset_name = wrapper(this.shadowRoot.querySelector('#create-preset-name').value),
      cpu = wrapper(this.shadowRoot.querySelector('#create-cpu-resource').value),
      mem = wrapper(this.shadowRoot.querySelector('#create-ram-resource').value + 'g'),
      gpu_resource = wrapper(this.shadowRoot.querySelector('#create-gpu-resource').value),
      fgpu_resource = wrapper(this.shadowRoot.querySelector('#create-fgpu-resource').value);

    let resource_slots = {cpu, mem};
    if (gpu_resource !== undefined && gpu_resource !== null && gpu_resource !== "" && gpu_resource !== '0') {
      resource_slots["cuda.device"] = parseInt(gpu_resource);
    }
    if (fgpu_resource !== undefined && fgpu_resource !== null && fgpu_resource !== "" && fgpu_resource !== '0') {
      resource_slots["cuda.shares"] = parseFloat(fgpu_resource);
    }

    const input = {
      'resource_slots': JSON.stringify(resource_slots)
    };

    window.backendaiclient.resourcePreset.add(preset_name, input)
      .then(res => {
        this.shadowRoot.querySelector('#create-preset-dialog').hide();
        if (res.create_resource_preset.ok) {
          this.notification.text = "Resource preset successfully created";
          this.refresh();

          // reset values
          this.shadowRoot.querySelector('#create-preset-name').value = "";
          this.shadowRoot.querySelector('#create-cpu-resource').value = 1;
          this.shadowRoot.querySelector('#create-ram-resource').value = 1;
          this.shadowRoot.querySelector('#create-gpu-resource').value = 0;
          this.shadowRoot.querySelector('#create-fgpu-resource').value = 0;
        } else {
          this.notification.text = PainKiller.relieve(res.create_resource_preset.msg);
        }
        this.notification.show();
      })
  }
}

customElements.define(BackendAIResourceTemplateList.is, BackendAIResourceTemplateList);
