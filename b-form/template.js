module.exports = block => {
    return `
        <form>
            ${block.content}
        </form>
    `;
};