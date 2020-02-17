/**
 @license
 Copyright (c) 2015-2020 Lablup Inc. All rights reserved.
 */

import {css, customElement, html, LitElement, property} from "lit-element";
import '@polymer/paper-input/paper-input';
import 'weightless/button';
import 'weightless/icon';
import 'weightless/dialog';
import 'weightless/card';
import './lablup-terms-of-service';

import '../lib/backend.ai-client-es6';

import {BackendAiStyles} from "./backend-ai-console-styles";
import {
  IronFlex,
  IronFlexAlignment,
  IronFlexFactors,
  IronPositioning
} from "../plastics/layout/iron-flex-layout-classes";

/**
 Backend.AI Signup feature for GUI Console

 `backend-ai-signup` is a login UI / Model to provide both API and session-based login.

 Example:

 <backend-ai-signup>
 ... content ...
 </backend-ai-signup>

 @group Backend.AI Console
 */
@customElement("backend-ai-signup")
export default class BackendAiSignup extends LitElement {
  public shadowRoot: any; // ShadowRoot
  @property({type: String}) company_name = '';
  @property({type: String}) company_id = '';
  @property({type: String}) user_name = '';
  @property({type: String}) user_email = '';
  @property({type: String}) errorMsg = '';
  @property({type: String}) endpoint = '';
  @property({type: Object}) notification = Object();
  @property({type: Object}) signupPanel = Object();
  @property({type: Object}) blockPanel = Object();
  @property({type: Object}) client;
  @property({type: Object}) TOSdialog = Object();

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
          paper-icon-button {
              --paper-icon-button-ink-color: white;
          }

          fieldset input {
              width: 100%;
              border: 0;
              border-bottom: 1px solid #aaa;
              margin: 15px 0;
              font: inherit;
              font-size: 16px;
              outline: none;
          }

          fieldset input:focus {
              border-bottom: 1.5px solid #0d47a1;
          }

