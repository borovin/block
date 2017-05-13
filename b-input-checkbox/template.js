const stringifyAttributes = require('../utils/stringifyAttributes');

module.exports = block => {
    const inputAttributes = stringifyAttributes({
        name: block.name,
        disabled: block.disabled,
        type: 'checkbox',
        checked: block.getAttribute('checked')
    });

    return `
        <label>

            <input ${inputAttributes} />
    
            <b-input-checkbox--icon>
                <svg viewBox="0 0 24 24">
                    <path d="M9 16.17l-4.17-4.17-1.415 1.415 5.585 5.585 12-12-1.415-1.415z"/>
                </svg>
            </b-input-checkbox--icon>
    
            ${block.label ? `<b-input-checkbox--text>${block.label}</b-input-checkbox--text>` : ''}
    
        </label>
    `;
};