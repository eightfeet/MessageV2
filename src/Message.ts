import s from './Message.scss';
import * as CSS from 'csstype';
import { createDom, removeDom } from './htmlFactory';
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
     * 父级Id
     * @type {string}
     * @memberof Parameters
     */
    parentId?: string;
    /**
     * 基准文字大小
     * @type {number}
     * @memberof Parameters
     */
    emBase?: number;
    /**
     * 是否显示
     */
    display?: boolean;
}


function getMsgTopAndBottom(topPos: string, bottomPos: string) {
	let top = topPos || 'auto';
	let bottom = bottomPos || 'auto';

	const defauleOffset = '30px';

	if (top ==='auto' && bottom === 'auto' ) {
		top = defauleOffset;
	}
	return {top, bottom };
}

class Message {
    state: {} & Parameters;
    /**
     *Creates an instance of message.
     * @param { Object } data
     * @memberof Message
     */
    constructor(parameters?: Parameters) {
        const stamp = new Date().getTime();
        const { id, zIndex, style, directionFrom, parentId, emBase } = parameters || {};

        this.state = {
            id:
                id ||
                `message${stamp}-${window.Math.floor(
                    window.Math.random() * 100
                )}`, // messageId 不传自动生成 message + 时间戳 + 100以内的随机数
            zIndex: zIndex || 10000, // 层级
            style: style || null, // 基础样式
            directionFrom,
            parentId,
            emBase,
            display: false,
        };
    }

    /**
     *
     *创建message
     * @param {string} HTMLString 内容
     * @param {number} time 持续时间
     * @param {boolean} doNotRemove 是否移除
     * @memberof Message
     */
    create = async (content?: string, time?: number, doNotRemove?: boolean) => {
        const { id, zIndex, parentId, style, emBase } = this.state;
        const parentIdDom = document.getElementById(parentId);
        const { wrap, main } = style || {};
        let messageElement = document.getElementById(id);
        if (messageElement) {
            this.show(content, time);
            console.warn('已创建message时 message.create === message.show');
            return Promise.resolve();
        }

        const { top, bottom, ...other } = wrap || {};
        const msgPosition = getMsgTopAndBottom((top as string), (bottom as string));
        if (!this.state.display) {
            await createDom(
                `<div class="${s.wrap}"><div class="${s.message}"
                style="position: ${parentIdDom ? 'absolute' : 'fixed'}; ${createInlineStyles(other) || ''}
                    top:${msgPosition.top}; bottom:${msgPosition.bottom};
                    z-index: ${zIndex};
                ">
                    <div class="${s.messagecontent}" style="${createInlineStyles(main) || ''} position: static;">
                        ${content}
                    </div>
                </div></div>`,
                id,
                parentId,
                emBase
            );
        }
        this.state.display = true;
        
        messageElement = document.getElementById(id);
        const boxElement: HTMLElement = messageElement.querySelector(
            `.${s.message}`
        );
        await this.animateAction(boxElement, time);
        await this.hide(doNotRemove);
        this.state.display = false;
    };

    protected animateAction = async (element: HTMLElement, time: number) => {
        const directionFromClass =
            this.state.directionFrom === 'top'
                ? s.messageshowbottom
                : s.messageshowtop;
        const el: HTMLElement = await new Promise((resolve) => {
            window.setTimeout(() => {
                element.classList.add(directionFromClass);
                resolve(element);
            }, 10);
        });
        const res = onceTransitionEnd(el);
        const result: any = await new Promise((resolve) => {
            window.setTimeout(() => {
                resolve(res);
            }, (time || 3000));
        });
        result.target.classList.remove(directionFromClass);
        return onceTransitionEnd(result.target);
    };

    /**
     *
     * @description 移除message
     * @memberof Message
     */
    protected remove = () => {
        if (!document.getElementById(this.state.id)) {
            throw '未创建Message';
        }
        return removeDom(this.state.id);
    };


    /**
     *
     * 显示message
     * @param {string} content 内容
     * @param {number} time 时间
     * @memberof Message
     */
    protected show = (content?: string, time?: number) => {
        const { id } = this.state;
        const messageElement = document.getElementById(id);
        if (!messageElement) {
            throw '未创建Message';
        }
        const boxElement: HTMLElement = messageElement.querySelector(`.${s.message}`);
        const contentElement = messageElement.querySelector(
            `.${s.messagecontent}`
        );
        contentElement.innerHTML = content;
        return this.animateAction(boxElement, time);
    };

    /**
     *
     * @description 隐藏message
     * @memberof Message
     */
    protected unvisible = async () => {
        const { id, directionFrom } = this.state;
        const directionFromClass =
            directionFrom === 'top' ? s.messageshowbottom : s.messageshowtop;
        const messageElement = document.getElementById(id);
        const boxElement_1: HTMLElement = await new Promise((resolve, reject) => {
            const boxElement: HTMLElement = messageElement.querySelector(`.${s.message}`);
            if (!messageElement) {
                reject('未创建Message');
                return;
            }
            boxElement.classList.remove(directionFromClass);
            resolve(boxElement);
        });
        return onceTransitionEnd(boxElement_1);
    };

    /**
     * @description 隐藏或移除message
     * @param {Boolean} doNotRemove 是否移除message，doNotRemove=true时仅隐藏当前message而不移除当前messageDom
     * @memberof Message
     */
    protected hide = (doNotRemove) => {
        if (doNotRemove === true) {
            return this.unvisible();
        }
        return this.remove();
    };
}

export default Message;
