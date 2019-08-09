/**
 @license
 Copyright (c) 2015-2019 Lablup Inc. All rights reserved.
 */

import {css, html, LitElement} from "lit-element";
import {setPassiveTouchGestures} from '@polymer/polymer/lib/utils/settings';
// PWA components
import {connect} from 'pwa-helpers/connect-mixin';
import {installOfflineWatcher} from 'pwa-helpers/network';
import {installRouter} from 'pwa-helpers/router';
import {store} from '../store';

import {navigate, updateOffline} from '../backend-ai-app';

import '@polymer/polymer/lib/elements/dom-if';
import '@polymer/app-layout/app-layout';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-styles/typography';
import '@polymer/paper-styles/color';
import '../plastics/plastic-material/plastic-material';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-item';
import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-icons/hardware-icons';
import '@polymer/iron-image/iron-image';
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/iron-flex-layout/iron-flex-layout-classes';
import '@polymer/paper-toast/paper-toast';

import '@polymer/app-layout/app-scroll-effects/effects/waterfall';
import '@polymer/app-layout/app-scroll-effects/effects/blend-background';
import '@polymer/app-layout/app-scroll-effects/effects/resize-title';

import '@material/drawer';
import '@material/top-app-bar';

import '@polymer/iron-pages/iron-pages';
import '@polymer/app-route/app-location';
import '@polymer/app-route/app-route';
import '@vaadin/vaadin-icons/vaadin-icons';
import '../backend.ai-client-es6';
import {BackendAiStyles} from './backend-ai-console-styles';
import {IronFlex, IronFlexAlignment, IronFlexFactors, IronPositioning} from '../plastics/layout/iron-flex-layout-classes';
import '../backend-ai-offline-indicator';
import '../backend-ai-login';


/**
 Backend.AI GUI Console

 `backend-ai-console` is a shell of Backend.AI GUI console (web / app).

 Example:

 <backend-ai-console>
 ... content ...
 </backend-ai-console>

 @group Backend.AI Console
 */
class BackendAiConsole extends connect(store)(LitElement) {
	public menuTitle: any;
	public user_id: any;
	public api_endpoint: any;
	public is_connected: any;
	public is_admin: any;
	public _page: any;
	public shadowRoot: any;
	public config: any;
	public siteDescription: any;
	public proxy_url: any;
	public _offlineIndicatorOpened: any;
	public _offline: any;
	public _drawerOpened: any;

  static get is() {
    return 'backend-ai-console';
  }

  static get properties() {
    return {
      menuTitle: {
        type: String
      },
      siteDescription: {
        type: String
      },
      user_id: {
        type: String
      },
      api_endpoint: {
        type: String
      },
      is_connected: {
        type: Boolean
      },
      is_admin: {
        type: Boolean
      },
      proxy_url: {
        type: String
      },
      _page: {type: String},
      _drawerOpened: {type: Boolean},
      _offlineIndicatorOpened: {type: Boolean},
      _offline: {type: Boolean}
    }
  }

  constructor() {
    super();
    setPassiveTouchGestures(true);
    this.menuTitle = 'LOGIN REQUIRED';
    this.user_id = 'DISCONNECTED';
    this.api_endpoint = 'CLICK TO CONNECT';
    this.is_connected = false;
    this.is_admin = false;
    this._page = '';
  }

