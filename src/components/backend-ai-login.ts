/**
 @license
 Copyright (c) 2015-2020 Lablup Inc. All rights reserved.
 */

import {get as _text, translate as _t} from "lit-translate";
import {css, customElement, html, property} from "lit-element";

import 'weightless/button';
import 'weightless/icon';
import 'weightless/dialog';
import 'weightless/card';

import '@material/mwc-icon';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-icon-button';
import '@material/mwc-menu';
import '@material/mwc-select';
import '@material/mwc-textfield';

import '../plastics/lablup-shields/lablup-shields';

import './backend-ai-signup';
import {default as PainKiller} from './backend-ai-painkiller';

import * as aiSDK from '../lib/backend.ai-client-es6';
import {
  IronFlex,
  IronFlexAlignment,
  IronFlexFactors,
  IronPositioning
} from "../plastics/layout/iron-flex-layout-classes";
import {BackendAiStyles} from "./backend-ai-general-styles";
import {BackendAIPage} from "./backend-ai-page";

declare global {
  const ai: typeof aiSDK;
}


/**
 Backend.AI Login for GUI Console

 `backend-ai-login` is a login UI / Model to provide both API and session-based login.

 Example:

 <backend-ai-login>
 ... content ...
 </backend-ai-login>

 @group Backend.AI Console
 */
@customElement("backend-ai-login")
export default class BackendAILogin extends BackendAIPage {
  @property({type: String}) api_key = '';
  @property({type: String}) secret_key = '';
  @property({type: String}) user_id = '';
  @property({type: String}) password = '';
  @property({type: String}) proxy_url = 'http://127.0.0.1:5050/';
  @property({type: String}) api_endpoint = '';
  @property({type: String}) domain_name = '';
  @property({type: String}) default_session_environment = '';
  @property({type: String}) blockType = '';
  @property({type: String}) blockMessage = '';
  @property({type: String}) connection_mode = 'SESSION';
  @property({type: String}) user;
  @property({type: String}) email;
  @property({type: Object}) config = Object();
  @property({type: Object}) loginPanel;
  @property({type: Object}) signoutPanel;
  @property({type: Object}) blockPanel;
  @property({type: Boolean}) is_connected = false;
  @property({type: Object}) clientConfig;
  @property({type: Object}) client;
  @property({type: Object}) notification;
  @property({type: Object}) user_groups;
  @property({type: Boolean}) signup_support = false;
  @property({type: Boolean}) change_signin_support = false;
  @property({type: Boolean}) allow_signout = false;
  @property({type: Boolean}) allow_project_resource_monitor = false;
  @property({type: Array}) endpoints;

  constructor() {
    super();
    globalThis.backendaiconsole = {};
    this.endpoints = [];
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
        .warning {
          color: red;
        }

        fieldset input {
          width: 100%;
          border: 0;
          margin: 15px 0 0 0;
          font: inherit;
          font-size: 16px;
          outline: none;
        }

        mwc-textfield {
          font-family: 'Quicksand', sans-serif;
          --mdc-theme-primary: black;
          --mdc-text-field-fill-color: rgb(250, 250, 250);
          width: 100%;
        }

        .endpoint-text {
          --mdc-text-field-disabled-line-color: rgba(0, 0, 0, 0.0);
        }

        mwc-icon-button {
          /*color: rgba(0, 0, 0, 0.54); Matched color with above icons*/
          color: var(--paper-blue-600);
          --mdc-icon-size: 24px;
        }

        mwc-icon-button.endpoint-control-button {
          --mdc-icon-size: 16px;
          --mdc-icon-button-size: 24px;
          color: red;
        }

        mwc-menu {
          font-family: 'Quicksand', sans-serif;
          --mdc-menu-min-width: 400px;
          --mdc-menu-max-width: 400px;
        }

        mwc-list-item[disabled] {
          --mdc-menu-item-height: 30px;
          border-bottom: 1px solid #ccc;
        }

        #login-panel {
          --dialog-width: 400px;
          --backdrop-bg: transparent;
          --dialog-elevation: 0px 0px 5px 5px rgba(0, 0, 0, 0.1);
        }

