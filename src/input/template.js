module.exports = block => {
    const value = block.value ? `value="${block.value}"` : '';
    const label = block.label ? `<label>${block.label}</label>` : '';
    const placeholder  = block.placeholder ? `placeholder="${block.placeholder}"` : '';
    const name  = block.name ? `name="${block.name}"` : '';

    return `
        <input
            type="${block.type}"
            ${value}
            ${placeholder}
            ${name}
            ${block.autofocus ? 'autofocus' : ''}
            ${block.disabled ? 'disabled' : ''} />
        
        <border></border>
        
        ${label}
    `;
};