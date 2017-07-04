import stringifyAttributes from '../utils/stringifyAttributes'
import styles from './styles'
import '../b-icon'

export default block => {
  const inputAttributes = stringifyAttributes({
    name: block.name,
    disabled: block.disabled,
    type: 'checkbox',
    checked: block.checked
  })

  return `
        ${styles}
        <label>
            <input ${inputAttributes} />
            
            <b-input-checkbox__icon unchecked>
              <b-icon>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                  <path d="M0 0h24v24H0z" fill="none"/>
                </svg>
              </b-icon>
            </b-input-checkbox__icon>
    
            <b-input-checkbox__icon checked>
              <b-icon>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0h24v24H0z" fill="none"/>
                  <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </b-icon>
            </b-input-checkbox__icon>
            
            <b-input-checkbox__content>
              <slot></slot>
            </b-input-checkbox__content>
        </label>
    `
}