          #signup-panel {
              --dialog-width: 400px;
          }

          wl-button {
              --button-bg: transparent;
              --button-bg-hover: var(--paper-red-100);
              --button-bg-active: var(--paper-red-600);
              --button-bg-disabled: #ddd;
              --button-color: var(--paper-red-600);
              --button-color-disabled: #222;
          }

          wl-button.full {
              width: 335px;
          }

          wl-button.fab {
              --button-bg: var(--paper-light-green-600);
              --button-bg-hover: var(--paper-green-600);
              --button-bg-active: var(--paper-green-900);
          }

          wl-button.signup {
              --button-bg: transparent;
              --button-bg-hover: var(--paper-green-300);
              --button-bg-active: var(--paper-green-300);
          }
      `];
  }

  firstUpdated() {
    this.signupPanel = this.shadowRoot.querySelector('#signup-panel');
    this.blockPanel = this.shadowRoot.querySelector('#block-panel');
    this.notification = window.lablupNotification;
    this.TOSdialog = this.shadowRoot.querySelector('#terms-of-service');
  }

  receiveTOSAgreement() {
    if (this.TOSdialog.show === false) {
      this.TOSdialog.tosContent = "";
      this.TOSdialog.title = "Terms of Service";
      this.TOSdialog.tosEntryURL = '/resources/documents/terms-of-service.html';
      this.TOSdialog.open();
    }
  }

  receivePPAgreement() {
    if (this.TOSdialog.show === false) {
      this.TOSdialog.tosContent = "";
      this.TOSdialog.title = "Privacy Policy";
      this.TOSdialog.tosEntryURL = '/resources/documents/privacy-policy.html';
      this.TOSdialog.open();
    }
  }

  open() {
    if (this.signupPanel.open !== true) {
      this.signupPanel.show();
    }
  }

  close() {
    if (this.signupPanel.open === true) {
      this.signupPanel.hide();
    }
  }

  init_client() {
    if (typeof this.client === 'undefined') {
      if (this.endpoint !== '' && this.client !== {}) {
        let clientConfig = {
          connectionMode: 'SESSION',
          apiVersionMajor: 'v4',
          apiVersion: 'v4.20190615',
          _apiVersion: 'v4.20190615',
          endpoint: this.endpoint
        };
        this.client = new ai.backend.Client(
          clientConfig,
          `Backend.AI Console.`,
        );
      }
    }
  }

  _hideDialog(e) {
    let hideButton = e.target;
    let dialog = hideButton.closest('wl-dialog');
    dialog.hide();
  }

  block(message = '') {
    this.errorMsg = message;
    this.blockPanel.show();
  }

  _validate_data(value) {
    if (value != undefined && value != null && value != '') {
      return true;
    }
    return false;
  }

  _clear_info() {
    this.company_name = '';
    this.user_name = '';
    //this.shadowRoot.querySelector('#signup-button').setAttribute('disabled', 'true');
  }

  _signup() {
    let approved = (this.shadowRoot.querySelector('#approve-terms-of-service') as HTMLInputElement).checked;
    if (approved === false) {
      this.notification.text = "Please read and agree with the terms of service to proceed.";
      this.notification.show();
      return;
    }
    let password1 = (this.shadowRoot.querySelector('#id_password1') as HTMLInputElement).value;
    let password2 = (this.shadowRoot.querySelector('#id_password2') as HTMLInputElement).value;
    if (this.shadowRoot.querySelector("#id_password1").getAttribute("invalid") !== null) {
      this.notification.text = "Password must contain at least one alphabet, one digit, and one special character";
      this.notification.show();
      return;
    }
    if (password1 !== password2) {
      this.notification.text = 'Password mismatch. Please check your password.';
      this.notification.show();
      return;
    }
    const token = (this.shadowRoot.querySelector('#id_token') as HTMLInputElement).value;
    const user_email = (this.shadowRoot.querySelector('#id_user_email') as HTMLInputElement).value;
    const user_name = (this.shadowRoot.querySelector('#id_user_name') as HTMLInputElement).value;
    this.notification.text = 'Processing...';
    this.notification.show();
    let body = {
      'email': user_email,
      'user_name': user_name,
      'password': password1,
      'token': token
    };
    this.init_client();
    let rqst = this.client.newSignedRequest('POST', `/auth/signup`, body);
    this.client._wrapWithPromise(rqst).then((response) => {
      this.shadowRoot.querySelector('#id_user_name').setAttribute('disabled', 'true');
      this.shadowRoot.querySelector('#id_token').setAttribute('disabled', 'true');
      this.shadowRoot.querySelector('#signup-button').setAttribute('disabled', 'true');
      this.shadowRoot.querySelector('#signup-button-message').textContent = 'Signup succeed';
      this.notification.text = 'Signup succeed.';
      this.notification.show();
      setTimeout(() => {
        this.signupPanel.hide();
      }, 1000);
    }).catch((e) => {
      if (e.message) {
        this.notification.text = e.message;
        this.notification.show(true, e);
      }
      console.log(e);
    });
  }

  // TODO: global error message patcher
  _politeErrorMessage(err) {
    const errorMsgSet = {
      "Cannot read property 'map' of null": "User has no group. Please contact administrator to fix it.",
      "Cannot read property 'split' of undefined": 'Wrong API server address.'
    };
    console.log(err);
    if (err in errorMsgSet) {
      return errorMsgSet[err];
    }
    return err;
  }

  render() {
    // language=HTML
    return html`
      <wl-dialog id="signup-panel" fixed blockscrolling persistent disablefocustrap>
        <wl-card elevation="1" class="login-panel intro centered" style="margin: 0;">
          <h3 class="horizontal center layout">
            <div>Signup (Beta invitation only)</div>
            <div class="flex"></div>
            <wl-button class="fab"  style="width:40px;" fab flat inverted @click="${(e) => this._hideDialog(e)}">
              <wl-icon>close</wl-icon>
            </wl-button>
          </h3>
          <form id="signup-form">
            <fieldset>
              <paper-input type="text" name="user_email" id="id_user_email" maxlength="50" autofocus
                           label="E-mail" value="${this.user_email}"
                           @change="${() => this._clear_info()}"></paper-input>
              <paper-input type="text" name="user_name" id="id_user_name" maxlength="30"
                           label="User Name" value="${this.user_name}"></paper-input>
              <paper-input type="text" name="token" id="id_token" maxlength="50"
                           label="Invitation Token"></paper-input>
              <paper-input type="password" name="password1" id="id_password1"
                           label="Password"
                           pattern="^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$"
                           value=""></paper-input>
              <paper-input type="password" name="password2" id="id_password2"
                           label="Password (again)"
                           pattern="^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$"
                           value=""></paper-input>
              <div>
                <wl-checkbox id="approve-terms-of-service">
                </wl-checkbox>
                 I have read and agree to the <a style="color:forestgreen;" @click="${() => this.receiveTOSAgreement()}">terms of service</a> and <a style="color:forestgreen;" @click="${() => this.receivePPAgreement()}">privacy policy</a>.
              </div>
              <br/><br/>
              <wl-button class="full" id="signup-button" outlined type="button"
                          @click="${() => this._signup()}">
                          <wl-icon>check</wl-icon>
                          <span id="signup-button-message">Signup</span></wl-button>
            </fieldset>
          </form>
        </wl-card>
      </wl-dialog>
      <wl-dialog id="block-panel" fixed backdrop blockscrolling persistent>
        <wl-card>
          <h3>Error</h3>
          <div style="text-align:center;">
          ${this.errorMsg}
          </div>
        </wl-card>
      </wl-dialog>
      <lablup-terms-of-service id="terms-of-service"></lablup-terms-of-service>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "backend-ai-signup": BackendAiSignup;
  }
}
