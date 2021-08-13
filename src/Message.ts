import s from './Message.scss';
import * as CSS from 'csstype';
import { createDom } from './htmlFactory';
import { onceTransitionEnd } from './webAnimationClub';
import { createInlineStyles } from './inlineStyle';

export interface Parameters {
	/**
	 * messageId 不传自动生成 message + 时间戳 + 100以内的随机数
	 * @type {string}
	 * @memberof Parameters
	 */
	id?: string;
	/**
	 * message 层级
	 * @type {number}
	 * @memberof Parameters
	 */
	zIndex?: number;
	/**
	 * message样式
	 * @type {{
	 *         wrap?: CSS.Properties;
	 *         main?: CSS.Properties;
	 *     }}
	 * @memberof Parameters
	 */
	style?: {
		wrap?: CSS.Properties;
		main?: CSS.Properties;
	};
	/**
	 * 出现方位
	 * @type {string}
	 * @memberof Parameters
	 */
	directionFrom?: 'top' | 'bottom';
	/**
	 * 基准文字大小
	 * @type {number}
	 * @memberof Parameters
	 */
	emBase?: number;
}

class Message {
	state: {} & Parameters;
	counter: number;
	deadCounter: number;
	/**
	 *Creates an instance of message.
	 * @param { Object } data
	 * @memberof Message
	 */
	constructor(parameters?: Parameters) {
		const stamp = new Date().getTime();
		const { id, zIndex, style, directionFrom, emBase } = parameters || {};

		this.state = {
			id:
				id ||
				`message${stamp}-${window.Math.floor(
					window.Math.random() * 100
				)}`, // messageId 不传自动生成 message + 时间戳 + 100以内的随机数
			zIndex: zIndex || 10000, // 层级
			style: style || null, // 基础样式
			directionFrom: directionFrom === 'bottom' ? 'bottom' : 'top',
			emBase
		};
		this.counter = 0;
		this.deadCounter = 0;
	}

	/**
	 *
	 *创建message
	 * @param {string} HTMLString 内容
	 * @param {number} time 持续时间
	 * @param {boolean} doNotRemove 是否移除
	 * @memberof Message
	 */
	create = async (content?: string, time?: number) => {
		const { id, zIndex, style, emBase } = this.state;
		const { wrap, main } = style || {};
		this.counter++;
		const currentId = `${id}${this.counter}`;
		const msgItemStyle = createInlineStyles(wrap) || '';
		
		let msgRoot = document.getElementById(id);
		if (!msgRoot) {
			msgRoot = document.createElement('div');
			msgRoot.setAttribute('style', msgItemStyle);
			msgRoot.style.zIndex = `${this.state.zIndex}`;
			msgRoot.classList.add(s.msgroot);
			msgRoot.id = id;
			document.body.append(msgRoot);
		}
		
		await createDom(
			`<div class="${s.message}"
			style="position: "fixed";
				z-index: ${zIndex};
			">
				<div class="${s.messagecontent}" style="${createInlineStyles(main) || ''} position: static;">
					${content}
				</div>
			</div>`,
			currentId,
			null,
			emBase,
			msgRoot,
			this.state.directionFrom
		);

		const MsgDom = document.getElementById(currentId);
		const boxElement: HTMLElement = MsgDom.querySelector(
			`.${s.message}`
		);
		
		boxElement.style.height = `${boxElement.offsetHeight}px`;
		await this.animateAction(boxElement, time);
		boxElement.style.height = "0";
		this.deadCounter++;
		// await removeDom(currentId);
		setTimeout(() => {
			if (this.counter - this.deadCounter <= 0) {
				msgRoot.parentNode.removeChild(msgRoot);
			}
		});
	};

	animateAction = async (element: HTMLElement, time: number) => {
		const directionFromClass =
			this.state.directionFrom === 'top'
				? s.messageshowbottom
				: s.messageshowtop;
		const el: HTMLElement = await new Promise((resolve) => {
			window.setTimeout(() => {
				element.classList.add(directionFromClass);
				resolve(element);
			}, 0);
		});
		const res = onceTransitionEnd(el);
		const result: any = await new Promise((resolve) => {
			window.setTimeout(() => {
				resolve(res);
			}, time || 3000);
		});
		result.target.classList.remove(directionFromClass);
		return onceTransitionEnd(result.target);
	};
}

export default Message;
