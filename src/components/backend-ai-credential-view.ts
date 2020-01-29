/**
 * Backend.AI-credential-view
 */

import {css, customElement, html, property} from "lit-element";

import {BackendAIPage} from './backend-ai-page';

import '@polymer/paper-input/paper-input';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-item/paper-item';
import 'weightless/button';
import 'weightless/icon';
import 'weightless/card';
import 'weightless/dialog';
import 'weightless/textfield';
import 'weightless/tab';
import 'weightless/tab-group';
import 'weightless/expansion';


import './backend-ai-credential-list';
import './backend-ai-resource-policy-list';
import './backend-ai-user-list';
import {default as PainKiller} from "./backend-ai-painkiller";

import {BackendAiStyles} from "./backend-ai-console-styles";
import {
  IronFlex,
  IronFlexAlignment,
  IronFlexFactors,
  IronPositioning
} from "../plastics/layout/iron-flex-layout-classes";

/**
 Backend.AI Credential view page

 Example:

 <backend-ai-credential-view active=true>
 ... content ...
 </backend-ai-credential-view>

 @group Backend.AI Console
 */
@customElement("backend-ai-credential-view")
export default class BackendAICredentialView extends BackendAIPage {
  @property({type: Array}) cpu_metric = [1, 2, 3, 4, 8, 16, 24, 32, 48, "Unlimited"];
  @property({type: Array}) ram_metric = [1, 2, 4, 8, 16, 24, 32, 64, 128, 256, 512, "Unlimited"];
  @property({type: Array}) gpu_metric = [0, 1, 2, 3, 4, 5, 6, 7, 8, 12, 16, "Unlimited"];
  @property({type: Array}) fgpu_metric = [0, 0.2, 0.3, 0.5, 1, 2, 3, 4, 8, 16, "Unlimited"];
  @property({type: Array}) rate_metric = [1000, 2000, 3000, 4000, 5000, 10000, 50000];
  @property({type: Array}) concurrency_metric = [1, 2, 3, 4, 5, 10, 50, "Unlimited"];
  @property({type: Array}) container_per_session_metric = [1, 2, 3, 4, 8, "Unlimited"];
  @property({type: Array}) idle_timeout_metric = [60, 600, 900, 1800, 3600, 43200, 86400, 604800, 1209600];
  @property({type: Array}) vfolder_capacity_metric = [1, 2, 5, 10, 20, 50, 100, 200, 1000];
  @property({type: Array}) vfolder_count_metric = [1, 2, 3, 4, 5, 10, 30, 50, 100];
  @property({type: Object}) resource_policies = Object();
  @property({type: Array}) resource_policy_names = Array();
  @property({type: Boolean}) is_admin = false;
  @property({type: String}) _status = 'inactive';
  @property({type: Array}) allowed_vfolder_hosts = Array();
  @property({type: String}) default_vfolder_host = '';
  @property({type: Boolean}) use_user_list = false;
  @property({type: String}) new_access_key = '';
  @property({type: String}) new_secret_key = '';
  @property({type: String}) _activeTab = 'credential-lists';
  @property({type: Object}) notification = Object();

  constructor() {
    super();
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
        wl-button.create-button {
          width: 335px;
        }

        #new-keypair-dialog {
          min-width: 350px;
        }

        fieldset {
          padding: 0;
        }

        fieldset div {
          padding-left: 20px;
          padding-right: 20px;
        }

        fieldset wl-button {
          margin-left: 20px;
          margin-right: 20px;
          margin-bottom: 20px;
        }

        wl-dialog wl-textfield {
          padding-left: 20px;
          padding-right: 20px;
          --input-font-family: Roboto, Noto, sans-serif;
        }

        wl-textfield {
          --input-state-color-invalid: red;
        }

        wl-dialog paper-input {
          margin: 15px 0 5px 0;
          width: 100%;
        }
        wl-dialog h4 {
          margin: 15px 0 5px 0;
          font-weight: 100;
          font-size: 16px;
          padding-left: 20px;
          border-bottom: 1px solid #ccc;
        }