  firstUpdated() {
    console.log("Electron shell mode: ", window.isElectron);
    if (window.isElectron) {
      this.shadowRoot.querySelector('.portrait-canvas').style.visibility = 'hidden';
    }
    installRouter((location) => store.dispatch(navigate(decodeURIComponent(location.pathname))));
    installOfflineWatcher((offline) => store.dispatch(updateOffline(offline)));
    this._parseConfig('../../config.ini').then(() => {
      this.loadConfig(this.config);
    }).catch(err => {
      console.log("Configuration loading failed. Fallback to default.");
    });
    if (window.backendaiclient === undefined || window.backendaiclient === null || window.backendaiclient.ready === false) {
      this.shadowRoot.querySelector('#login-panel').login();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('backend-ai-connected', this.refreshPage.bind(this));
  }

  disconnectedCallback() {
    document.removeEventListener('backend-ai-connected', this.refreshPage.bind(this));
    super.disconnectedCallback();
  }

  attributeChangedCallback(name, oldval, newval) {
    super.attributeChangedCallback(name, oldval, newval);
  }

  loadConfig(config) {
    if ('siteDescription' in config) {
      this.siteDescription = config.siteDescription;
    }
    var loginPanel = this.shadowRoot.querySelector('#login-panel');
    loginPanel.refreshPanel(config);
  }

  refreshPage() {
    this.shadowRoot.getElementById('sign-button').icon = 'icons:exit-to-app';
    this.is_connected = true;
    window.backendaiclient.proxyURL = this.proxy_url;
    if (window.backendaiclient != undefined && window.backendaiclient != null && window.backendaiclient.is_admin != undefined && window.backendaiclient.is_admin == true) {
      this.is_admin = true;
    } else {
      this.is_admin = false;
    }
    this._refreshUserInfoPanel();
    //this._loadPageElement();
  }

  showUpdateNotifier() {
    let indicator = this.shadowRoot.getElementById('backend-ai-indicator');
    indicator.innerHTML = 'New console available. Please <a>reload</a> to update.';
    indicator.show();
  }

  _parseConfig(fileName) {
    return fetch(fileName)
      .then(res => {
        if (res.status == 200) {
          return res.text();
        }
      })
      .then(res => {
        var data = res;
        var regex = {
          section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
          param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
          comment: /^\s*;.*$/
        };
        var value = {};
        var lines = data.split(/[\r\n]+/);
        var section = null;
        lines.forEach(function (line) {
          if (regex.comment.test(line)) {

          } else if (regex.param.test(line)) {
            var match = line.match(regex.param);
            if (section) {
              value[section][match[1]] = match[2];
            } else {
              value[match[1]] = match[2];
            }
          } else if (regex.section.test(line)) {
            var match = line.match(regex.section);
            value[match[1]] = {};
            section = match[1];
          } else if (line.length == 0 && section) {
            section = null;
          }
        });
        this.config = value;
      })
  }

  _refreshUserInfoPanel() {
    this.user_id = window.backendaiclient.email;
    this.api_endpoint = window.backendaiclient._config.endpoint;
  }

  _loadPageElement() {
    if (this._page === 'index.html' || this._page === '') {
      this._page = 'summary';
      navigate(decodeURIComponent('/'));
    }
  }

  updated(changedProps) {
    if (changedProps.has('_page')) {
      let view = this._page;
      // load data for view
      if (['summary', 'job', 'agent', 'credential', 'data', 'environment', 'settings', 'maintenance'].includes(view) != true) { // Fallback for Windows OS
        view = view.split(/[\/]+/).pop();
        this._page = view;
      }
      switch (view) {
        case 'summary':
          this.menuTitle = 'Summary';
          this.shadowRoot.getElementById('sidebar-menu').selected = 0;
          this.updateTitleColor('var(--paper-green-800)', '#efefef');
          break;
        case 'job':
          this.menuTitle = 'Sessions';
          this.shadowRoot.getElementById('sidebar-menu').selected = 1;
          this.updateTitleColor('var(--paper-red-800)', '#efefef');
          break;
        case 'data':
          this.menuTitle = 'Data';
          this.shadowRoot.getElementById('sidebar-menu').selected = 3;
          this.updateTitleColor('var(--paper-orange-800)', '#efefef');
          break;
        case 'agent':
          this.menuTitle = 'Computation Resources';
          this.shadowRoot.getElementById('sidebar-menu').selected = 6;
          this.updateTitleColor('var(--paper-light-blue-800)', '#efefef');
          break;
        case 'credential':
          this.menuTitle = 'Credentials & Policies';
          this.shadowRoot.getElementById('sidebar-menu').selected = 7;
          this.updateTitleColor('var(--paper-lime-800)', '#efefef');
          break;
        case 'environment':
          this.menuTitle = 'Environments';
          this.shadowRoot.getElementById('sidebar-menu').selected = 8;
          this.updateTitleColor('var(--paper-yellow-800)', '#efefef');
          break;
        case 'settings':
          this.menuTitle = 'Settings';
          this.shadowRoot.getElementById('sidebar-menu').selected = 9;
          this.updateTitleColor('var(--paper-green-800)', '#efefef');
          break;
        case 'maintenance':
          this.menuTitle = 'Maintenance';
          this.shadowRoot.getElementById('sidebar-menu').selected = 10;
          this.updateTitleColor('var(--paper-pink-800)', '#efefef');
          break;
        default:
          this.menuTitle = 'LOGIN REQUIRED';
          this.shadowRoot.getElementById('sidebar-menu').selected = 0;
      }
    }
  }

  logout() {
    window.backendaiclient = null;
    const keys = Object.keys(localStorage);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (/^(backendaiconsole\.)/.test(key)) localStorage.removeItem(key);
    }
    location.reload();
  }

