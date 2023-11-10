// ==UserScript==
// @name         Take a Hint!
// @version      1.3
// @description  Page hinting script for keyboard navigation
// @author       Konrad Słotwiński
// @source       https://github.com/kgslotwinski
// @match        *://*/*
// @icon         data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="64" height="64" viewBox="0 0 2048 2048"%3E%3Cg transform="translate(2048 0) scale(-1 1)"%3E%3Cpath fill="%233f0" d="M2048 256v384h-128V384H128v1152h896v128H0V256h2048zm-512 384q106 0 199 40t163 109t110 163t40 200q0 106-38 195t-111 166l-32 34q-12 13-25 29t-23 36t-17 38t-7 38v168q0 41-15 76t-42 62t-62 41t-76 16h-128q-41 0-76-15t-62-42t-41-61t-16-77v-168q-1-25-11-49t-25-46t-33-42t-35-38q-72-76-110-165t-39-196q0-106 40-199t109-163t163-110t200-40zm125 1155h-250v61q0 25 18 43t43 18h128q25 0 43-18t18-43v-61zm9-134q10-57 32-98t50-76t57-66t54-69t41-85t16-115q0-80-30-150t-82-122t-122-82t-150-30q-80 0-150 30t-122 82t-82 122t-30 150q0 76 29 147t83 128q27 27 49 52t40 53t30 58t19 71h268z"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E
// @downloadURL  https://raw.githubusercontent.com/kgslotwinski/browser-scripts/main/tampermonkey/take-a-hint.js
// @updateURL    https://raw.githubusercontent.com/kgslotwinski/browser-scripts/main/tampermonkey/take-a-hint.js
// ==/UserScript==

(function () {
  'use strict'
  const letters = [...Array(26).keys()]
    .map((n) => String.fromCharCode(97 + n))

  const hintEnableKey = 'q'
  const selectTimeout = 500
  const className = 'tah'
  const selectors = [
    'a',
    'button',
    'input',
    '[onclick]:not([onclick=""])',
    '[role="tab"]',
    '[role="button"]',
    '[role="link"]',
  ]

  // eslint-disable-next-line no-undef
  const stylesheet = new CSSStyleSheet()
  stylesheet.replaceSync(`.${className}::before {
      content: attr(data-${className});
      background: #33ff00;
      border-radius: 5px;
      color: #000;
      font-family: monospace;
      font-size: 12px;
      font-weight: bold;
      height: fit-content;
      line-height: normal;
      max-height: fit-content;
      max-width: fit-content;
      min-height: fit-content;
      min-width: fit-content;
      opacity: 0.9;
      padding: 1px 5px;
      position: absolute;
      text-transform: uppercase;
      transform: translateX(60%);
      width: fit-content;
      z-index: 999;
      }`)
  document.adoptedStyleSheets.push(stylesheet)

  const hints = {}
  let hintSelect = ''
  let hintSelectTimeout

  const getHintKey = (index, hintKey = '') => {
    const letterIndex = index % letters.length
    hintKey = `${letters[letterIndex]}${hintKey}`

    if (index >= letters.length) {
      hintKey = getHintKey(Math.floor(index / letters.length) - 1, hintKey)
    }

    return hintKey
  }

  const showHints = () => Array.from(document.querySelectorAll(selectors.join(', ')))
    .forEach(el => {
      if (el.offsetWidth || el.offsetHeight || el.getClientRects().length) {
        const hintKey = getHintKey(Object.keys(hints).length)

        el.classList.add(className)
        el.setAttribute(`data-${className}`, hintKey)
        hints[hintKey] = el
      }
    })

  const clearState = () => {
    hintSelect = ''
    hintSelectTimeout && clearTimeout(hintSelectTimeout)

    Object.keys(hints).forEach(key => {
      hints[key].classList.remove(className)
      hints[key].removeAttribute(`data-${className}`)
      delete hints[key]
    })
  }

  document.addEventListener('keyup', ({ key, ctrlKey }) => {
    if (key === hintEnableKey && ctrlKey) {
      clearState()
      showHints()
    } else if (key === 'Escape') {
      clearState()
    } else if (letters.includes(key) && !ctrlKey) {
      hintSelect = `${hintSelect}${key}`
      hintSelectTimeout && clearTimeout(hintSelectTimeout)
      hintSelectTimeout = setTimeout(() => {
        if (hints[hintSelect]) {
          hints[hintSelect].click()
          clearState()
        } else {
          hintSelect = ''
        }
      }, selectTimeout)
    }
  })
})()