        h3 small {
          --button-font-size: 12px;
        }

        wl-button {
          --button-bg: transparent;
        }

        wl-button.red {
          --button-bg: var(--paper-red-50);
          --button-bg-hover: var(--paper-red-100);
          --button-bg-active: var(--paper-red-600);
          color: var(--paper-red-900);
        }

        wl-button.mini {
          font-size: 12px;
        }

        wl-button.full {
          width: 335px;
        }

        wl-button.login-button,
        wl-button.login-cancel-button {
          --button-bg-hover: var(--paper-red-100);
          --button-bg-active: var(--paper-red-600);
        }

        wl-button.signup-button {
          --button-bg-hover: var(--paper-green-100);
          --button-bg-active: var(--paper-green-600);
        }

        wl-button.change-login-mode-button {
          --button-bg-hover: var(--paper-blue-100);
          --button-bg-active: var(--paper-blue-600);
        }

        wl-button > wl-icon {
          --icon-size: 24px;
          padding: 0;
        }

        wl-icon {
          --icon-size: 16px;
          padding: 0;
        }
      `];
  }

  firstUpdated() {
    this.loginPanel = this.shadowRoot.querySelector('#login-panel');
    this.signoutPanel = this.shadowRoot.querySelector('#signout-panel');
    this.blockPanel = this.shadowRoot.querySelector('#block-panel');
    this.notification = globalThis.lablupNotification;
    this.endpoints = globalThis.backendaioptions.get("endpoints", []);
  }

  _changeSigninMode() {
    if (this.change_signin_support === true) {
      if (this.connection_mode == 'SESSION') {
        this.connection_mode = 'API';
        localStorage.setItem('backendaiconsole.connection_mode', 'API');
      } else {
        this.connection_mode = 'SESSION';
        localStorage.setItem('backendaiconsole.connection_mode', 'SESSION');
      }
      this.requestUpdate();
    }
  }

  refreshWithConfig(config) {
    if (typeof config.plugin === "undefined" || typeof config.plugin.login === "undefined" || config.plugin.login === '') {
    } else {
      import('../plugins/' + config.plugin.login).then(() => {
        console.log("Plugin loaded.");
      }).catch((err) => {   // Connection failed
        if (this.loginPanel.open !== true) {
          if (typeof err.message !== "undefined") {
            this.notification.text = PainKiller.relieve(err.title);
            this.notification.detail = err.message;
          } else {
            this.notification.text = PainKiller.relieve('Plugin loading failed.');
          }
          this.notification.show(false, err);
          this.open();
        } else {
          this.notification.text = PainKiller.relieve('Login failed. Check login information.');
          this.notification.show(false, err);
        }
      });
    }
    if (typeof config.general === "undefined" || typeof config.general.debug === "undefined" || config.general.debug === '') {
      globalThis.backendaiconsole.debug = false;
    } else if (config.general.debug === true) {
      globalThis.backendaiconsole.debug = true;
      console.log('Debug flag is set to true');
    }
    if (typeof config.general === "undefined" || typeof config.general.signupSupport === "undefined" || config.general.signupSupport === '' || config.general.signupSupport == false) {
      this.signup_support = false;
    } else {
      this.signup_support = true;
      (this.shadowRoot.querySelector('#signup-dialog') as any).active = true;
    }
    if (typeof config.general === "undefined" || typeof config.general.allowChangeSigninMode === "undefined" || config.general.allowChangeSigninMode === '' || config.general.allowChangeSigninMode == false) {
      this.change_signin_support = false;
    } else {
      this.change_signin_support = true;
    }
    if (typeof config.general === "undefined" || typeof config.general.allowProjectResourceMonitor === "undefined" || config.general.allowProjectResourceMonitor === '' || config.general.allowProjectResourceMonitor == false) {
      this.allow_project_resource_monitor = false;
    } else {
      this.allow_project_resource_monitor = true;
    }

    if (typeof config.general === "undefined" || typeof config.general.allowSignout === "undefined" || config.general.allowSignout === '' || config.general.allowSignout == false) {
      this.allow_signout = false;
    } else {
      this.allow_signout = true;
    }
    if (typeof config.wsproxy === "undefined" || typeof config.wsproxy.proxyURL === "undefined" || config.wsproxy.proxyURL === '') {
      this.proxy_url = 'http://127.0.0.1:5050/';
    } else {
      this.proxy_url = config.wsproxy.proxyURL;
    }
    if (typeof config.general === "undefined" || typeof config.general.apiEndpoint === "undefined" || config.general.apiEndpoint === '') {
      (this.shadowRoot.querySelector('#id_api_endpoint_container') as any).style.display = 'flex';
      (this.shadowRoot.querySelector('#id_api_endpoint_humanized') as any).style.display = 'none';
    } else {
      this.api_endpoint = config.general.apiEndpoint;
      if (typeof config.general === "undefined" || typeof config.general.apiEndpointText === "undefined" || config.general.apiEndpointText === '') {
        (this.shadowRoot.querySelector('#id_api_endpoint_container') as any).style.display = 'flex';
        (this.shadowRoot.querySelector('#id_api_endpoint_humanized') as any).style.display = 'none';
        (this.shadowRoot.querySelector('#endpoint-button') as any).disabled = 'true';
      } else {
        (this.shadowRoot.querySelector('#id_api_endpoint_container') as any).style.display = 'none';
        (this.shadowRoot.querySelector('#id_api_endpoint_humanized') as any).style.display = 'block';
        (this.shadowRoot.querySelector('#id_api_endpoint_humanized') as any).value = config.general.apiEndpointText;
      }
      (this.shadowRoot.querySelector('#id_api_endpoint') as any).disabled = true;
      (this.shadowRoot.querySelector('#id_api_endpoint_humanized') as any).disabled = true;
    }

    if (typeof config.general === "undefined" || typeof config.general.defaultSessionEnvironment === "undefined" || config.general.defaultSessionEnvironment === '') {
      this.default_session_environment = '';
    } else {
      this.default_session_environment = config.general.defaultSessionEnvironment;
    }
    let connection_mode: string | null = localStorage.getItem('backendaiconsole.connection_mode');
    if (globalThis.isElectron && connection_mode !== null && connection_mode != '' && connection_mode != '""') {
      if (connection_mode === 'SESSION') {
        this.connection_mode = 'SESSION';
      } else {
        this.connection_mode = 'API';
      }
    } else {
      if (typeof config.general === "undefined" || typeof config.general.connectionMode === "undefined" || config.general.connectionMode === '') {
        this.connection_mode = 'SESSION';
        //localStorage.setItem('backendaiconsole.connection_mode', 'API');
      } else {
        if (config.general.connectionMode.toUpperCase() === 'SESSION') {
          this.connection_mode = 'SESSION';
        } else {
          this.connection_mode = 'API';
        }
      }
    }
  }

  open() {
    if (this.loginPanel.open !== true) {
      this.loginPanel.show();
    }
    if (this.blockPanel.open === true) {
      this.blockPanel.hide();
    }
  }

  close() {
    if (this.loginPanel.open === true) {
      this.loginPanel.hide();
    }
    if (this.blockPanel.open === true) {
      this.blockPanel.hide();
    }
  }

  block(message = '', type = '') {
    this.blockMessage = message;
    this.blockType = type;
    setTimeout(() => {
      if (this.blockPanel.open === false && this.is_connected === false) {
        this.blockPanel.show();
      }
    }, 2000);
  }

  free() {
    this.blockPanel.hide();
  }

  _trimChar(str, char) {
    return str.replace(/^\|+|\|+$/g, '');
  }

  login() {
    let api_key: any = localStorage.getItem('backendaiconsole.login.api_key');
    let secret_key: any = localStorage.getItem('backendaiconsole.login.secret_key');
    let user_id: any = localStorage.getItem('backendaiconsole.login.user_id');
    let password: any = localStorage.getItem('backendaiconsole.login.password');
    if (api_key != null) {
      this.api_key = api_key.replace(/^\"+|\"+$/g, '');
    } else {
      this.api_key = '';
    }
    if (secret_key != null) {
      this.secret_key = secret_key.replace(/^\"+|\"+$/g, '');
    } else {
      this.secret_key = '';
    }
    if (user_id != null) {
      this.user_id = user_id.replace(/^\"+|\"+$/g, '');
    } else {
      this.user_id = '';
    }
    if (password != null) {
      this.password = password.replace(/^\"+|\"+$/g, '');
    } else {
      this.password = '';
    }
    if (this.api_endpoint === '') {
      let api_endpoint: any = localStorage.getItem('backendaiconsole.api_endpoint');
      if (api_endpoint != null) {
        this.api_endpoint = api_endpoint.replace(/^\"+|\"+$/g, '');
      }
    }
    this.api_endpoint = this.api_endpoint.trim();
    if (this.connection_mode === 'SESSION' && this._validate_data(this.user_id) && this._validate_data(this.password) && this._validate_data(this.api_endpoint)) {
      this.block(_text('login.PleaseWait'), _text('login.ConnectingToCluster'));
      this._connectUsingSession();
    } else if (this.connection_mode === 'API' && this._validate_data(this.api_key) && this._validate_data(this.secret_key) && this._validate_data(this.api_endpoint)) {
      this.block(_text('login.PleaseWait'), _text('login.ConnectingToCluster'));
      this._connectUsingAPI();
    } else {
      this.open();
    }
  }

  signout() {
    this.signoutPanel.show();
  }

  _showSignupDialog() {
    this.api_endpoint = this.api_endpoint.trim();
    if (this.api_endpoint === '') {
      this.notification.text = 'API Endpoint is empty. Please specify Backend.AI API endpoint to signup.';
      this.notification.show();
      return;
    }
    (this.shadowRoot.querySelector('#signup-dialog') as any).endpoint = this.api_endpoint;
    //this.shadowRoot.querySelector('#signup-dialog').receiveAgreement();
    (this.shadowRoot.querySelector('#signup-dialog') as any).open();
  }

  _hideDialog(e) {
    let hideButton = e.target;
    let dialog = hideButton.closest('wl-dialog');
    dialog.hide();
  }

  _cancelLogin(e) {
    this._hideDialog(e);
    this.open();
  }

  _validate_data(value) {
    if (value != undefined && value != null && value != '') {
      return true;
    }
    return false;
  }

  _submitIfEnter(e) {
    if (e.keyCode == 13) this._login();
  }

  _signoutIfEnter(e) {
    if (e.keyCode == 13) this._signout();
  }

  _signout() {
    let user_id = (this.shadowRoot.querySelector('#id_signout_user_id') as any).value;
    let password = (this.shadowRoot.querySelector('#id_signout_password') as any).value;
    this.client.signout(user_id, password).then(response => {
      this.notification.text = _text("login.SignoutFinished");
      this.notification.show();
      let event = new CustomEvent("backend-ai-logout", {"detail": ""});
      document.dispatchEvent(event);
    }).catch((err) => {   // Signout failed
      this.free();
      if (this.signoutPanel.open !== true) {
        console.log(err);
        if (typeof err.message !== 'undefined') {
          this.notification.text = PainKiller.relieve(err.title);
          this.notification.detail = err.message;
        } else {
          this.notification.text = PainKiller.relieve('Login information mismatch. Check your information and try again.');
        }
        this.notification.show();
      } else {
        this.notification.text = PainKiller.relieve('Signout failed. Check ID/password information.');
        this.notification.show();
      }
    });
  }

  _login() {
    this.api_endpoint = (this.shadowRoot.querySelector('#id_api_endpoint') as any).value;
    this.api_endpoint = this.api_endpoint.replace(/\/+$/, "");
    if (this.api_endpoint === '') {
      this.notification.text = _text('login.APIEndpointEmpty');
      this.notification.show();
      return;
    }
    //this.notification.text = 'Connecting...';
    //this.notification.show();
    if (this.connection_mode === 'SESSION') {
      this.user_id = (this.shadowRoot.querySelector('#id_user_id') as any).value;
      this.password = (this.shadowRoot.querySelector('#id_password') as any).value;
      this._connectUsingSession();
    } else {
      this.api_key = (this.shadowRoot.querySelector('#id_api_key') as any).value;
      this.secret_key = (this.shadowRoot.querySelector('#id_secret_key') as any).value;
      this._connectUsingAPI();
    }
  }

  async _connectUsingSession() {
    this.clientConfig = new ai.backend.ClientConfig(
      this.user_id,
      this.password,
      this.api_endpoint,
      'SESSION'
    );
    this.client = new ai.backend.Client(
      this.clientConfig,
      `Backend.AI Console.`,
    );
    let isLogon = await this.client.check_login();
    if (isLogon === false) { // Not authenticated yet.
      this.client.login().then(response => {
        if (response === false) {
          this.notification.text = PainKiller.relieve('Login information mismatch. Please check your login information.');
          this.notification.show();
        } else {
          this.is_connected = true;
          return this._connectGQL();
        }
      }).catch((err) => {   // Connection failed
        this.free();
        if (this.loginPanel.open !== true) {
          if (typeof err.message !== "undefined") {
            this.notification.text = PainKiller.relieve(err.title);
            this.notification.detail = err.message;
          } else {
            this.notification.text = PainKiller.relieve('Login information mismatch. If the information is correct, logout and login again.');
          }
        } else {
          if (typeof err.message !== "undefined") {
            this.notification.text = PainKiller.relieve(err.title);
            this.notification.detail = err.message;
          } else {
            this.notification.text = PainKiller.relieve('Login failed. Check login information.');
          }
          console.log(err);
        }
        this.notification.show();
        this.open();
      });
    } else { // Login already succeeded.
      this.is_connected = true;
      return this._connectGQL();
    }
  }

  _connectUsingAPI() {
    this.clientConfig = new ai.backend.ClientConfig(
      this.api_key,
      this.secret_key,
      this.api_endpoint
    );
    this.client = new ai.backend.Client(
      this.clientConfig,
      `Backend.AI Console.`,
    );
    this.client.ready = false;
    this._connectGQL();
  }

  _connectGQL() {
    // Test connection
    if (this.loginPanel.open !== true) {
      this.block();
    }
    this.client.getManagerVersion().then(response => {
      this._connectViaGQL();
    }).catch((err) => {   // Connection failed
      if (this.loginPanel.open !== true) {
        if (typeof err.message !== "undefined") {
          if (err.status === 408) { // Failed while loading getManagerVersion
            this.notification.text = "Login succeed but manager is not responding.";
            this.notification.detail = err.message;
          } else {
            this.notification.text = PainKiller.relieve(err.title);
            this.notification.detail = err.message;
          }
        } else {
          this.notification.text = PainKiller.relieve('Login information mismatch. If the information is correct, logout and login again.');
        }
        this.notification.show(false, err);
        this.open();
      } else {
        this.notification.text = PainKiller.relieve('Login failed. Check login information.');
        this.notification.show();
      }
      this.free();
      this.open();
    });
  }

  _connectViaGQL() {
    let fields = ["user_id", "resource_policy", "user"];
    let q = `query { keypair { ${fields.join(" ")} } }`;
    let v = {};
    return this.client.gql(q, v).then(response => {
      this.is_connected = true;
      globalThis.backendaiclient = this.client;
      let resource_policy = response['keypair'].resource_policy;
      globalThis.backendaiclient.resource_policy = resource_policy;
      this.user = response['keypair'].user;
      let fields = ["username", "email", "full_name", "is_active", "role", "domain_name", "groups {name, id}"];
      let q = `query { user{ ${fields.join(" ")} } }`;
      let v = {'uuid': this.user};
      return globalThis.backendaiclient.gql(q, v);
    }).then(response => {
      let email = response['user'].email;
      if (this.email !== email) {
        this.email = email;
      }
      this.user_groups = response['user'].groups;
      let role = response['user'].role;
      this.domain_name = response['user'].domain_name;
      globalThis.backendaiclient.email = this.email;
      globalThis.backendaiclient.full_name = response['user'].full_name;
      globalThis.backendaiclient.is_admin = false;
      globalThis.backendaiclient.is_superadmin = false;

      if (["superadmin", "admin"].includes(role)) {
        globalThis.backendaiclient.is_admin = true;
      }
      if (["superadmin"].includes((role))) {
        globalThis.backendaiclient.is_superadmin = true;
      }
      return globalThis.backendaiclient.group.list(true, false, ['id', 'name', 'description', 'is_active']);
    }).then(response => {
      let groups = response.groups;
      let user_group_ids = this.user_groups.map(({id}) => id);
      if (groups !== null) {
        globalThis.backendaiclient.groups = groups.filter((item) => {
          if (user_group_ids.includes(item.id)) {
            return item;
          }
        }).map((item) => {
          return item.name;
        });
        let groupMap = Object();
        groups.forEach(function (element) {
          groupMap[element.name] = element.id;
        });
        globalThis.backendaiclient.groupIds = groupMap;
      } else {
        globalThis.backendaiclient.groups = ['default'];
      }
      globalThis.backendaiclient.current_group = globalThis.backendaiclient.groups[0];
      globalThis.backendaiclient.current_group_id = () => {
        return globalThis.backendaiclient.groupIds[globalThis.backendaiclient.current_group];
      };
      globalThis.backendaiclient._config._proxyURL = this.proxy_url;
      globalThis.backendaiclient._config.domainName = this.domain_name;
      globalThis.backendaiclient._config.default_session_environment = this.default_session_environment;
      globalThis.backendaiclient._config.allow_project_resource_monitor = this.allow_project_resource_monitor;
      globalThis.backendaiclient.ready = true;
      if (this.endpoints.indexOf(globalThis.backendaiclient._config.endpoint as any) === -1) {
        this.endpoints.push(globalThis.backendaiclient._config.endpoint as any);
        if (this.endpoints.length > 5) { // Keep latest
          this.endpoints = this.endpoints.slice(1, 6);
        }
        globalThis.backendaioptions.set("endpoints", this.endpoints);
      }
      let event = new CustomEvent("backend-ai-connected", {"detail": this.client});
      document.dispatchEvent(event);
      this.close();
      this._saveLoginInfo();
      localStorage.setItem('backendaiconsole.api_endpoint', this.api_endpoint);
      //this.notification.text = 'Connected.';
      //this.notification.show();
    }).catch((err) => {   // Connection failed
      if (this.loginPanel.open !== true) {
        if (typeof err.message !== 'undefined') {
          if (typeof err.title !== 'undefined') {
            this.notification.text = PainKiller.relieve(err.title);
            this.notification.detail = err.message;
          } else {
            this.notification.text = PainKiller.relieve(err);
            this.notification.detail = err;
          }
        } else {
          this.notification.text = PainKiller.relieve('Login information mismatch. If the information is correct, logout and login again.');
        }
        this.notification.show(false, err);
        this.open();
      } else {
        this.notification.text = PainKiller.relieve('Login failed. Check login information.');
        this.notification.show(true);
      }
    });
  }

  async _saveLoginInfo() {
    localStorage.setItem('backendaiconsole.login.api_key', this.api_key);
    localStorage.setItem('backendaiconsole.login.secret_key', this.secret_key);
    localStorage.setItem('backendaiconsole.login.user_id', this.user_id);
    localStorage.setItem('backendaiconsole.login.password', this.password);
  }

  _toggleEndpoint() {
    let endpoint_list = this.shadowRoot.querySelector("#endpoint-list");
    let endpoint_button = this.shadowRoot.querySelector('#endpoint-button');
    endpoint_list.anchor = endpoint_button;
    endpoint_list.open = !endpoint_list.open;
  }

  _updateEndpoint() {
    let endpoint_list = this.shadowRoot.querySelector("#endpoint-list");
    this.api_endpoint = endpoint_list.selected.value;
  }

  _deleteEndpoint(endpoint) {
    let idx = this.endpoints.indexOf(endpoint);
    if (idx > -1) {
      this.endpoints.splice(idx, 1);
    }
    globalThis.backendaioptions.set("endpoints", this.endpoints);
    this.requestUpdate();
  }

  render() {
    // language=HTML
    return html`
      <wl-dialog id="login-panel" fixed blockscrolling persistent disablefocustrap>
        <div class="horizontal center layout">
          <img src="manifest/backend.ai-text.svg" style="height:35px;padding:15px 0 15px 20px;" />
          <div class="flex"></div>
          ${this.signup_support ? html`
          <div class="vertical center-justified layout" style="padding-right:20px;">
            <div style="font-size:12px;margin:0 10px;text-align:center;">${_t("login.NotAUser")}</div>
            <wl-button style="width:80px;font-weight:500;" class="signup-button fg green mini signup" outlined type="button" @click="${() => this._showSignupDialog()}">${_t("login.SignUp")}</wl-button>
          </div>
          ` : html``}
        </div>
        <wl-card elevation="1" class="login-panel intro centered" style="margin: 0;">
          <h3 class="horizontal center layout">
            <div>${this.connection_mode == 'SESSION' ? _t("login.LoginWithE-mail") : _t("login.LoginWithIAM")}</div>
            <div class="flex"></div>
            ${this.change_signin_support ? html`
                <div class="vertical center-justified layout">
                  <div style="font-size:12px;margin:0 10px;text-align:center;">${_t("login.LoginAnotherway")}</div>
                  <wl-button class="change-login-mode-button fg blue mini" outlined type="button" @click="${() => this._changeSigninMode()}">
                    ${this.connection_mode == 'SESSION' ? _t("login.ClickToUseIAM") : _t("login.ClickToUseID")}
                  </wl-button>
                </div>
            ` : html``}
          </h3>
          <form id="session-login-form" style="${this.connection_mode == 'SESSION' ? `display:block;` : `display:none;`}">
            <fieldset>
              <mwc-textfield type="email" name="user_id" id="id_user_id" maxlength="50"  autocomplete="username"
                           label="${_t("login.E-mail")}" icon="email" value="${this.user_id}" @keyup="${this._submitIfEnter}"></mwc-textfield>
              <mwc-textfield type="password" name="password" id="id_password" autocomplete="current-password"
                           label="${_t("login.Password")}" icon="vpn_key" value="${this.password}" @keyup="${this._submitIfEnter}"></mwc-textfield>
            </fieldset>
          </form>
          <form id="api-login-form" style="${this.connection_mode == 'SESSION' ? `display:none;` : `display:block;`}">
            <fieldset>
              <mwc-textfield type="text" name="api_key" id="id_api_key" maxlength="30"
                           label="${_t("login.APIKey")}" icon="lock" value="${this.api_key}" @keyup="${this._submitIfEnter}"></mwc-textfield>
              <mwc-textfield type="password" name="secret_key" id="id_secret_key"
                           label="${_t("login.SecretKey")}" icon="vpn_key" value="${this.secret_key}" @keyup="${this._submitIfEnter}"></mwc-textfield>
            </fieldset>
          </form>
          <form>
            <fieldset>
              <div class="horizontal layout" id="id_api_endpoint_container" style="display:none;">
                <mwc-icon-button id="endpoint-button" icon="cloud_queue" style="margin-left:5px;" @click="${() => this._toggleEndpoint()}"></mwc-icon-button>
                <mwc-menu id="endpoint-list" @selected="${() => this._updateEndpoint()}">
                  <mwc-list-item disabled>${_t("login.EndpointHistory")}</mwc-list-item>
                  ${this.endpoints.length === 0 ? html`
                  <mwc-list-item value="">${_t("login.NoEndpointSaved")}</mwc-list-item>
                  ` : html``}