        wl-button {
          --button-bg: var(--paper-light-green-50);
          --button-bg-hover: var(--paper-green-100);
          --button-bg-active: var(--paper-green-600);
        }

        wl-button.fab {
          --button-bg: var(--paper-light-green-600);
          --button-bg-hover: var(--paper-green-600);
          --button-bg-active: var(--paper-green-900);
        }

        wl-card h3 {
          padding-top: 0;
          padding-right: 15px;
          padding-bottom: 0;
        }

        wl-card wl-card {
          margin: 0;
          padding: 0;
          --card-elevation: 0;
        }

        wl-tab-group {
          --tab-group-indicator-bg: var(--paper-green-600);
        }

        wl-tab {
          --tab-color: #666;
          --tab-color-hover: #222;
          --tab-color-hover-filled: #222;
          --tab-color-active: var(--paper-green-600);
          --tab-color-active-hover: var(--paper-green-600);
          --tab-color-active-filled: #ccc;
          --tab-bg-active: var(--paper-lime-200);
          --tab-bg-filled: var(--paper-lime-200);
          --tab-bg-active-hover: var(--paper-lime-200);
        }

        wl-expansion {
          --expansion-elevation: 0;
          --expansion-elevation-open: 0;
          --expansion-elevation-hover: 0;
          --expansion-margin-open: 0;
          --expansion-content-padding: 0;
          border-bottom: 1px solid #DDD;
        }

        wl-expansion h4 {
          font-weight: 200;
          border-bottom: 0;
        }

