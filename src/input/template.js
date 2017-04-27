const stringifyAttributes = require('../utils/stringifyAttributes');

module.exports = block => {
    const label = block.label ? `<b-input-label>${block.label}</b-input-label>` : '';

    const inputAttributes = stringifyAttributes({
        value: block.value,
        type: block.type,
        placeholder: block.placeholder,
        name: block.name,
        autofocus: block.autofocus,
        disabled: block.disabled
    });

    return `
        <input ${inputAttributes} />
        
        <b-input-border></b-input-border>
        
        ${label}
    `;
};