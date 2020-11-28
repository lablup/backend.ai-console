/**
 @license
 Copyright (c) 2015-2020 Lablup Inc. All rights reserved.
 */

import {translate as _t} from 'lit-translate';
import {css, customElement, html, property} from 'lit-element';
import {BackendAIPage} from './backend-ai-page';

import '@material/mwc-list/mwc-list-item';
import '@material/mwc-select/mwc-select';

import 'weightless/card';
import {BackendAiStyles} from './backend-ai-general-styles';

import {
  IronFlex,
  IronFlexAlignment,
  IronFlexFactors,
  IronPositioning
} from '../plastics/layout/iron-flex-layout-classes';
import {default as PainKiller} from './backend-ai-painkiller';

/**
 Backend AI Pipeline List

 `backend-ai-pipeline-list` is a list of pipelines.

 @group Backend.AI Console
 @element backend-ai-pipeline-list
 */
@customElement('backend-ai-pipeline-list')
export default class BackendAIPipelineList extends BackendAIPage {
  // Elements
  @property({type: Object}) spinner = Object();
  // Configs
  @property({type: String}) pipelineConfigPath = 'config.json';
  // Pipeline prpoerties
  @property({type: Array}) pipelineFolders = Object();
  @property({type: String}) pipelineSelectedName;
  @property({type: String}) pipelineSelectedConfig;

  constructor() {
    super();

    this.pipelineSelectedName = localStorage.getItem('backendaiconsole.pipeline.selectedName') || '';
    this.pipelineSelectedConfig= localStorage.getItem('backendaiconsole.pipeline.selectedConfig') || {};
  }

  firstUpdated() {
    this.spinner = this.shadowRoot.querySelector('#loading-spinner');
    this._fetchPipelineFolders();
  }

  async _viewStateChanged(active) {
    await this.updateComplete;
    if (active === false) {
      return;
    }
    if (typeof window.backendaiclient === 'undefined' || window.backendaiclient === null || window.backendaiclient.ready === false) {
      document.addEventListener('backend-ai-connected', async () => {
      }, true);
    } else {
    }
  }

  /**
   * Download pipeline config file and return it.
   *
   * @param {String} folderName - virtual folder name to fetch pipeline config.
   * */
  async _downloadPipelineConfig(folderName) {
    try {
      const res = await window.backendaiclient.vfolder.download(
          this.pipelineConfigPath, folderName, false, true);
      return await res.json();
    } catch (err) {
      console.error(err);
      this.notification.text = PainKiller.relieve(err.title);
      this.notification.detail = err.message;
      this.notification.show(true);
    }
  }

  /**
   * Get every pipeline virtual folders of the user.
   * */
  async _fetchPipelineFolders() {
    this.spinner.show();
    try {
      const folders = await window.backendaiclient.vfolder.list();
      const pipelines = {};
      const downloadJobs: Array<Promise<any>> = [];
      folders.forEach((folder) => {
        if (folder.name.startsWith('pipeline-')) {
          const job = this._downloadPipelineConfig(folder.name)
              .then((resp) => {
                folder.config = resp;
                pipelines[folder.name] = folder;
              });
          downloadJobs.push(job);
        }
      });
      Promise.all(downloadJobs).then(() => {
        this.pipelineFolders = pipelines;
        this.spinner.hide();
      });
    } catch (err) {
      console.error(err);
      this.notification.text = PainKiller.relieve(err.title);
      this.notification.detail = err.message;
      this.notification.show(true);
      this.spinner.hide();
    }
  }

  /**
   * Current pipeline is changed from the dropdown menu.
   *
   * @param {Event} e - Dispatches from the native input event each time the input changes.
   * */
  _pipelineChanged(e) {
    const folderName = e.target.value;
    if (!folderName) {
      return;
    }
    this.pipelineSelectedName = folderName;
    this.pipelineSelectedConfig = this.pipelineFolders[folderName].config;
    localStorage.setItem('backendaiconsole.pipeline.selectedName', this.pipelineSelectedName);
    localStorage.setItem('backendaiconsole.pipeline.selectedConfig', this.pipelineSelectedConfig);
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
        :host {
          width: 100%;
        }

        mwc-select#pipeline-selector {
          width: 40%;
          min-width: 300px;
        }

        #pipeline-description {
          font-size: initial;
          color: #222;
          padding: 0.5em;
        }

        .indicator {
          font-size: smaller;
        }
      `
    ];
  }

    // language=HTML
  render() {
    return html`
      <div class="card" elevation="0">
        <h3 class="horizontal center layout wrap">
          <mwc-select id="pipeline-selector" outlined label="${_t('pipeline.SelectPipeline')}"
              @change="${this._pipelineChanged}">
            ${Object.keys(this.pipelineFolders).map((name) => html`
              <mwc-list-item class="pipeline-item" value="${name}"
                  ?selected="${name === this.pipelineSelectedName}"
                  folder-id="${this.pipelineFolders[name].id}"
                  folder-host="${this.pipelineFolders[name].host}">
                <span>${this.pipelineFolders[name].config.title}</span>
              </mwc-list-item>
            `)}
          </mwc-select>
          <div id="pipeline-description" class="layout vertical">
            ${this.pipelineSelectedConfig.description ? html`
              <span>${this.pipelineSelectedConfig.description}</span>
              <span class="indicator monospace">${this.pipelineSelectedConfig.environment + ':' + this.pipelineSelectedConfig.version}</span>
            ` : html``}
          </div>
        </h3>
      </div>

      <lablup-loading-spinner id="loading-spinner"></lablup-loading-spinner>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'backend-ai-pipeline-list': BackendAIPipelineList;
  }
}