        #new-user-dialog wl-textfield {
          margin-bottom: 15px;
        }
      `];
  }

  firstUpdated() {
    this.notification = window.lablupNotification;
    document.addEventListener('backend-ai-credential-refresh', () => {
      this.shadowRoot.querySelector('#active-credential-list').refresh();
      this.shadowRoot.querySelector('#inactive-credential-list').refresh();
    }, true);

    this.shadowRoot.querySelectorAll('wl-expansion').forEach(element => {
      element.addEventListener("keydown", event => {
        event.stopPropagation();
      }, true);
    });

    if (typeof window.backendaiclient === "undefined" || window.backendaiclient === null || window.backendaiclient.ready === false) {
      document.addEventListener('backend-ai-connected', () => {
        if (window.backendaiclient.is_admin !== true) {
          this.disablePage();
        }
        if (window.backendaiclient.isAPIVersionCompatibleWith('v4.20190601') === true) {
          this.use_user_list = true;
        }
      });
    } else {
      if (window.backendaiclient.is_admin !== true) {
        this.disablePage();
      }
      if (window.backendaiclient.isAPIVersionCompatibleWith('v4.20190601') === true) {
        this.use_user_list = true;
      } else {
        this.use_user_list = false;
      }
    }
  }

  async _viewStateChanged(active) {
    await this.updateComplete;
    if (active === false) {
      this.shadowRoot.querySelector('#resource-policy-list').active = false;
      this.shadowRoot.querySelector('#user-list').active = false;
      this._status = 'inactive';
      return;
    }
    this.shadowRoot.querySelector('#resource-policy-list').active = true;
    this.shadowRoot.querySelector('#user-list').active = true;
    this._status = 'active';
  }

  async _launchKeyPairDialog() {
    await this._getResourcePolicies();
    this.shadowRoot.querySelector('#new-keypair-dialog').show();
  }

  _readVFolderHostInfo() {
    window.backendaiclient.vfolder.list_hosts().then(response => {
      this.allowed_vfolder_hosts = response.allowed;
      this.default_vfolder_host = response.default;
    }).catch(err => {
      console.log(err);
      if (err && err.message) {
        this.notification.text = PainKiller.relieve(err.title);
        this.notification.detail = err.message;
        this.notification.show(true);
      }
    });
  }

  _launchResourcePolicyDialog() {
    this._readVFolderHostInfo();
    this.shadowRoot.querySelector('#new-policy-dialog').show();
  }

  _launchModifyResourcePolicyDialog() {
    this._readVFolderHostInfo();
    this.shadowRoot.querySelector('#new-policy-dialog').show();
  }

  _launchUserAddDialog() {
    this.shadowRoot.querySelector('#new-user-dialog').show();
  }

  async _getResourcePolicies() {
    return window.backendaiclient.resourcePolicy.get(null, ['name', 'default_for_unspecified',
      'total_resource_slots',
      'max_concurrent_sessions',
      'max_containers_per_session',
    ]).then((response) => {
      let policies = window.backendaiclient.utils.gqlToObject(response.keypair_resource_policies, 'name');
      let policyNames = window.backendaiclient.utils.gqlToList(response.keypair_resource_policies, 'name');
      this.resource_policies = policies;
      this.resource_policy_names = policyNames;
    });
  }

  _addKeyPair() {
    let is_active = true;
    let is_admin = false;
    let user_id;
    if (this.shadowRoot.querySelector('#id_new_user_id').value != '') {
      if (this.shadowRoot.querySelector('#id_new_user_id').invalid == true) {
        return;
      }
      user_id = this.shadowRoot.querySelector('#id_new_user_id').value;
    } else {
      user_id = window.backendaiclient.email;
    }
    let resource_policy = this.shadowRoot.querySelector('#resource-policy').value;
    let rate_limit = this.shadowRoot.querySelector('#rate-limit').value;
    let access_key = this.shadowRoot.querySelector('#id_new_access_key').value;
    let secret_key = this.shadowRoot.querySelector('#id_new_secret_key').value;
    // Read resources
    window.backendaiclient.keypair.add(user_id, is_active, is_admin,
      resource_policy, rate_limit, access_key, secret_key).then(response => {
      this.shadowRoot.querySelector('#new-keypair-dialog').hide();
      this.notification.text = "Keypair successfully created.";
      this.notification.show();
      this.shadowRoot.querySelector('#active-credential-list').refresh();
    }).catch(err => {
      console.log(err);
      if (err && err.message) {
        this.shadowRoot.querySelector('#new-keypair-dialog').hide();
        this.notification.text = PainKiller.relieve(err.title);
        this.notification.detail = err.message;
        this.notification.show(true);
      }
    });
  }

  _readResourcePolicyInput() {
    let cpu_resource = this.shadowRoot.querySelector('#cpu-resource').value;
    let ram_resource = this.shadowRoot.querySelector('#ram-resource').value;
    let gpu_resource = this.shadowRoot.querySelector('#gpu-resource').value;
    let fgpu_resource = this.shadowRoot.querySelector('#fgpu-resource').value;
    let vfolder_hosts: string[] = [];
    vfolder_hosts.push(this.shadowRoot.querySelector('#allowed_vfolder-hosts').value);
    if (cpu_resource === "Unlimited") {
      cpu_resource = "Infinity";
    }
    if (ram_resource === "Unlimited") {
      ram_resource = "Infinity";
    } else {
      ram_resource = ram_resource + 'g';
    }
    if (gpu_resource === "Unlimited") {
      gpu_resource = "Infinity";
    } else {
      gpu_resource = parseInt(gpu_resource).toString();
    }
    if (fgpu_resource === "Unlimited") {
      fgpu_resource = "Infinity";
    } else {
      fgpu_resource = parseFloat(fgpu_resource).toString();
    }
    let total_resource_slots = {
      "cpu": cpu_resource,
      "mem": ram_resource,
      "cuda.device": gpu_resource,
      "cuda.shares": fgpu_resource
    };
    let concurrency_limit = this.shadowRoot.querySelector('#concurrency-limit').value;
    let containers_per_session_limit = this.shadowRoot.querySelector('#container-per-session-limit').value;
    let vfolder_count_limit = this.shadowRoot.querySelector('#vfolder-count-limit').value;
    let vfolder_capacity_limit = this.shadowRoot.querySelector('#vfolder-capacity-limit').value;
    let idle_timeout = this.shadowRoot.querySelector('#idle-timeout').value;
    let input = {
      'default_for_unspecified': 'UNLIMITED',
      'total_resource_slots': JSON.stringify(total_resource_slots),
      'max_concurrent_sessions': concurrency_limit,
      'max_containers_per_session': containers_per_session_limit,
      'idle_timeout': parseInt(idle_timeout),
      'max_vfolder_count': vfolder_count_limit,
      'max_vfolder_size': vfolder_capacity_limit,
      'allowed_vfolder_hosts': vfolder_hosts
    };
    return input;
  }

  _addResourcePolicy() {
    let name;
    if (this.shadowRoot.querySelector('#id_new_policy_name').value != '') {
      if (this.shadowRoot.querySelector('#id_new_policy_name').invalid == true) {
        return;
      }
      name = this.shadowRoot.querySelector('#id_new_policy_name').value;
    } else {
      this.notification.text = "Please input policy name";
      this.notification.show();
      return;
    }
    let input = this._readResourcePolicyInput();
    window.backendaiclient.resourcePolicy.add(name, input).then(response => {
      this.shadowRoot.querySelector('#new-policy-dialog').hide();
      this.notification.text = "Resource policy successfully created.";
      this.notification.show();
      this.shadowRoot.querySelector('#resource-policy-list').refresh();
    }).catch(err => {
      console.log(err);
      if (err && err.message) {
        this.shadowRoot.querySelector('#new-policy-dialog').hide();
        this.notification.text = PainKiller.relieve(err.title);
        this.notification.detail = err.message;
        this.notification.show(true);
      }
    });
  }

  _addUser() {
    const email = this.shadowRoot.querySelector('#id_user_email').value,
      name = this.shadowRoot.querySelector('#id_user_name').value,
      password = this.shadowRoot.querySelector('#id_user_password').value,
      confirm = this.shadowRoot.querySelector('#id_user_confirm').value;

    // email verification
    if (email !== '') {
      // invalid email
      if (this.shadowRoot.querySelector('#id_user_email').hasAttribute('invalid')) {
        this.notification.text = "Email Is Invalid!";
        this.notification.show();
        return;
      }
    } else {
      // empty email
      this.notification.text = "Please Input User Id(Email)!";
      this.notification.show();
      return;
    }

    // username verification
    if (name === '') {
      this.notification.text = "Username Is Empty!";
      this.notification.show();
      return;
    }

    if (this.shadowRoot.querySelector("#id_user_password").getAttribute("invalid") !== null) {
      this.notification.text = "Password must contain at least one alphabet, one digit, and one special character";
      this.notification.show();
      return;
    }

    // password - confirm verification
    if (password === '') {
      this.notification.text = "Password Is Empty!";
      this.notification.show();
      return;
    }

    if (password !== confirm) {
      this.notification.text = "Confirmation Does Not Match With Original Password!";
      this.notification.show();
      return;
    }

    // all values except 'username', and 'password' are arbitrarily designated default values
    const input = {
      'username': name,
      'password': password,
      'need_password_change': false,
      'full_name': name,
      'description': `${name}'s Account`,
      'is_active': true,
      'domain_name': 'default',
      'role': 'user'
    };

    window.backendaiclient.group.list()
      .then(res => {
        const default_id = res.groups.find(x => x.name === 'default').id;

        return Promise.resolve(window.backendaiclient.user.add(email, {...input, 'group_ids': [default_id]}));
      })
      .then(res => {
        this.shadowRoot.querySelector('#new-user-dialog').hide();
        if (res['create_user'].ok) {
          this.notification.text = "User successfully created";

          this.shadowRoot.querySelector('#user-list').refresh();
        } else {
          console.error(res['create_user'].msg);
          this.notification.text = "Error on user creation";
        }
        this.notification.show();

        this.shadowRoot.querySelector('#id_user_email').value = '';
        this.shadowRoot.querySelector('#id_user_name').value = '';
        this.shadowRoot.querySelector('#id_user_password').value = '';
        this.shadowRoot.querySelector('#id_user_confirm').value = '';
      })
  }

  _modifyResourcePolicy() {
    let name = this.shadowRoot.querySelector('#id_new_policy_name').value;
    let input = this._readResourcePolicyInput();

    window.backendaiclient.resourcePolicy.mutate(name, input).then(response => {
      this.shadowRoot.querySelector('#new-policy-dialog').close();
      this.notification.text = "Resource policy successfully updated.";
      this.notification.show();
      this.shadowRoot.querySelector('#resource-policy-list').refresh();
    }).catch(err => {
      console.log(err);
      if (err && err.message) {
        this.shadowRoot.querySelector('#new-policy-dialog').close();
        this.notification.text = PainKiller.relieve(err.title);
        this.notification.detail = err.message;
        this.notification.show(true);
      }
    });
  }

  disablePage() {
    var els = this.shadowRoot.querySelectorAll(".admin");
    for (var x = 0; x < els.length; x++) {
      els[x].style.display = 'none';
    }
  }

  _hideDialog(e) {
    let hideButton = e.target;
    let dialog = hideButton.closest('wl-dialog');
    dialog.hide();
  }

  _showTab(tab) {
    var els = this.shadowRoot.querySelectorAll(".tab-content");
    for (var x = 0; x < els.length; x++) {
      els[x].style.display = 'none';
    }
    this._activeTab = tab.value;
    this.shadowRoot.querySelector('#' + tab.value).style.display = 'block';
  }

  render() {
    // language=HTML
    return html`
      <wl-card class="admin item" elevation="1">
        <h3 class="tab horizontal wrap layout">
          <wl-tab-group>
            <wl-tab value="credential-lists" checked @click="${(e) => this._showTab(e.target)}">Credentials</wl-tab>
            <wl-tab value="resource-policy-lists" @click="${(e) => this._showTab(e.target)}">Resource Policies</wl-tab>
            ${this._status === 'active' && this.use_user_list === true ? html`
            <wl-tab value="user-lists" @click="${(e) => this._showTab(e.target)}">Users</wl-tab>` :
      html``}
          </wl-tab-group>
          <div class="flex"></div>
          <wl-button class="fg green" id="add-keypair" outlined @click="${this._launchKeyPairDialog}">
            <wl-icon>add</wl-icon>
            Add credential
          </wl-button>
        </h3>
        <wl-card id="credential-lists" class="tab-content">
          <wl-expansion name="credential-group" open role="list">
            <h4 slot="title">Active</h4>
            <span slot="description">
            </span>
            <div>
              <backend-ai-credential-list id="active-credential-list" condition="active" ?active="${this._activeTab === 'credential-lists'}"></backend-ai-credential-list>
            </div>
          </wl-expansion>
          <wl-expansion name="credential-group" role="list">
            <h4 slot="title">Inactive</h4>
            <div>
              <backend-ai-credential-list id="inactive-credential-list" condition="inactive" ?active="${this._activeTab === 'credential-lists'}"></backend-ai-credential-list>
            </div>
          </wl-expansion>
        </wl-card>
        <wl-card id="resource-policy-lists" class="admin item tab-content" style="display:none;">
          <h4 class="horizontal flex center center-justified layout">
            <span>Policy groups</span>
            <span class="flex"></span>
            <wl-button class="fg green" id="add-policy" outlined @click="${this._launchResourcePolicyDialog}">
              <wl-icon>add</wl-icon>
              Create policy
            </wl-button>
          </h4>
          <div>
            <backend-ai-resource-policy-list id="resource-policy-list" ?active="${this._activeTab === 'resource-policy-lists'}"></backend-ai-resource-policy-list>
          </div>
        </wl-card>
        <wl-card id="user-lists" class="admin item tab-content" style="display:none;">
          <h4 class="horizontal flex center center-justified layout">
            <span>Users</span>
            <span class="flex"></span>
            <wl-button class="fg green" id="add-user" outlined @click="${this._launchUserAddDialog}">
              <wl-icon>add</wl-icon>
              Create user
            </wl-button>
          </h4>
          <div>
            <backend-ai-user-list id="user-list" ?active="${this._status === 'active' && this.use_user_list === true}"></backend-ai-user-list>
          </div>
        </wl-card>
      </wl-card>
      <wl-dialog id="new-keypair-dialog" fixed backdrop blockscrolling>
        <wl-card elevation="1" class="login-panel intro centered" style="margin: 0;">

          <h3 class="horizontal center layout" style="border-bottom:1px solid #ddd;">
            <span style="margin-right:15px;">Add credential</span>
            <div class="flex"></div>
            <wl-button fab flat inverted @click="${(e) => this._hideDialog(e)}">
              <wl-icon>close</wl-icon>
            </wl-button>
          </h3>
          <form id="login-form">
            <fieldset>
              <wl-textfield type="email" name="new_user_id" id="id_new_user_id" label="User ID as E-mail (optional)"
                           auto-validate></wl-textfield>
              <div class="horizontal center layout">
                <paper-dropdown-menu id="resource-policy" label="Resource Policy">
                  <paper-listbox slot="dropdown-content" selected="0">
                  ${this.resource_policy_names.map(item => html`
                    <paper-item label="${item}">${item}</paper-item>
                  `)}
                  </paper-listbox>
                </paper-dropdown-menu>
                <paper-dropdown-menu id="rate-limit" label="Rate Limit (for 15 min.)">
                  <paper-listbox slot="dropdown-content" selected="0">
                  ${this.rate_metric.map(item => html`
                    <paper-item label="${item}">${item}</paper-item>
                  `)}
                  </paper-listbox>
                </paper-dropdown-menu>
              </div>
              <wl-expansion name="advanced-keypair-info">
                <span slot="title">Advanced</span>
                <span slot="description"></span>
                <wl-textfield type="text" name="new_access_key" id="id_new_access_key" label="Access Key (optional)"
                              auto-validate .value="${this.new_access_key}">
                </wl-textfield>
                <wl-textfield type="text" name="new_secret_key" id="id_new_secret_key" label="Secret Key (optional)"
                              auto-validate .value="${this.new_secret_key}">
                </wl-textfield>
              </wl-expansion>
              <br/><br/>
              <wl-button class="fg blue create-button" id="create-keypair-button" outlined type="button"
              @click="${this._addKeyPair}">
                         <wl-icon>add</wl-icon>
                         Add
                         </wl-button>
            </fieldset>
          </form>
        </wl-card>
      </wl-dialog>
      <wl-dialog id="new-policy-dialog" fixed backdrop blockscrolling>
        <wl-card elevation="1" class="login-panel intro centered" style="margin: 0;">
          <h3 class="horizontal center layout">
            <span>Create resource policy</span>
            <div class="flex"></div>
            <wl-button class="fab" fab flat inverted @click="${(e) => this._hideDialog(e)}">
              <wl-icon>close</wl-icon>
            </wl-button>
          </h3>
          <form id="login-form">
            <fieldset>
              <div class="vertical center layout">
                <paper-input name="new_policy_name" id="id_new_policy_name" label="Policy Name"
                             type="text"
                             required
                             error-message="Policy name only accepts letters and numbers"></paper-input>
              </div>
              <h4>Resource Policy</h4>
              <div class="horizontal center layout">
                <paper-dropdown-menu id="cpu-resource" label="CPU">
                  <paper-listbox slot="dropdown-content" selected="0">
                  ${this.cpu_metric.map(item => html`
                    <paper-item label="${item}">${item}</paper-item>
                  `)}
                  </paper-listbox>
                </paper-dropdown-menu>
                <paper-dropdown-menu id="ram-resource" label="RAM (GB)">
                  <paper-listbox slot="dropdown-content" selected="0">
                  ${this.ram_metric.map(item => html`
                    <paper-item label="${item}">${item}</paper-item>
                  `)}
                  </paper-listbox>
                </paper-dropdown-menu>
                <paper-dropdown-menu id="gpu-resource" label="GPU">
                  <paper-listbox slot="dropdown-content" selected="0">
                  ${this.gpu_metric.map(item => html`
                    <paper-item label="${item}">${item}</paper-item>
                  `)}
                  </paper-listbox>
                </paper-dropdown-menu>
                <paper-dropdown-menu id="fgpu-resource" label="fGPU">
                  <paper-listbox slot="dropdown-content" selected="0">
                  ${this.fgpu_metric.map(item => html`
                    <paper-item label="${item}">${item}</paper-item>
                  `)}
                  </paper-listbox>
                </paper-dropdown-menu>

              </div>
              <h4>Sessions</h4>
              <div class="horizontal center layout">
                <paper-dropdown-menu id="container-per-session-limit" label="Container per session">
                  <paper-listbox slot="dropdown-content" selected="0">
                  ${this.container_per_session_metric.map(item => html`
                    <paper-item label="${item}">${item}</paper-item>
                  `)}
                  </paper-listbox>
                </paper-dropdown-menu>
                <paper-dropdown-menu id="idle-timeout" label="Idle timeout (sec.)">
                  <paper-listbox slot="dropdown-content" selected="0">
                  ${this.idle_timeout_metric.map(item => html`
                    <paper-item label="${item}">${item}</paper-item>
                  `)}
                  </paper-listbox>
                </paper-dropdown-menu>
              </div>

              <div class="horizontal center layout">
                <paper-dropdown-menu id="concurrency-limit" label="Concurrent Jobs">
                  <paper-listbox slot="dropdown-content" selected="0">
                  ${this.concurrency_metric.map(item => html`
                    <paper-item label="${item}">${item}</paper-item>
                  `)}
                  </paper-listbox>
                </paper-dropdown-menu>
              </div>
              <h4>Folders</h4>
              <div class="horizontal center layout">
                <paper-dropdown-menu id="allowed_vfolder-hosts" label="Allowed hosts">
                  <paper-listbox slot="dropdown-content" selected="0">
                  ${this.allowed_vfolder_hosts.map(item => html`
                    <paper-item label="${item}">${item}</paper-item>
                  `)}
                  </paper-listbox>
                </paper-dropdown-menu>
                <paper-dropdown-menu id="vfolder-capacity-limit" label="Capacity (GB)">
                  <paper-listbox slot="dropdown-content" selected="0">
                  ${this.vfolder_capacity_metric.map(item => html`
                    <paper-item label="${item}">${item}</paper-item>
                  `)}
                  </paper-listbox>
                </paper-dropdown-menu>
                <paper-dropdown-menu id="vfolder-count-limit" label="Max.#">
                  <paper-listbox slot="dropdown-content" selected="0">
                  ${this.vfolder_count_metric.map(item => html`
                    <paper-item label="${item}">${item}</paper-item>
                  `)}
                  </paper-listbox>
                </paper-dropdown-menu>
              </div>
              <br/><br/>
              <wl-button class="fg blue create-button" id="create-policy-button" type="button" outlined
               @click="${this._addResourcePolicy}">
                         <wl-icon>add</wl-icon>
                         Create
              </wl-button>
            </fieldset>
          </form>
        </wl-card>
      </wl-dialog>
      <wl-dialog id="new-user-dialog" fixed backdrop blockscrolling>
        <wl-card elevation="1" class="login-panel intro centered" style="margin: 0;">
          <h3 class="horizontal center layout">
            <span>Create User</span>
            <div class="flex"></div>
            <wl-button class="fab" fab flat inverted @click="${(e) => this._hideDialog(e)}">
              <wl-icon>close</wl-icon>
            </wl-button>
          </h3>
          <form>
            <fieldset>
              <wl-textfield
                type="email"
                name="user_email"
                id="id_user_email"
                label="E-mail"
              >
              </wl-textfield>
              <wl-textfield
                type="text"
                name="user_name"
                id="id_user_name"
                label="Username"
              >
              </wl-textfield>
              <wl-textfield
                type="password"
                name="user_password"
                id="id_user_password"
                label="Password"
                pattern="^(?=.*?[a-zA-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
              >
              </wl-textfield>
              <wl-textfield
                type="password"
                name="user_confirm"
                id="id_user_confirm"
                label="Password Confirm"
              >
              </wl-textfield>
              <wl-button class="fg blue create-button" id="create-user-button" outlined type="button"
              @click="${this._addUser}">
                <wl-icon>add</wl-icon>
                Create User
              </wl-button>
            </fieldset>
          </form>
        </wl-card>
      </wl-dialog>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "backend-ai-credential-view": BackendAICredentialView;
  }
}