  updateTitleColor(backgroundColorVal, colorVal) {
    this.shadowRoot.querySelector('#main-toolbar').style.backgroundColor = backgroundColorVal;
    this.shadowRoot.querySelector('#main-toolbar').style.color = colorVal;
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
        paper-icon-button {
          --paper-icon-button-ink-color: white;
        }

        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }

        .page {
          display: none;
        }

        .page[active] {
          display: block;
        }

        .draggable {
          -webkit-user-select: none !important;
          -webkit-app-region: drag !important;
        }
      `];
  }

  render() {
    // language=HTML
    return html`
      <mwc-drawer id="app-body" hasHeader type="modal">
          <div class="drawer-content">
          <div id="portrait-bar" class="draggable">
            <div class="horizontal center layout flex bar draggable"
            onclick="location.reload();" style="cursor:pointer;">
             <div class="portrait-canvas">
               <iron-image width=43 height=43 style="width:43px; height:43px;" src="manifest/backend.ai-brand-white.svg"
                           sizing="contain"></iron-image>
             </div>
             <div class="vertical start-justified layout" style="margin-left:10px;margin-right:10px;">
               <div class="site-name"><span class="bold">Backend</span>.AI</div>
               ${this.siteDescription ?
      html`<div class="site-name" style="font-size:13px;text-align:right;">${this.siteDescription}</div>` :
      html``
      }
             </div>
             <span class="flex"></span>
             </div>
            </div>
            <paper-listbox id="sidebar-menu" class="sidebar list" selected="0">
            <a ?selected="${this._page === 'summary'}" href="/summary" tabindex="-1" role="menuitem">
              <paper-item link>
                <iron-icon id="activities-icon" class="fg green" icon="icons:view-quilt"></iron-icon>
                Summary
              </paper-item>
            </a>
            <a ?selected="${this._page === 'job'}" href="/job" tabindex="-1" role="menuitem">
              <paper-item link>
                <iron-icon class="fg red" icon="icons:subject"></iron-icon>
                Sessions
              </paper-item>
            </a>
            <paper-item disabled>
              <iron-icon icon="icons:pageview"></iron-icon>
              Experiments
            </paper-item>
            <a ?selected="${this._page === 'data'}" href="/data" tabindex="-1" role="menuitem">
              <paper-item link>
                <iron-icon class="fg orange" icon="vaadin:folder-open-o"></iron-icon>
                Data
              </paper-item>
            </a>
            <paper-item disabled>
              <iron-icon icon="icons:assessment"></iron-icon>
              Statistics
            </paper-item>
          ${this.is_admin ?
      html`
          <h4 style="font-size:10px;font-weight:100;border-top:1px solid #444;padding-top: 10px;padding-left:20px;">Administration</h4>

          <a ?selected="${this._page === 'agent'}" href="/agent" tabindex="-1" role="menuitem">
            <paper-item link ?disabled="${!this.is_admin}">
              <iron-icon class="fg blue" icon="hardware:device-hub"></iron-icon>
              Resources
            </paper-item>
          </a>` :
      html``}
          ${this.is_admin ?
      html`

            <a ?selected="${this._page === 'credential'}" href="/credential" tabindex="-1" role="menuitem">
              <paper-item link ?disabled="${!this.is_admin}">
                <iron-icon class="fg lime" icon="icons:fingerprint"></iron-icon>
                Credentials
              </paper-item>
            </a>` :
      html``}
          ${this.is_admin ?
      html`
            <a ?selected="${this._page === 'environment'}" href="/environment" tabindex="-1" role="menuitem">
              <paper-item link>
                <iron-icon class="fg orange" icon="icons:extension"></iron-icon>
                Environments
              </paper-item>
            </a>
            <a ?selected="${this._page === 'settings'}" href="/settings" tabindex="-1" role="menuitem">
              <paper-item link>
                <iron-icon class="fg green" icon="icons:settings"></iron-icon>
                Settings
                <span class="flex"></span>
              </paper-item>
            </a>
            <a ?selected="${this._page === 'maintenance'}" href="/maintenance" tabindex="-1" role="menuitem">
              <paper-item link>
                <iron-icon class="fg pink" icon="icons:build"></iron-icon>
                Maintenance
                <span class="flex"></span>
              </paper-item>
             </a>
` : html``}
            </paper-listbox>
            <footer>
              <div class="terms-of-use" style="margin-bottom:50px;">
                <small style="font-size:11px;">
                  <a href="https://cloud.backend.ai/@lablupinc/terms-of-service-payment">Terms of Service</a>
                  ·
                  <a href="https://cloud.backend.ai/@lablupinc/privacy-policy">Privacy Policy</a>
                </small>
              </div>
            </footer>
            <div id="sidebar-navbar-footer" class="vertical center center-justified layout">
              <address>
                <small class="sidebar-footer">Lablup Inc.</small>
                <small class="sidebar-footer" style="font-size:9px;">19.03.1.190506</small>
              </address>
            </div>
          </div>
          <div slot="appContent">
            <mwc-top-app-bar>
                    <paper-icon-button icon="menu" drawer-toggle></paper-icon-button>
                    <span condensed-title>${this.menuTitle}</span>
                    <span class="flex"></span>
                    <div style="vertical end-justified flex layout">
                      <div style="font-size: 10px;text-align:right">${this.user_id}</div>
                      <div style="font-size: 8px;text-align:right">${this.api_endpoint}</div>
                    </div>
                    <paper-icon-button id="sign-button" icon="icons:launch" @click="${this.logout}"></paper-icon-button>
             </mwc-top-app-bar>
             <div class="main-content">
                  <div id="navbar-top" class="navbar-top horizontal flex layout wrap"></div>
                <section role="main" id="content" class="container layout vertical center">
                  <div id="app-page">
                    <backend-ai-summary-view class="page" name="summary" ?active="${this._page === 'summary'}"></backend-ai-summary-view>
                    <backend-ai-session-view class="page" name="job" ?active="${this._page === 'job'}"></backend-ai-session-view>
                    <backend-ai-credential-view class="page" name="credential" ?active="${this._page === 'credential'}"></backend-ai-credential-view>
                    <backend-ai-agent-view class="page" name="agent" ?active="${this._page === 'agent'}"></backend-ai-agent-view>
                    <backend-ai-data-view class="page" name="data" ?active="${this._page === 'data'}"></backend-ai-data-view>
                    <backend-ai-environment-view class="page" name="environment" ?active="${this._page === 'environment'}"></backend-ai-environment-view>
                    <backend-ai-settings-view class="page" name="settings" ?active="${this._page === 'settings'}"></backend-ai-settings-view>
                    <backend-ai-maintenance-view class="page" name="maintenance" ?active="${this._page === 'maintenance'}"></backend-ai-maintenance-view>
                  </div>
                </section>
                <app-toolbar id="app-navbar-footer" style="height:45px;" class="bar layout flex horizontal">
                  <paper-icon-button icon="menu" drawer-toggle></paper-icon-button>
                  <paper-icon-button id="back-button" icon="icons:arrow-back"></paper-icon-button>
                  <div id="lablup-notification-navbar" style="color: #999999; font-size:10px;"></div>
                </app-toolbar>
             </div>
          </div>
      </mwc-drawer>
          <backend-ai-offline-indicator ?active="${this._offlineIndicatorOpened}">
            You are now ${this._offline ? 'offline' : 'online'}.
          </backend-ai-offline-indicator>
          <paper-toast id="backend-ai-indicator"></paper-toast>
          <backend-ai-login id="login-panel"></backend-ai-login>
    `;
  }

  stateChanged(state) {
    this._page = state.app.page;
    this._offline = state.app.offline;
    this._offlineIndicatorOpened = state.app.offlineIndicatorOpened;
    this._drawerOpened = state.app.drawerOpened;
  }
}

customElements.define(BackendAiConsole.is, BackendAiConsole);
