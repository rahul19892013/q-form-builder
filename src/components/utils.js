/* eslint-disable quote-props */
/* eslint-disable no-unreachable */
/* eslint-disable no-labels */
/* eslint-disable no-lone-blocks */
/* eslint-disable eqeqeq */
/* eslint-disable space-unary-ops */
/* eslint-disable semi */
/* eslint-disable arrow-spacing */
/* eslint-disable no-trailing-spaces */
/* eslint-disable space-infix-ops */

export function defaultFieldOptions (type) {
  switch (type) {
    case 'checkboxes':
    case 'radio':
      return { options: [], include_other_option: false, description: '' }
    case 'dropdown':
      return { options: [], description: '' }
    default:
      return { description: '' }
  }
}

export function defaultLabel (type) {
  switch (type) {
    case 'section_break':
      return ''
    default:
      return 'Untitled'
  }
}

export function nl2br (str) {
  return str.replace(/(?:\r\n|\r|\n)/g, '<br>')
}
