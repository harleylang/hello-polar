import { LitElement, html, css, unsafeCSS } from 'lit';

import { machine } from './machine';
import { useStateMachine } from './useStateMachine';

import * as CodeMirror from 'codemirror';
import CodeMirrorCss from 'codemirror/lib/codemirror.css';
import CodeMirrorCssElegant from 'codemirror/theme/elegant.css';
import CodeMirrorCssBootstrap from './bootstrap.css';

import ConfettiGenerator from 'confetti-js';

import { Test } from './types';

/**
 * <try-polar></try-polar>
 * @param {string} context Stringified json to pass to the state machine's context. 
 */
class TryPolar extends useStateMachine(LitElement, {
  machine: machine,
}) {

  context;

  static get properties(){
    return {
      context: {type: String}
    }
  }

  constructor() {
    super();
    this.context = '';
  }

  static get styles() {
    let result = css`
      ${unsafeCSS(CodeMirrorCss)}
      ${unsafeCSS(CodeMirrorCssElegant)}
      ${unsafeCSS(CodeMirrorCssBootstrap)}
      .CodeMirror, .CodeMirror-scroll {
        height: auto !important;
        max-height:300px;
      }
      button#submit {
        margin-top: 16px;
        margin-bottom: 16px;
      }
      span.valid {
        color: green;
        font-weight: 800;
      }
      span.invalid {
        color: red;
        font-style: italic;
        text-transform: uppercase;
      }
      span.error {
        color: #0080ff;
        font-weight: 800;
      }
      span.idle {
        color: #7d7d7d;
        font-style: italic;
      }
      code.error {
        display: block;
        width: calc(100% - 64px);
        padding: 32px;
        margin: 0;
        margin-bottom: 32px;
        background-color: #99ccff;
        border-radius: 10px;
      }
      .objectives {
        margin-bottom: 16px;
      }
      canvas#wahho_celebrategoodtimescmon_itsacelebration_ {
        position: fixed;
        width: 100%;
        height: 100%;
        left:0;
        top:0;
        z-index:-1;
      }
    `;
    return result;
  }

  editor = {} as CodeMirror.EditorFromTextArea;

  set = false;
  canvas: any;

  // setup state machine
  render() {

    const { state, send } = (this as any).machine;

    const handeSubmit = () => {
      let input = this.editor.getValue().replace(/'/g, '"') 
      send('SUBMIT', { input: input });
    }

    if (typeof this.canvas !== 'undefined') { // if applicable, show confetti
      if (state.matches('idle.query.valid') && !this.set) {
        let element = this.shadowRoot?.getElementById("wahho_celebrategoodtimescmon_itsacelebration_");
        this.canvas = new ConfettiGenerator({ target: element, animate: true });
        this.canvas.render();
        this.set = true;
      } else if (['idle.query.invalid', 'idle.query.error'].some(state.matches) && this.set) {
        this.canvas.clear();
        this.set = false;
      };
    };

    const generateObjectives = () => {

      let objectives = state.context.values.tests;

      let results = [];

      for (let i = 0; i < objectives.length; i++) {

        let obj: Test = objectives[i]

        let r = html`
          <ul>
            <li>
              ${obj.desc}
              <ul>
                <li>
                  Expected access: <code>${obj.expected}</code> /
                    ${obj.expected ? html`<code>access granted</code>` : html`<code>access denied</code>`}
                </li>
                <li>
                  Returned access:
                    ${state.context.values.results.length > 0 
                      ? html`<code>${state.context.values.results[i].result}</code> / ${
                        state.context.values.results[i].result 
                        ? html`<code>access granted</code>`
                        : html`<code>access denied</code>`
                      }` 
                      : state.matches('idle.query.error.oso') ?
                        html`<span class='error'>Please resolve the error message below.</span>`
                      : html`<span class='idle'>Idle -- write your policies and click submit to continue.</span>` }
                </li>
                <li>
                  Result:
                    ${state.context.values.results.length > 0 
                      ? state.context.values.results[i].expected === state.context.values.results[i].result 
                        ? html`<span class='valid'>Passing!</span>`
                        : html`<span class='invalid'>Failing.</span>`
                      : state.matches('idle.query.error.oso') ?
                        html`<span class='error'>Please resolve the error message below.</span>`
                      : html`<span class='idle'>Idle -- write your policies and click submit to continue.</span>` }
                </li>
              </ul>
            </li>
          </ul>
        `;

        results.push(r);

      };

      return results;

    };

    return html`

      <canvas id="wahho_celebrategoodtimescmon_itsacelebration_"></canvas>

      <h3>Objectives</h3>
      ${generateObjectives()}

      <h3>Your Policy File</h3>
      <textarea id='codetext'></textarea>
      <button id='submit' @click="${handeSubmit}">Submit</button>

      ${state.matches('idle.query.error.oso') ?
        html`
          <h3>ERROR!!</h3>
          <code class='error'>
            ${state.context.values.error}
          </code>
        `
      : `` }

    `;

    /* 
      <!-- for debugging
        <div class='objectives'>
          <span>CONTEXT: ${JSON.stringify(state.context.values)}</span>
          <span>STATE: ${JSON.stringify(state.value)}</span>
        </div>
      -->
    */

  }

  async firstUpdated() {
    setTimeout(() => {
      this.canvas = new ConfettiGenerator({ target: this.shadowRoot?.getElementById("wahho_celebrategoodtimescmon_itsacelebration_"), animate: true });
      let textarea = this.shadowRoot?.querySelector('#codetext') as HTMLTextAreaElement; 
      let editor = CodeMirror.fromTextArea(textarea,{
        lineNumbers: true,
        lineWrapping: true,
        theme: 'elegant'
      });
      //editor.setValue('sdfdj'); TODO: perhaps if a default value is passed?
      this.editor = editor;
    })
  }

}

customElements.define('try-polar', TryPolar);