                  ${this.endpoints.map(item =>
      html`<mwc-list-item value="${item}">
                    <div class="horizontal justified center flex layout" style="width:365px;">
                      <span>${item}</span><span class="flex"></span>
                      <mwc-icon-button icon="delete" @click="${() => this._deleteEndpoint(item)}" class="endpoint-control-button"></mwc-icon-button>
                    </div>
                  </mwc-list-item>`)}
                </mwc-menu>
                <mwc-textfield class="endpoint-text" type="text" name="api_endpoint" id="id_api_endpoint"
                             label="${_t("login.Endpoint")}" value="${this.api_endpoint}" @keyup="${this._submitIfEnter}"></mwc-textfield>
              </div>
              <mwc-textfield class="endpoint-text" type="text" name="api_endpoint_humanized" id="id_api_endpoint_humanized"
                           style="display:none;"
                           label="${_t("login.Endpoint")}" icon="cloud" value=""></mwc-textfield>
              <wl-button class="fg red full login-button" id="login-button" outlined type="button"
                          @click="${() => this._login()}">
                          <wl-icon>check</wl-icon>
                          ${_t("login.Login")}</wl-button>
            </fieldset>
          </form>
        </wl-card>
      </wl-dialog>
      <wl-dialog id="signout-panel" fixed backdrop blockscrolling persistent disablefocustrap>
        <wl-card elevation="1" class="login-panel intro centered" style="margin: 0;">
          <h3 class="horizontal center layout">
            <div>${_t("login.LeaveService")}</div>
            <div class="flex"></div>
            <wl-button class="red" fab flat inverted @click="${(e) => this._hideDialog(e)}">
              <wl-icon>close</wl-icon>
            </wl-button>
          </h3>
          <section>
            <div class="warning">${_t("login.DescConfirmLeave")}</div>
          </section>
          <form id="signout-form">
            <fieldset>
              <mwc-textfield type="email" name="signout_user_id" id="id_signout_user_id" maxlength="30"
                           label="E-mail" value="" @keyup="${this._signoutIfEnter}"></mwc-textfield>
              <mwc-textfield type="password" name="signout_password" id="id_signout_password"
                           label="Password" value="" @keyup="${this._signoutIfEnter}"></mwc-textfield>
              <br/><br/>
              <wl-button class="fg red full login-button" id="signout-button" outlined type="button"
                          @click="${() => this._signout()}">
                          <wl-icon>check</wl-icon>
                          ${_t("login.LeaveService")}</wl-button>
            </fieldset>
          </form>
        </wl-card>
      </wl-dialog>
      <wl-dialog id="block-panel" fixed blockscrolling persistent>
        ${this.blockMessage != '' ? html`
        <wl-card>
          ${this.blockType !== '' ? html`
          <h3 class="horizontal center layout" style="font-weight:bold">
            <span id="work-title">${this.blockType}</span>
            <div class="flex"></div>
          </h3>
          ` : html``}
          <div style="text-align:center;padding-top:15px;">
          ${this.blockMessage}
          </div>
          <div style="text-align:right;padding-top:15px;">
            <wl-button outlined class="fg red mini login-cancel-button" type="button" @click="${(e) => this._cancelLogin(e)}">${_t("login.CancelLogin")}</wl-button>
          </div>
        </wl-card>
        ` : html``}
      </wl-dialog>
      <backend-ai-signup id="signup-dialog"></backend-ai-signup>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "backend-ai-login": BackendAILogin;
  }
}
