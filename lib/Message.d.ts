import * as CSS from 'csstype';
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
}
declare class Message {
    state: {} & Parameters;
    display: boolean;
    /**
     *Creates an instance of message.
     * @param { Object } data
     * @memberof Message
     */
    constructor(parameters?: Parameters);
    /**
     *
     *创建message
     * @param {string} HTMLString 内容
     * @param {number} time 持续时间
     * @param {boolean} doNotRemove 是否移除
     * @memberof Message
     */
    create: (content?: string, time?: number, doNotRemove?: boolean) => Promise<void>;
    protected animateAction: (element: HTMLElement, time: number) => Promise<any>;
    /**
     *
     * @description 移除message
     * @memberof Message
     */
    protected remove: () => Promise<void>;
    /**
     *
     * 显示message
     * @param {string} content 内容
     * @param {number} time 时间
     * @memberof Message
     */
    protected show: (content?: string, time?: number) => Promise<any>;
    /**
     *
     * @description 隐藏message
     * @memberof Message
     */
    protected unvisible: () => Promise<any>;
    /**
     * @description 隐藏或移除message
     * @param {Boolean} doNotRemove 是否移除message，doNotRemove=true时仅隐藏当前message而不移除当前messageDom
     * @memberof Message
     */
    protected hide: (doNotRemove: any) => Promise<any>;
}
export default Message;
