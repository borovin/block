const stringifyAttributes = require('../utils/stringifyAttributes');

module.exports = block => {
    const inputAttributes = stringifyAttributes({
        value: block.value,
        name: block.name,
        disabled: block.disabled,
        type: 'radio',
        checked: block.checked
    });

    return `
        <label>

            <input ${inputAttributes}/>
    
            <b-input-radio--icon></b-input-radio--icon>
    
            ${block.label ? `<b-input-radio--text>${block.label}</b-input-radio--text>` : ''}
        
        </label>
    `;
};