const config = {
    columns: 9,
    rows: 6,
    mixedPieces: [],
    activePiece: null
};

function initField() {
    const fieldContainer = document.querySelector('.result__field');

    Array.from({ length: config.rows }).forEach((_, rowIndex) => {
        const row = createElement('div', 'field__row', fieldContainer);

        Array.from({ length: config.columns }).forEach(() => {
            const block = createElement('div', 'field__block', row);

            addDragEvents(block);
        });
    });
}

function initMixedPieces() {
    const mixedContainer = document.querySelector('.container__mixed-pieces');
    let counter = 0;

    Array.from({ length: config.rows }).forEach((_, rowIndex) => {
        Array.from({ length: config.columns }).forEach((_, colIndex) => {
            counter++;
            const piece = createElement('div', 'field__mixed-block', mixedContainer, {
                position: 'absolute',
                top: `${randomPosition()}px`,
                left: `${randomPosition()}px`,
                backgroundPosition: `${-colIndex * 50}px ${-rowIndex * 50}px`
            });

            piece.setAttribute('data', counter);
            piece.draggable = true;

            piece.addEventListener('dragstart', onDragStart);
            piece.addEventListener('dragend', onDragEnd);
        });
    });
}

function addDragEvents(block) {
    block.addEventListener('dragover', (e) => e.preventDefault());

    block.addEventListener('dragenter', (e) => {
        e.preventDefault();
        block.classList.add('hovered');
    });

    block.addEventListener('dragleave', () => block.classList.remove('hovered'));

    block.addEventListener('drop', () => {
        if (block.childNodes.length === 0 && config.activePiece) {
            config.activePiece.style.position = "";
            config.activePiece.style.zIndex = 0;

            block.append(config.activePiece);
            block.classList.remove('hovered');

            checkWinCondition();
        }
    });
}

function createElement(tag, className, parent, style = {}) {
    const element = document.createElement(tag);
    element.className = className;

    Object.assign(element.style, style);
    parent && parent.appendChild(element);

    return element;
}

function randomPosition() {
    return Math.floor(Math.random() * 550) + 75;
}

function onDragStart(e) {
    config.activePiece = e.target;
    config.activePiece.style.zIndex = 1;

    e.dataTransfer.setData('text/html', 'dragstart');
    config.offsetX = e.offsetX;
    config.offsetY = e.offsetY;
}

function onDragEnd(e) {
    if (config.activePiece) {
        config.activePiece.style.top = `${e.pageY - config.offsetY}px`;
        config.activePiece.style.left = `${e.pageX - config.offsetX}px`;
    }
}

function checkWinCondition() {
    const rows = document.querySelectorAll('.field__row');
    let counter = 1;
    let isComplete = true;

    rows.forEach(row => {
        const blocks = row.childNodes;
        blocks.forEach(block => {
            if (block.childNodes.length > 0) {
                const piece = block.firstChild;
                if (piece.getAttribute('data') !== `${counter}`) {
                    isComplete = false;
                }
                counter++;
            } else {
                isComplete = false;
            }
        });
    });

    if (isComplete) displayWinMessage();
}

function displayWinMessage() {
    const winMessage = document.querySelector('.win');
    winMessage.style.display = 'block';
}

initMixedPieces();
initField();