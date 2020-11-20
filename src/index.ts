require('./common.scss');
if (window.Promise === undefined) {
	throw new Error('Promise pollyfill not found.');
}

import Message, { Parameters } from './Message';
import { createInlineStyles } from './inlineStyle';
export default Message;
export {createInlineStyles}

export type MessageParameters = Parameters;