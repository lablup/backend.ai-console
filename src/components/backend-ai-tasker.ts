/**
 @license
 Copyright (c) 2015-2021 Lablup Inc. All rights reserved.
 */

import {css, CSSResultArray, CSSResultOrNative, customElement, html, LitElement, property} from 'lit-element';

class Task {
  tasktitle: string;
  taskid: string;
  taskobj?: Record<string, unknown>;
  tasktype: string;
  status: string;
  created_at: number;
  finished_at: number;

  constructor(title: string, obj: Record<string, unknown>, taskid: string, tasktype: string) {
    this.tasktitle = title;
    this.taskid = taskid;
    this.taskobj = obj;
    this.tasktype = tasktype;
    this.created_at = Date.now();
    this.finished_at = 0;
    this.status = 'active';
  }

  remove() {
    delete this.taskobj;
  }
}

/**
 Backend.AI Task manager for Console

 `backend-ai-tasker` is a background task manager for web UI.

 Example:
@group Backend.AI Web UI
 @element backend-ai-tasker
 */
@customElement('backend-ai-tasker')
export default class BackendAiTasker extends LitElement {
  public shadowRoot: any;

  @property({type: Object}) indicator;
  @property({type: Array}) taskstore;
  @property({type: Array}) finished;
  @property({type: Object}) pooler;
  @property({type: Boolean}) active = true;
  @property({type: Boolean}) isGCworking = false;

  /**
   *  Backend.AI Task manager for Console
   *
   */
  constructor() {
    super();
    this.taskstore = [];
    this.finished = [];
    this.indicator = globalThis.lablupIndicator;
    this.pooler = setInterval(() => {
      this.gc();
    }, 10000);
  }

  static get styles(): CSSResultOrNative | CSSResultArray {
    return [
      // language=CSS
      css``];
  }

  render() {
    // language=HTML
    return html`
    `;
  }

  shouldUpdate() {
    return this.active;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  /**
   *  Add task to task list.
   *
   * @param {string} title - Title of task
   * @param {Object} task - Object / Promise instance to add.
   * @param {string} taskid - Task ID. It should be unique. If no taskid is given, it will be autogenerated (recommended)
   * @param {string} tasktype - Task type. Default is 'general'
   * @return {boolean | Task} - False if task cannot be added. Else return task object.
   */
  add(title, task, taskid = '', tasktype = 'general') {
    if (taskid === '') {
      taskid = this.generate_UUID();
    }
    const item = new Task(title, task, taskid, tasktype);
    if (task != null && typeof task.then === 'function') { // For Promise type task
      task.then().catch((err) => {
        // NOTICE: this is a stop-gap measure for error handling.
        // console.log(err);
      }).finally(() => {
        // No matter any error occurred or not during the session creating,
        // Task list have to be updated.
        this.finished.push(taskid);
        this.gc();
      });
    } else { // For function type task (not supported yet)
      return false;
    }
    this.taskstore.push(item);
    this.signal();
    return item;
  }

  /**
   *  Remove task from task list.
   *
   * @param {string} taskid - Task ID to remove.
   */
  remove(taskid = '') {
    const result = this.taskstore.filter((obj) => {
      return obj.taskid === taskid;
    });
    if (result.length > 0) {
      let index = this.taskstore.indexOf(result[0]);
      if (index > -1) {
        result[0].remove();
        this.taskstore.splice(index, 1);
      }
      delete result[0];
      index = this.finished.indexOf(taskid);
      if (index > -1) {
        this.finished.splice(index, 1);
      }
      this.signal();
    }
  }

  /**
   *  List current tasks in task list.
   *
   * @param {string} taskid - Task ID to remove.
   * @return {string} uuid - UUID-type string
   */
  list() {
    return this.taskstore;
  }

  generate_UUID() {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  /**
   *  Garbage collector. Automatically called for 15 second each.
   *
   */
  async gc() {
    if (this.isGCworking) {
      return;
    }
    this.isGCworking = true;
    if (this.finished.length > 0) {
      this.finished.forEach((item) => {
        this.remove(item);
      });
    }
    this.isGCworking = false;
  }

  signal() {
    const event: CustomEvent = new CustomEvent('backend-ai-task-changed', {'detail': {'tasks': this.taskstore}});
    document.dispatchEvent(event);
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'backend-ai-tasker': BackendAiTasker;
  }
}
