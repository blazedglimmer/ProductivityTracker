import { KeyboardEvent } from 'react';

export const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
  if (event.key === 'Enter') {
    const { selectionStart, value } = event.currentTarget;
    const currentLine = value.substring(0, selectionStart).split('\n').pop();
    let match;

    if ((match = currentLine?.match(/^(\d+)([.)])\s/))) {
      event.preventDefault();
      const nextNumber = Number(match[1]) + 1;
      const nextLine = `\n${nextNumber}${match[2]} `;
      insertTextAtCursor(event.currentTarget, nextLine);
    } else if ((match = currentLine?.match(/^([a-z])([.)])\s/))) {
      event.preventDefault();
      const nextChar = String.fromCharCode(match[1].charCodeAt(0) + 1);
      const nextLine = `\n${nextChar}${match[2]} `;
      insertTextAtCursor(event.currentTarget, nextLine);
    } else if (currentLine?.startsWith('* ')) {
      event.preventDefault();
      const nextLine = `\n* `;
      insertTextAtCursor(event.currentTarget, nextLine);
    } else if (currentLine?.startsWith('- ')) {
      event.preventDefault();
      const nextLine = `\n- `;
      insertTextAtCursor(event.currentTarget, nextLine);
    }
  }
};

const insertTextAtCursor = (textarea: HTMLTextAreaElement, text: string) => {
  const { selectionStart, selectionEnd, value } = textarea;
  const newValue =
    value.substring(0, selectionStart) + text + value.substring(selectionEnd);
  textarea.value = newValue;
  autoResizeTextarea(textarea);
  textarea.setSelectionRange(
    selectionStart + text.length,
    selectionStart + text.length
  );
};

export const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
};
