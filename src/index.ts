require('./common.scss');
if (window.Promise === undefined) {
	throw new Error('Promise pollyfill not found.');
}

import Message from './Message';
import { createInlineStyles } from './inlineStyle';
export default Message;
export {createInlineStyles}

