/**
 @license
 Copyright (c) 2015-2019 Lablup Inc. All rights reserved.
 */

import {css, html} from "lit-element";
import {BackendAIPage} from './backend-ai-page.js';

import {setPassiveTouchGestures} from '@polymer/polymer/lib/utils/settings';

import {BackendAiStyles} from './backend-ai-console-styles';
import {
  IronFlex,
  IronFlexAlignment,
  IronFlexFactors,
  IronPositioning
} from '../plastics/layout/iron-flex-layout-classes';
import '../plastics/lablup-shields/lablup-shields';
import '@vaadin/vaadin-grid/theme/lumo/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-sorter';
import './lablup-loading-indicator';
import 'weightless/button';
import 'weightless/icon';
import 'weightless/card';
import 'weightless/checkbox';

import './backend-ai-resource-template-list';

class BackendAiEnvironmentList extends BackendAIPage {
  constructor() {
    super();
    setPassiveTouchGestures(true);
    this.images = {};
    this.active = false;
  }

  static get is() {
    return 'backend-ai-environment-list';
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
        vaadin-grid {
          border: 0;
          font-size: 14px;
          height: calc(100vh - 210px);
        }

        wl-button > wl-icon {
          --icon-size: 24px;
          padding: 0;
        }

        wl-icon {
          --icon-size: 16px;
          padding: 0;
        }

        div.indicator,
        span.indicator {
          font-size: 9px;
          margin-right: 5px;
        }
      `];
  }

  static get properties() {
    return {
      active: {
        type: Boolean
      },
      images: {
        type: Object,
        hasChanged: () => true
      },
      indicator: {
        type: Object
      }
    }
  }

  render() {
    // language=HTML
    return html`
      <lablup-loading-indicator id="loading-indicator"></lablup-loading-indicator>
      <vaadin-grid theme="row-stripes column-borders compact" aria-label="Environments" id="testgrid" .items="${this.images}">
        <vaadin-grid-column width="40px" flex-grow="0" text-align="center">
          <template class="header">
            <vaadin-grid-sorter path="installed"></vaadin-grid-sorter>
          </template>
          <template>
            <div "layout horizontal center center-justified"  style="margin:0; padding:0;">
              <template is="dom-if" if="[[item.installed]]">
                <wl-checkbox style="--checkbox-size:12px;" checked></wl-checkbox>
              </template>
              <template is="dom-if" if="[[!item.installed]]">
                <wl-checkbox style="--checkbox-size:12px;"></wl-checkbox>
              </template>
            </div>
          </template>
        </vaadin-grid-column>

        <vaadin-grid-column width="80px" resizable>
          <template class="header">
            <vaadin-grid-sorter path="registry">Registry</vaadin-grid-sorter>
          </template>
          <template>
            <div class="layout vertical">
              <span>[[item.registry]]</span>
            </div>
          </template>
        </vaadin-grid-column>

        <vaadin-grid-column width="50px" resizable>
          <template class="header">Namespace</template>
          <template>
            <div>[[item.namespace]]</div>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable>
          <template class="header">Language</template>
          <template>
            <div>[[item.lang]]</div>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column width="40px" resizable>
          <template class="header">Version</template>
          <template>
            <div>[[item.baseversion]]</div>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column width="60px" resizable>
          <template class="header">Base</template>
          <template>
            <template is="dom-repeat" items="[[ item.baseimage ]]">
              <lablup-shields app="" color="blue" description="[[item]]"></lablup-shields>
            </template>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column width="50px" resizable>
          <template class="header">Constraint</template>
          <template>
            <template is="dom-if" if="[[item.additional_req]]">
              <lablup-shields app="" color="green" description="[[item.additional_req]]"></lablup-shields>
            </template>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column width="150px" flex-grow="0" resizable>
          <template class="header">
            Digest
          </template>
          <template>
            <div class="layout vertical">
              <span class="indicator">[[item.digest]]</span>
            </div>
          </template>
        </vaadin-grid-column>

        <vaadin-grid-column width="150px" flex-grow="0" resizable>
          <template class="header">Requirements</template>
          <template>
            <div class="layout horizontal center flex">
              <div class="layout horizontal configuration">
                <iron-icon class="fg green" icon="hardware:developer-board"></iron-icon>
                <span>[[item.cpu_limit_min]]</span> ~
                <span>[[item.cpu_limit_max]]</span>
                <span class="indicator">core</span>
              </div>
            </div>
            <div class="layout horizontal center flex">
              <div class="layout horizontal configuration">
                <iron-icon class="fg green" icon="hardware:memory"></iron-icon>
                <span>[[item.mem_limit_min]]</span> ~
                <span>[[item.mem_limit_max]]</span>
              </div>
            </div>
            <template is="dom-if" if="[[item.cuda_device_limit_min]]">
              <div class="layout horizontal center flex">
                <div class="layout horizontal configuration">
                  <iron-icon class="fg green" icon="hardware:icons:view-module"></iron-icon>
                  <span>[[item.cuda_device_limit_min]]</span> ~
                  <span>[[item.cuda_device_limit_max]]</span>
                  <span class="indicator">GPU</span>
                </div>
              </div>
            </template>
            <template is="dom-if" if="[[item.cuda_shares_limit_min]]">
              <div class="layout horizontal center flex">
                <div class="layout horizontal configuration">
                  <iron-icon class="fg green" icon="hardware:icons:view-module"></iron-icon>
                  <span>[[item.cuda_shares_limit_min]]</span> ~
                  <span>[[item.cuda_shares_limit_max]]</span>
                  <span class="indicator">vGPU</span>
                </div>
              </div>
            </template>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable>
          <template class="header">Control</template>
          <template>
            <div id="controls" class="layout horizontal flex center"
                 kernel-id="[[item.digest]]">
              <paper-icon-button class="fg blue controls-running" disabled
                                 on-tap="_modifyImage" icon="icons:settings"></paper-icon-button>
            </div>
          </template>
        </vaadin-grid-column>
      </vaadin-grid>
    `;
  }

  firstUpdated() {
    if (window.backendaiclient === undefined || window.backendaiclient === null) {
      document.addEventListener('backend-ai-connected', () => {
        this._getImages();
      }, true);
    } else { // already connected
      this._getImages();
    }
    this.indicator = this.shadowRoot.querySelector('#loading-indicator');
  }

  async _viewStateChanged(active) {
    await this.updateComplete;
    if (active === false) {

    }
  }
  _getImages() {
    this.indicator.show();
    window.backendaiclient.image.list().then((response) => {
      let images = response.images;
      images.forEach((image) => {
        let tags = image.tag.split('-');
        if (tags[1] !== undefined) {
          image.baseversion = tags[0];
          image.baseimage = tags[1];
          if (tags[2] !== undefined) {
            image.additional_req = tags[2].toUpperCase();
          }
        } else {
          image.baseversion = image.tag;
        }
        let names = image.name.split('/');
        if (names[1] !== undefined) {
          image.namespace = names[0];
          image.lang = names[1];
        } else {
          image.lang = image.names;
        }
        let langs = image.lang.split('-');
        let baseimage = [this._humanizeName(image.baseimage)];
        if (langs[1] !== undefined) {
          image.lang = langs[1];
          baseimage.push(this._humanizeName(langs[0]));
          //image.baseimage = this._humanizeName(image.baseimage) + ', ' + this._humanizeName(langs[0]);
        }
        image.baseimage = baseimage;//this._humanizeName(image.baseimage);
        image.lang = this._humanizeName(image.lang);

        var resource_limit = image.resource_limits;
        resource_limit.forEach((resource) => {
          if (resource.max == 0) {
            resource.max = '∞';
          }
          if (resource.key == 'cuda.device') {
            resource.key = 'cuda_device';
          }
          if (resource.key == 'cuda.shares') {
            resource.key = 'cuda_shares';
          }
          image[resource.key + '_limit_min'] = this._addUnit(resource.min);
          image[resource.key + '_limit_max'] = this._addUnit(resource.max);
        });
      });
      let image_keys = Object.keys(images);
      //console.log(image_keys);
      //let sorted_images = {};
      //image_keys.sort();
      this.images = images;
      this.indicator.hide();

    });
  }

  _addUnit(value) {
    let unit = value.substr(-1);
    if (unit == 'm') {
      return value.slice(0, -1) + 'MB';
    }
    if (unit == 'g') {
      return value.slice(0, -1) + 'GB';
    }
    if (unit == 't') {
      return value.slice(0, -1) + 'TB';
    }
    return value;
  }

  _humanizeName(value) {
    this.alias = {
      'python': 'Python',
      'tensorflow': 'TensorFlow',
      'pytorch': 'PyTorch',
      'lua': 'Lua',
      'r': 'R',
      'r-base': 'R',
      'julia': 'Julia',
      'rust': 'Rust',
      'cpp': 'C++',
      'gcc': 'GCC',
      'go': 'Go',
      'tester': 'Tester',
      'haskell': 'Haskell',
      'java': 'Java',
      'php': 'PHP',
      'octave': 'Octave',
      'nodejs': 'Node.js',
      'caffe': 'Caffe',
      'scheme': 'Scheme',
      'scala': 'Scala',
      'base': 'Base',
      'cntk': 'CNTK',
      'digits': 'DIGITS',
      'py3': 'Python 3',
      'py2': 'Python 2',
      'py27': 'Python 2.7',
      'py35': 'Python 3.5',
      'py36': 'Python 3.6',
      'py37': 'Python 3.7',
      'ubuntu16.04': 'Ubuntu 16.04',
      'ubuntu18.04': 'Ubuntu 18.04',
      'anaconda2018.12': 'Anaconda 2018.12',
      'alpine3.8': 'Alpine Lunux 3.8',
      'ngc': 'NVidia GPU Cloud',
      'ff': 'Research Env.',
    };
    if (value in this.alias) {
      return this.alias[value];
    } else {
      return value;
    }
  }

  _indexFrom1(index) {
    return index + 1;
  }
}

customElements.define(BackendAiEnvironmentList.is, BackendAiEnvironmentList);
