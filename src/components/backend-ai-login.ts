/**
 @license
 Copyright (c) 2015-2020 Lablup Inc. All rights reserved.
 */

import {css, customElement, html, LitElement, property} from "lit-element";

import 'weightless/button';
import 'weightless/icon';
import 'weightless/dialog';
import 'weightless/card';
import 'weightless/textfield';

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
import {BackendAiStyles} from "./backend-ai-console-styles";

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
export default class BackendAILogin extends LitElement {
  public shadowRoot: any; // ShadowRoot
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
  @property({type: String}) connection_mode = 'API';
;
  @property({type: String}) user;
  @property({type: String}) email;
  @property({type: Object}) config = Object();
  @property({type: Object}) loginPanel;
  @property({type: Object}) signoutPanel;
  @property({type: Object}) blockPanel;
  @property({type: Object}) clientConfig;
  @property({type: Object}) client;
  @property({type: Object}) notification;
  @property({type: Boolean}) signup_support = false;
  @property({type: Boolean}) change_signin_support = false;
  @property({type: Boolean}) allow_signout = false;
  @property({type: Boolean}) allow_project_resource_monitor = false;

  constructor() {
    super();
    window.backendaiconsole = {};
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

        wl-textfield {
          --input-font-family: 'Quicksand', sans-serif;
          --input-color-disabled: #424242;
        }

        #login-panel {
          --dialog-width: 400px;
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
    this.notification = window.lablupNotification;
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
      this.refreshPanel();
      this.requestUpdate();
    }
  }

  refreshPanel() {
    // TODO : use lit-element dynamic assignment
    if (this.connection_mode == 'SESSION') {
      (this.shadowRoot.querySelector('#id_api_key') as any).style.display = 'none';
      (this.shadowRoot.querySelector('#id_secret_key') as any).style.display = 'none';
      (this.shadowRoot.querySelector('#id_user_id') as any).style.display = 'block';
      (this.shadowRoot.querySelector('#id_password') as any).style.display = 'block';
    } else {
      (this.shadowRoot.querySelector('#id_api_key') as any).style.display = 'block';
      (this.shadowRoot.querySelector('#id_secret_key') as any).style.display = 'block';
      (this.shadowRoot.querySelector('#id_user_id') as any).style.display = 'none';
      (this.shadowRoot.querySelector('#id_password') as any).style.display = 'none';
    }
  }

  refreshWithConfig(config) {
    if (typeof config.plugin === "undefined" || typeof config.plugin.login === "undefined" || config.plugin.login === '') {
    } else {
      import('../plugins/' + config.plugin.login).then(() => {
        console.log("Plugin loaded.");
      }).catch((err) => {   // Connection failed
        if (this.loginPanel.open !== true) {
          if (err.message !== undefined) {
            this.notification.text = PainKiller.relieve(err.title);
            this.notification.detail = err.message;
          } else {
            this.notification.text = PainKiller.relieve('Plugin loading failed.');
          }
          this.notification.show(true);
          this.open();
        } else {
          this.notification.text = PainKiller.relieve('Login failed. Check login information.');
          this.notification.show(true);
        }
      });
    }
    if (typeof config.general === "undefined" || typeof config.general.debug === "undefined" || config.general.debug === '') {
      window.backendaiconsole.debug = false;
    } else if (config.general.debug === true) {
      window.backendaiconsole.debug = true;
      console.log('Debug flag is set to true');
    }
    if (typeof config.general === "undefined" || typeof config.general.signupSupport === "undefined" || config.general.signupSupport === '' || config.general.signupSupport == false) {
      this.signup_support = false;
    } else {
      this.signup_support = true;
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
      (this.shadowRoot.querySelector('#id_api_endpoint') as any).style.display = 'block';
      (this.shadowRoot.querySelector('#id_api_endpoint_humanized') as any).style.display = 'none';
    } else {
      this.api_endpoint = config.general.apiEndpoint;
      if (typeof config.general === "undefined" || typeof config.general.apiEndpointText === "undefined" || config.general.apiEndpointText === '') {
        (this.shadowRoot.querySelector('#id_api_endpoint') as any).style.display = 'block';
        (this.shadowRoot.querySelector('#id_api_endpoint_humanized') as any).style.display = 'none';
      } else {
        (this.shadowRoot.querySelector('#id_api_endpoint') as any).style.display = 'none';
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
    if (connection_mode !== null && connection_mode != '' && connection_mode != '""') {
      if (connection_mode === 'SESSION') {
        this.connection_mode = 'SESSION';
      } else {
        this.connection_mode = 'API';
      }
    } else {
      if (typeof config.general === "undefined" || typeof config.general.connectionMode === "undefined" || config.general.connectionMode === '') {
        this.connection_mode = 'API';
        //localStorage.setItem('backendaiconsole.connection_mode', 'API');
      } else {
        if (config.general.connectionMode.toUpperCase() === 'SESSION') {
          this.connection_mode = 'SESSION';
        } else {
          this.connection_mode = 'API';
        }
      }
    }
    this.refreshPanel();
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
    (this.shadowRoot.querySelector('#block-panel') as any).show();
  }

  free() {
    (this.shadowRoot.querySelector('#block-panel') as any).hide();
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
      this.block('Please wait to login.', 'Connecting to Backend.AI Cluster...');
      //this.notification.text = 'Connecting...';
      //this.notification.show();
      this._connectUsingSession();
    } else if (this.connection_mode === 'API' && this._validate_data(this.api_key) && this._validate_data(this.secret_key) && this._validate_data(this.api_endpoint)) {
      this.block('Please wait to login.', 'Connecting to Backend.AI Cluster...');
      //this.notification.text = 'Connecting...';
      //this.notification.show();
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
      this.notification.text = 'API Endpoint is empty. Please specify API endpoint to signup.';
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
      this.notification.text = 'Signout finished.';
      this.notification.show();
      let event = new CustomEvent("backend-ai-logout", {"detail": ""});
      document.dispatchEvent(event);
    }).catch((err) => {   // Signout failed
      this.free();
      if (this.signoutPanel.open !== true) {
        console.log(err);
        if (err.message !== undefined) {
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
      this.notification.text = 'API Endpoint is empty. Please specify API endpoint to login.';
      this.notification.show();
      return;
    }
    this.notification.text = 'Connecting...';
    this.notification.show();
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
    if (isLogon === false) {
      this.client.login().then(response => {
        if (response === false) {
          throw {"message": "Authentication failed. Check information and manager status."};
        } else {
          return this._connectGQL();
        }
      }).catch((err) => {   // Connection failed
        this.free();
        if (this.loginPanel.open !== true) {
          console.log(err);
          if (err.message !== undefined) {
            this.notification.text = PainKiller.relieve(err.title);
            this.notification.detail = err.message;
          } else {
            this.notification.text = PainKiller.relieve('Login information mismatch. If the information is correct, logout and login again.');
          }
          this.notification.show();
          this.open();
        } else {
          this.notification.text = PainKiller.relieve('Login failed. Check login information.');
          this.notification.show();
        }
        this.open();
      });
    } else {
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
      return this.client.isAPIVersionCompatibleWith('v4.20190601');
    }).then(response => {
      if (response === false) {// Legacy code to support 19.03
        this._connectViaGQLLegacy();
      } else {
        this._connectViaGQL();
      }
    }).catch((err) => {   // Connection failed
      console.log(err);
      if (this.loginPanel.open !== true) {
        if (err.message !== undefined) {
          this.notification.text = PainKiller.relieve(err.title);
          this.notification.detail = err.message;
        } else {
          this.notification.text = PainKiller.relieve('Login information mismatch. If the information is correct, logout and login again.');
        }
        this.notification.show(true);
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
      window.backendaiclient = this.client;
      let resource_policy = response['keypair'].resource_policy;
      window.backendaiclient.resource_policy = resource_policy;
      this.user = response['keypair'].user;
      let fields = ["username", "email", "full_name", "is_active", "role", "domain_name", "groups {name, id}"];
      let q = `query { user{ ${fields.join(" ")} } }`;
      let v = {'uuid': this.user};
      return window.backendaiclient.gql(q, v);
    }).then(response => {
      let email = response['user'].email;
      if (this.email !== email) {
        this.email = email;
      }
      let role = response['user'].role;
      this.domain_name = response['user'].domain_name;
      window.backendaiclient.email = this.email;
      window.backendaiclient.is_admin = false;
      window.backendaiclient.is_superadmin = false;

      if (["superadmin", "admin"].includes(role)) {
        window.backendaiclient.is_admin = true;
      }
      if (["superadmin"].includes((role))) {
        window.backendaiclient.is_superadmin = true;
      }
      return window.backendaiclient.group.list(true, false, ['id', 'name', 'description', 'is_active']);
    }).then(response => {
      let groups = response.groups;
      if (groups !== null) {
        window.backendaiclient.groups = groups.map((item) => {
          return item.name;
        });
        let groupMap = Object();
        groups.forEach(function (element) {
          groupMap[element.name] = element.id;
        });
        window.backendaiclient.groupIds = groupMap;
      } else {
        window.backendaiclient.groups = ['default'];
      }
      window.backendaiclient.current_group = window.backendaiclient.groups[0];
      window.backendaiclient.current_group_id = () => {
        return window.backendaiclient.groupIds[window.backendaiclient.current_group];
      };
      window.backendaiclient._config._proxyURL = this.proxy_url;
      window.backendaiclient._config.domainName = this.domain_name;
      window.backendaiclient._config.default_session_environment = this.default_session_environment;
      window.backendaiclient._config.allow_project_resource_monitor = this.allow_project_resource_monitor;
      window.backendaiclient.ready = true;
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
        this.notification.show(true);
        this.open();
      } else {
        this.notification.text = PainKiller.relieve('Login failed. Check login information.');
        this.notification.show(true);
      }
    });
  }

  _connectViaGQLLegacy() {
    let fields = ["user_id", "is_admin", "resource_policy"];
    let q = `query { keypair { ${fields.join(" ")} } }`;
    let v = {};
    return this.client.gql(q, v).then(response => {
      window.backendaiclient = this.client;
      let email = response['keypair'].user_id;
      let is_admin = response['keypair'].is_admin;
      let resource_policy = response['keypair'].resource_policy;
      if (this.email != email) {
        this.email = email;
      }
      window.backendaiclient.groups = ['default'];
      window.backendaiclient.email = this.email;
      window.backendaiclient.current_group = 'default';
      window.backendaiclient.is_admin = is_admin;
      window.backendaiclient.is_superadmin = is_admin;
      window.backendaiclient.resource_policy = resource_policy;
      window.backendaiclient._config._proxyURL = this.proxy_url;
      window.backendaiclient._config.domainName = 'default';
      window.backendaiclient._config.default_session_environment = this.default_session_environment;
      window.backendaiclient._config.allow_project_resource_monitor = this.allow_project_resource_monitor;
      return window.backendaiclient.getManagerVersion();
    }).then(response => {
      window.backendaiclient.ready = true;
      let event = new CustomEvent("backend-ai-connected", {"detail": this.client});
      document.dispatchEvent(event);
      this.close();
      this._saveLoginInfo();
      localStorage.setItem('backendaiconsole.api_endpoint', this.api_endpoint);
      //this.notification.text = 'Connected.';
      //this.notification.show();
    }).catch((err) => {   // Connection failed
      if (this.loginPanel.open !== true) {
        if (err.message !== undefined) {
          this.notification.text = PainKiller.relieve(err.title);
          this.notification.detail = err.message;
        } else {
          this.notification.text = PainKiller.relieve('Login information mismatch. If the information is correct, logout and login again.');
        }
        this.notification.show(true);
        this.open();
      } else {
        this.notification.text = PainKiller.relieve('Login failed. Check login information.');
        this.notification.show(true);
      }
      this.open();
    });
  }

  async _saveLoginInfo() {
    localStorage.setItem('backendaiconsole.login.api_key', this.api_key);
    localStorage.setItem('backendaiconsole.login.secret_key', this.secret_key);
    localStorage.setItem('backendaiconsole.login.user_id', this.user_id);
    localStorage.setItem('backendaiconsole.login.password', this.password);
  }

  render() {
    // language=HTML
    return html`
      <wl-dialog id="login-panel" fixed backdrop blockscrolling persistent disablefocustrap>
        <wl-card elevation="1" class="login-panel intro centered" style="margin: 0;">
          <h3 class="horizontal center layout">
            <div>Login with ${this.connection_mode == 'SESSION' ? html`E-mail` : html`IAM`}</div>
            <div class="flex"></div>
            ${this.change_signin_support ? html`
                <small><a style="margin-left:15px;" @click="${() => this._changeSigninMode()}">${this.connection_mode == 'SESSION' ? html`Use IAM` : html`Use ID/password`}</a></small>
            ` : html``}
            ${this.signup_support ? html`
            <div class="vertical center-justified layout">
              <div style="font-size:12px;margin:0 10px;text-align:center;">Not a user?</div>
              <wl-button style="width:80px;font-weight:500;" class="signup-button fg green mini signup" outlined type="button" @click="${() => this._showSignupDialog()}">Sign up</wl-button>
            </div>
            ` : html``}
          </h3>
          <form id="login-form">
            <fieldset>
              <wl-textfield type="text" name="api_key" id="id_api_key" maxlength="30" style="display:none;"
                           label="API Key" value="${this.api_key}" @keyup="${this._submitIfEnter}"></wl-textfield>
              <wl-textfield type="password" name="secret_key" id="id_secret_key" style="display:none;"
                           label="Secret Key" value="${this.secret_key}" @keyup="${this._submitIfEnter}"></wl-textfield>
              <wl-textfield type="email" name="user_id" id="id_user_id" maxlength="50" style="display:none;"
                           label="E-mail" value="${this.user_id}" @keyup="${this._submitIfEnter}"></wl-textfield>
              <wl-textfield type="password" name="password" id="id_password" style="display:none;"
                           label="Password" value="${this.password}" @keyup="${this._submitIfEnter}"></wl-textfield>
              <wl-textfield type="text" name="api_endpoint" id="id_api_endpoint" style="display:none;"
                           label="API Endpoint" value="${this.api_endpoint}" @keyup="${this._submitIfEnter}"></wl-textfield>
              <wl-textfield type="text" name="api_endpoint_humanized" id="id_api_endpoint_humanized"
                           style="display:none;"
                           label="API Endpoint" value=""></wl-textfield>
              <br/><br/>
              <wl-button class="fg red full login-button" id="login-button" outlined type="button"
                          @click="${() => this._login()}">
                          <wl-icon>check</wl-icon>
                          Login</wl-button>
            </fieldset>
          </form>
        </wl-card>
      </wl-dialog>
      <wl-dialog id="signout-panel" fixed backdrop blockscrolling persistent disablefocustrap>
        <wl-card elevation="1" class="login-panel intro centered" style="margin: 0;">
          <h3 class="horizontal center layout">
            <div>Leave service</div>
            <div class="flex"></div>
            <wl-button class="red" fab flat inverted @click="${(e) => this._hideDialog(e)}">
              <wl-icon>close</wl-icon>
            </wl-button>
          </h3>
          <section>
            <div class="warning">To confirm, please type your E-mail and password again.</div>
          </section>
          <form id="signout-form">
            <fieldset>
              <wl-textfield type="email" name="signout_user_id" id="id_signout_user_id" maxlength="30"
                           label="E-mail" value="" @keyup="${this._signoutIfEnter}"></wl-textfield>
              <wl-textfield type="password" name="signout_password" id="id_signout_password"
                           label="Password" value="" @keyup="${this._signoutIfEnter}"></wl-textfield>
              <br/><br/>
              <wl-button class="fg red full login-button" id="signout-button" outlined type="button"
                          @click="${() => this._signout()}">
                          <wl-icon>check</wl-icon>
                          Leave service</wl-button>
            </fieldset>
          </form>
        </wl-card>
      </wl-dialog>
      <wl-dialog id="block-panel" fixed backdrop blockscrolling persistent>
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
            <wl-button outlined class="fg red mini login-cancel-button" type="button" @click="${(e) => this._cancelLogin(e)}">Cancel login</wl-button>
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
