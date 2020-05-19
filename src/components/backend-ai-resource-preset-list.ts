/**
 @license
 Copyright (c) 2015-2020 Lablup Inc. All rights reserved.
 */

import {translate as _t} from "lit-translate";
import {css, customElement, html, property} from "lit-element";
import {BackendAIPage} from './backend-ai-page';

import {render} from 'lit-html';

import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-listbox/paper-listbox';

import '@vaadin/vaadin-grid/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-sorter';
import '@vaadin/vaadin-icons/vaadin-icons';
import '@vaadin/vaadin-item/vaadin-item';

import '@material/mwc-textfield';

import 'weightless/button';
import 'weightless/card';
import 'weightless/dialog';
import 'weightless/icon';

import {default as PainKiller} from "./backend-ai-painkiller";
import '../plastics/lablup-shields/lablup-shields';
import {BackendAiStyles} from "./backend-ai-general-styles";
import {IronFlex, IronFlexAlignment} from "../plastics/layout/iron-flex-layout-classes";

@customElement("backend-ai-resource-preset-list")
class BackendAiResourcePresetList extends BackendAIPage {
  @property({type: Array}) resourcePolicy = {};
  @property({type: Boolean}) is_admin = false;
  @property({type: Boolean}) active = false;
  @property({type: Boolean}) gpu_allocatable = false;
  @property({type: String}) gpuAllocationMode = 'device';
  @property({type: String}) condition = '';
  @property({type: String}) presetName = '';
  @property({type: Object}) resourcePresets;
  @property({type: Array}) _boundResourceRenderer = this.resourceRenderer.bind(this);
  @property({type: Array}) _boundControlRenderer = this.controlRenderer.bind(this);

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
          border: 0;
          font-size: 14px;
          height: calc(100vh - 225px);
        }

        paper-dropdown-menu {
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

        mwc-textfield {
          width: 100%;
          --mdc-theme-primary: #242424;
          --mdc-text-field-fill-color: transparent;
        }

        mwc-textfield.yellow {
          --mdc-theme-primary: var(--paper-yellow-600) !important;
        }

        wl-button.create-button {
          width: 335px;
          --button-bg: white;
          --button-bg-hover: var(--paper-yellow-100);
          --button-bg-active: var(--paper-yellow-600);
        }

        wl-button {
          color: var(--paper-yellow-600);
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
            <span class="indicator">${_t("general.cores")}</span>
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
        ${rowData.item.shared_memory ?
        html`
          <div class="layout horizontal configuration">
            <wl-icon class="fg blue">memory</wl-icon>
            <span>${rowData.item.shared_memory_gb}</span>
            <span class="indicator">GB</span>
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
            <wl-button class="fg red controls-running" fab flat inverted
              @click="${(e) => this._launchDeleteResourcePresetDialog(e)}">
                <wl-icon>delete</wl-icon>
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
          <span>${_t("resourcePreset.ResourcePresets")}</span>
          <span class="flex"></span>
          <wl-button class="fg orange" id="add-resource-preset" outlined @click="${e => this._launchPresetAddDialog(e)}">
            <wl-icon>add</wl-icon>
            ${_t("resourcePreset.CreatePreset")}
          </wl-button>
        </h4>
        <div>
          <vaadin-grid theme="row-stripes column-borders compact" aria-label="Resource Policy list"
                      .items="${this.resourcePresets}">
            <vaadin-grid-column width="40px" flex-grow="0" header="#" .renderer="${this._indexRenderer}"></vaadin-grid-column>

            <vaadin-grid-column resizable>
              <template class="header">
                <vaadin-grid-sorter path="name">${_t("resourcePreset.Name")}</vaadin-grid-sorter>
              </template>
              <template>
                <div class="layout horizontal center flex">
                  <div>[[item.name]]</div>
                </div>
              </template>
            </vaadin-grid-column>

            <vaadin-grid-column width="150px" resizable header="${_t("resourcePreset.Resources")}" .renderer="${this._boundResourceRenderer}">
            </vaadin-grid-column>

            <vaadin-grid-column resizable header="${_t("general.Control")}" .renderer="${this._boundControlRenderer}">
            </vaadin-grid-column>
          </vaadin-grid>
        </div>
      </wl-card>
      <wl-dialog id="modify-template-dialog" fixed backdrop blockscrolling>
        <wl-card elevation="1" class="login-panel intro centered">
          <h3 class="horizontal center layout">
            <span>${_t("resourcePreset.ModifyResourcePreset")}</span>
            <div class="flex"></div>
            <wl-button class="fg orange" fab flat inverted @click="${(e) => this._hideDialog(e)}">
              <wl-icon>close</wl-icon>
            </wl-button>
          </h3>
          <form id="login-form">
            <fieldset>
              <mwc-textfield type="text" name="preset_name" id="id_preset_name" label="${_t("resourcePreset.PresetName")}"
                          auto-validate required
                          pattern="[a-zA-Z0-9_-]+"
                          disabled
                          error-message="Policy name only accepts letters, numbers, underscore, and dash"></mwc-textfield>
              <h4>${_t("resourcePreset.ResourcePreset")}</h4>
              <div class="horizontal center layout">
                <mwc-textfield id="cpu-resource" type="number" label="CPU"
                    min="1" value="1"></mwc-textfield>
                <mwc-textfield id="ram-resource" type="number" label="RAM (GB)"
                    min="1" value="1"></mwc-textfield>
              </div>
              <div class="horizontal center layout">
                <mwc-textfield id="gpu-resource" type="number" label="GPU"
                    min="0" value="0" ?disabled=${this.gpuAllocationMode === 'fractional'}></mwc-textfield>
                <mwc-textfield id="fgpu-resource" type="number" label="fGPU"
                    min="0" value="0" ?disabled=${this.gpuAllocationMode !== 'fractional'}></mwc-textfield>
              </div>
              <div class="horizontal center layout">
                <mwc-textfield id="shmem-resource" type="number" label="Shared Memory (GB)" min="0"></mwc-textfield>
              </div>
              <br/><br/>
              <wl-button class="fg orange create-button" outlined type="button"
                @click="${() => this._modifyResourceTemplate()}">
                <wl-icon>check</wl-icon>
                ${_t("button.SaveChanges")}
              </wl-button>
            </fieldset>
          </form>
        </wl-card>
      </wl-dialog>
      <wl-dialog id="create-preset-dialog" fixed backdrop blockscrolling>
        <wl-card elevation="1" class="login-panel intro centered" style="margin: 0;">
          <h3 class="horizontal center layout">
            <span>${_t("resourcePreset.CreateResourcePreset")}</span>
            <div class="flex"></div>
            <wl-button fab flat inverted @click="${(e) => this._hideDialog(e)}">
              <wl-icon>close</wl-icon>
            </wl-button>
          </h3>
          <form id="preset-creation-form">
            <fieldset>
              <mwc-textfield
                type="text"
                name="preset_name"
                id="create-preset-name"
                label="Preset Name"
                auto-validate
                required
                pattern="[a-zA-Z0-9-_]+"
                error-message="Preset name only accepts letters and numbers"
              ></mwc-textfield>
              <h4>${_t("resourcePreset.ResourcePreset")}</h4>
              <div class="horizontal center layout">
                <mwc-textfield id="create-cpu-resource" type="number" label="CPU"
                    min="1" value="1"></mwc-textfield>
                <mwc-textfield id="create-ram-resource" type="number" label="RAM (GB)"
                    min="1" value="1"></mwc-textfield>
              </div>
              <div class="horizontal center layout">
                <mwc-textfield id="create-gpu-resource" type="number" label="GPU"
                    min="0" value="0" ?disabled=${this.gpuAllocationMode === 'fractional'}></mwc-textfield>
                <mwc-textfield id="create-fgpu-resource" type="number" label="fGPU"
                    min="0" value="0" ?disabled=${this.gpuAllocationMode !== 'fractional'}></mwc-textfield>
              </div>
              <div class="horizontal center layout">
                <mwc-textfield id="create-shmem-resource" type="number" label="Shared Memory (GB)" min="0"></mwc-textfield>
              </div>
              <wl-button
                class="fg orange create-button"
                id="create-policy-button"
                outlined
                type="button"
                @click="${this._createPreset}"
              >
                <wl-icon>add</wl-icon>
                ${_t("button.Add")}
              </wl-button>
            </fieldset>
          </form>
        </wl-card>
      </wl-dialog>
      <wl-dialog id="delete-resource-preset-dialog" fixed backdrop blockscrolling>
         <wl-title level="3" slot="header">${_t("dialog.title.LetsDouble-Check")}</wl-title>
         <div slot="content">
            <p>${_t("resourcePreset.AboutToDeletePreset")}</p>
            <p style="text-align:center;">${this.presetName}</p>
            <p>${_t("dialog.warning.CannotBeUndone")} ${_t("dialog.ask.DoYouWantToProceed")}</p>
         </div>
         <div slot="footer">
            <wl-button class="fg orange cancel" inverted flat @click="${(e) => this._hideDialog(e)}">${_t("button.Cancel")}</wl-button>
            <wl-button class="fg orange ok" @click="${(e) => this._deleteResourcePresetWithCheck(e)}">${_t("button.Okay")}</wl-button>
         </div>
      </wl-dialog>
    `;
  }

  firstUpdated() {
    this.notification = globalThis.lablupNotification;
    let textfields = this.shadowRoot.querySelectorAll('mwc-textfield');
    for (const textfield of textfields) {
      this._addInputValidator(textfield);
    }
  }

  async _viewStateChanged(active) {
    await this.updateComplete;
    if (active === false) {
      return;
    }
    if (typeof globalThis.backendaiclient === "undefined" || globalThis.backendaiclient === null || globalThis.backendaiclient.ready === false) {
      document.addEventListener('backend-ai-connected', () => {
        this._refreshTemplateData();
        this.is_admin = globalThis.backendaiclient.is_admin;
      }, true);
    } else { // already connected
      this._refreshTemplateData();
      this.is_admin = globalThis.backendaiclient.is_admin;
      globalThis.backendaiclient.getResourceSlots()
        .then(res => {
          this.gpu_allocatable = (Object.keys(res).length !== 2);
          if (Object.keys(res).includes('cuda.shares')) {
            this.gpuAllocationMode = 'fractional';
          } else {
            this.gpuAllocationMode = 'device';
          }
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

  _launchDeleteResourcePresetDialog(e) {
    const controls = e.target.closest('#controls');
    const preset_name = controls['preset-name'];
    this.presetName = preset_name;
    this.shadowRoot.querySelector('#delete-resource-preset-dialog').show();
  }

  _deleteResourcePresetWithCheck(e) {
    globalThis.backendaiclient.resourcePreset.delete(this.presetName).then(response => {
      this.shadowRoot.querySelector('#delete-resource-preset-dialog').hide();
      this.notification.text = "Resource preset is successfully deleted.";
      this.notification.show();
      this._refreshTemplateData();
    }).catch(err => {
      console.log(err);
      if (err && err.message) {
        this.shadowRoot.querySelector('#delete-resource-preset-dialog').hide();
        this.notification.text = PainKiller.relieve(err.title);
        this.notification.detail = err.message;
        this.notification.show(true, err);
      }
    });
  }

  updateCurrentPresetToDialog(e) {
    const controls = e.target.closest('#controls');
    const preset_name = controls['preset-name'];
    let resourcePresets = globalThis.backendaiclient.utils.gqlToObject(this.resourcePresets, 'name');
    let resourcePreset = resourcePresets[preset_name];
    console.log(resourcePreset);
    //resourcePolicy['total_resource_slots'] = JSON.parse(resourcePolicy['total_resource_slots']);
    this.shadowRoot.querySelector('#id_preset_name').value = preset_name;
    this.shadowRoot.querySelector('#cpu-resource').value = resourcePreset.resource_slots.cpu;
    if ('cuda.device' in resourcePreset.resource_slots) {
      this.shadowRoot.querySelector('#gpu-resource').value = resourcePreset.resource_slots['cuda.device'];
    } else {
      this.shadowRoot.querySelector('#gpu-resource').value = "";
    }
    if ('cuda.shares' in resourcePreset.resource_slots) {
      this.shadowRoot.querySelector('#fgpu-resource').value = resourcePreset.resource_slots['cuda.shares'];
    } else {
      this.shadowRoot.querySelector('#fgpu-resource').value = "";
    }
    this.shadowRoot.querySelector('#ram-resource').value = parseFloat(globalThis.backendaiclient.utils.changeBinaryUnit(resourcePreset.resource_slots['mem'], 'g'));
    if (resourcePreset.shared_memory) {
      this.shadowRoot.querySelector('#shmem-resource').value = parseFloat(globalThis.backendaiclient.utils.changeBinaryUnit(resourcePreset.shared_memory, 'g')).toFixed(2);
    } else {
      this.shadowRoot.querySelector('#shmem-resource').value = '';
    }
  }

  _refreshTemplateData() {
    let param = {
      'group': globalThis.backendaiclient.current_group
    };
    return globalThis.backendaiclient.resourcePreset.check(param).then((response) => {
      let resourcePresets = response.presets;
      Object.keys(resourcePresets).map((objectKey, index) => {
        let preset = resourcePresets[objectKey];
        preset.resource_slots.mem_gb = parseFloat(globalThis.backendaiclient.utils.changeBinaryUnit(preset.resource_slots.mem, 'g'));
        if (preset.shared_memory) {
          preset.shared_memory_gb = parseFloat(globalThis.backendaiclient.utils.changeBinaryUnit(preset.shared_memory, 'g')).toFixed(2);
        } else {
          preset.shared_memory_gb = null;
        }
      });
      this.resourcePresets = resourcePresets;
    }).catch(err => {
      console.log(err);
      if (err && err.message) {
        this.notification.text = PainKiller.relieve(err.title);
        this.notification.detail = err.message;
        this.notification.show(true, err);
      }
    });
  }

  refresh() {
    this._refreshTemplateData();
  }

  _isActive() {
    return this.condition === 'active';
  }

  _readResourcePresetInput() {
    const wrapper = v => v !== undefined && v.includes('Unlimited') ? 'Infinity' : v;
    const cpu = wrapper(this.shadowRoot.querySelector('#cpu-resource').value);
    const mem = wrapper(this.shadowRoot.querySelector('#ram-resource').value + 'g');
    const gpu_resource = wrapper(this.shadowRoot.querySelector('#gpu-resource').value);
    const fgpu_resource = wrapper(this.shadowRoot.querySelector('#fgpu-resource').value);
    let sharedMemory = this.shadowRoot.querySelector('#shmem-resource').value;
    if (sharedMemory) sharedMemory = sharedMemory + 'g';

    let resource_slots = {cpu, mem};
    if (gpu_resource !== undefined && gpu_resource !== null && gpu_resource !== "" && gpu_resource !== '0') {
      resource_slots["cuda.device"] = parseInt(gpu_resource);
    }
    if (fgpu_resource !== undefined && fgpu_resource !== null && fgpu_resource !== "" && fgpu_resource !== '0') {
      resource_slots["cuda.shares"] = parseFloat(fgpu_resource);
    }

    const input = {
      resource_slots: JSON.stringify(resource_slots),
      shared_memory: sharedMemory
    };

    return input;
  }

  _modifyResourceTemplate() {
    const name = this.shadowRoot.querySelector('#id_preset_name').value;
    const wrapper = v => v !== undefined && v.includes('Unlimited') ? 'Infinity' : v;
    const mem = wrapper(this.shadowRoot.querySelector('#ram-resource').value + 'g');
    if (!name) {
      this.notification.text = 'No preset name';
      this.notification.show();
      return;
    }
    let input = this._readResourcePresetInput();
    if (input.shared_memory >= mem) {
      this.notification.text = 'Memory should be larger than shared memory';
      this.notification.show();
      return;
    }
    globalThis.backendaiclient.resourcePreset.mutate(name, input).then(response => {
      this.shadowRoot.querySelector('#modify-template-dialog').hide();
      this.notification.text = "Resource preset successfully updated.";
      this.notification.show();
      this._refreshTemplateData();
    }).catch(err => {
      console.log(err);
      if (err && err.message) {
        this.shadowRoot.querySelector('#modify-template-dialog').hide();
        this.notification.text = PainKiller.relieve(err.title);
        this.notification.detail = err.message;
        this.notification.show(true, err);
      }
    });
  }

  _deleteKey(e) {
    const controls = e.target.closest('#controls');
    const accessKey = controls.accessKey;
    globalThis.backendaiclient.keypair.delete(accessKey).then(response => {
      this.refresh();
    }).catch(err => {
      console.log(err);
      if (err && err.message) {
        this.notification.text = PainKiller.relieve(err.title);
        this.notification.detail = err.message;
        this.notification.show(true, err);
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
    const wrapper = (v) => {
      v = v.toString();
      return typeof (v) !== "undefined" && v.includes('Unlimited') ? 'Infinity' : v;
    };
    const preset_name = wrapper(this.shadowRoot.querySelector('#create-preset-name').value);
    const cpu = wrapper(this.shadowRoot.querySelector('#create-cpu-resource').value);
    const mem = wrapper(this.shadowRoot.querySelector('#create-ram-resource').value + 'g');
    const gpu_resource = wrapper(this.shadowRoot.querySelector('#create-gpu-resource').value);
    const fgpu_resource = wrapper(this.shadowRoot.querySelector('#create-fgpu-resource').value);
    let sharedMemory = this.shadowRoot.querySelector('#create-shmem-resource').value;
    if (sharedMemory) sharedMemory = sharedMemory + 'g';
    if (!preset_name) {
      this.notification.text = 'No preset name';
      this.notification.show();
      return;
    }
    if (sharedMemory >= mem) {
      this.notification.text = 'Memory should be larger than shared memory';
      this.notification.show();
      return;
    }

    let resource_slots = {cpu, mem};
    if (gpu_resource !== undefined && gpu_resource !== null && gpu_resource !== "" && gpu_resource !== '0') {
      resource_slots["cuda.device"] = parseInt(gpu_resource);
    }
    if (fgpu_resource !== undefined && fgpu_resource !== null && fgpu_resource !== "" && fgpu_resource !== '0') {
      resource_slots["cuda.shares"] = parseFloat(fgpu_resource);
    }

    const input = {
      resource_slots: JSON.stringify(resource_slots),
      shared_memory: sharedMemory
    };

    globalThis.backendaiclient.resourcePreset.add(preset_name, input)
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
          this.shadowRoot.querySelector('#create-shmem-resource').value = '';
        } else {
          this.notification.text = PainKiller.relieve(res.create_resource_preset.msg);
        }
        this.notification.show();
      })
  }
}


declare global {
  interface HTMLElementTagNameMap {
    "backend-ai-resource-preset-list": BackendAiResourcePresetList;
  }
}
