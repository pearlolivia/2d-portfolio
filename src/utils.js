export const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
       (navigator.maxTouchPoints > 0) ||
       (navigator.msMaxTouchPoints > 0));
}

export const displayDialogue = (text, onDisplayEnd) => {
    const dialogueUI = document.getElementById('textbox-container');
    const dialogue = document.getElementById('dialogue');

    dialogueUI.style.display = 'block';

    let index = 0;
    let currentText = '';
    const intervalRef = setInterval(() => {
        if (index < text.length) {
            currentText += text[index];
            dialogue.innerHTML = currentText;
            index++;
            return;
        }
        clearInterval(intervalRef);
    }, 5);

    const closeBtn = document.getElementById('close-btn');

    const onClose = () => {
        onDisplayEnd();
        dialogueUI.style.display = 'none';
        dialogue.innerHTML = '';
        clearInterval(intervalRef);
        if (isTouchDevice) {
            closeBtn.removeEventListener('click', onClose);
        } else {
            document.removeEventListener('keypress', onClose);
        }
    }
    
    if (isTouchDevice()) {
       closeBtn.addEventListener('click', onClose);
    } else {
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                onClose();
            }
        });
    }
}

export const setCamScale = (k) => {
    const resizeFactor = k.width() / k.height();
    if (resizeFactor < 1) {
        k.camScale(k.vec2(1));
    } else {
        k.camScale(k.vec2(1.5));
    }
}