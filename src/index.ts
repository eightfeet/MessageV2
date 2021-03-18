if (window.Promise === undefined) {
	throw new Error('Promise pollyfill not found.');
}

import Message, { Parameters } from './Message';
import { createInlineStyles } from './inlineStyle';
import saferInnerHtml from './saferInnerHtml';
export default Message;
export {createInlineStyles, saferInnerHtml}

export type MessageParameters = Parameters;