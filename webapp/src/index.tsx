import * as React from 'react'
import { render } from 'react-dom'

import './index.scss'

import { Root } from './root'

render(<Root />, document.querySelector('client-root'))

/** Allow to reload CSS with Ctrl+F12 - originally only for developers but actually does not harm anything. */
const css: HTMLLinkElement = document.querySelector('head > link[rel="stylesheet"][href="index.css"]')

// eslint-disable-next-line no-self-assign
document.addEventListener('keydown', (ev: KeyboardEvent) => ev.ctrlKey && ev.key === 'F12' && (css.href = css.href))
