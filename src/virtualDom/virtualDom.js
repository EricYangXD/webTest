// 页面首次全量快照
// 首先你可能会想到，要实现页面全量快照，可以直接使用 outerHTML
const content = document.documentElement.outerHTML;
console.log(content);
// 但是，这里有个问题，使用 outerHTML记录的 DOM 会将把临近的两个 TextNode 合并为一个节点，而我们后续监控 DOM 变化时会使用 MutationObserver，此时你需要大量的处理来兼容这种 TextNode 的合并，不然你在还原操作的时候无法定位到操作的目标节点。


// 在这里我们使用 Virtual DOM 来记录 DOM 结构，把 documentElement 变成 Virtual DOM，记录下来，后面还原的时候重新生成 DOM 即可。
// DOM 转化为 Virtual DOM
// 我们在这里只需要关心两种 Node 类型： Node.TEXT_NODE和 Node.ELEMENT_NODE。
// 同时，要注意，SVG 和 SVG 子元素的创建需要使用 API：createElementNS，
// 所以，我们在记录 Virtual DOM 的时候，需要注意 namespace 的记录.
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const XML_NAMESPACES = ['xmlns', 'xmlns:svg', 'xmlns:xlink'];

function createVirtualDom(element, isSVG = false) {
    switch (element.nodeType) {
        case Node.TEXT_NODE:
            return createVirtualText(element);
        case Node.ELEMENT_NODE:
            return createVirtualElement(element, isSVG || element.tagName.toLowerCase() === 'svg');
        default:
            return null;
    }
}
// Node.TEXT_NODE
function createVirtualText(element) {
    const vText = {
        text: element.nodeValue,
        type: 'VirtualText',
    };
    if (typeof element.__flow !== 'undefined') {
        vText.__flow = element.__flow;
    }
    return vText;
}
// Node.ELEMENT_NODE
function createVirtualElement(element, isSVG = false) {
    const tagName = element.tagName.toLowerCase();
    const children = getNodeChildren(element, isSVG);
    const {
        attr,
        namespace
    } = getNodeAttributes(element, isSVG);
    const vElement = {
        tagName,
        type: 'VirtualElement',
        children,
        attributes: attr,
        namespace,
    };
    if (typeof element.__flow !== 'undefined') {
        vElement.__flow = element.__flow;
    }
    return vElement;
}

function getNodeChildren(element, isSVG = false) {
    const childNodes = element.childNodes ? [...element.childNodes] : [];
    const children = [];
    childNodes.forEach((cnode) => {
        children.push(
            createVirtualDom(cnode, isSVG));
    });
    return children.filter(c => !!c);
}

function getNodeAttributes(element, isSVG = false) {
    const attributes = element.attributes ? [...element.attributes] : [];
    const attr = {};
    let namespace;
    attributes.forEach(({
        nodeName,
        nodeValue
    }) => {
        attr[nodeName] = nodeValue;
        if (XML_NAMESPACES.includes(nodeName)) {
            namespace = nodeValue;
        } else if (isSVG) {
            namespace = SVG_NAMESPACE;
        }
    });
    return {
        attr,
        namespace
    };
}

// 通过以上代码，我们可以将整个 documentElement 转化为 Virtual DOM，
// 其中 __flow 用来记录一些参数，包括标记 ID 等，Virtual Node 记录了：type、attributes、children、namespace。

// Virtual DOM 还原为 DOM
// 将 Virtual DOM 还原为 DOM 的时候就比较简单了，只需要递归创建 DOM 即可，其中 nodeFilter 是为了过滤 script 元素，因为我们不需要 JS 脚本的执行。
function createElement(vdom, nodeFilter = () => true) {
    let node;
    if (vdom.type === 'VirtualText') {
        node = document.createTextNode(vdom.text);
    } else {
        node = typeof vdom.namespace === 'undefined' ? document.createElement(vdom.tagName) : document.createElementNS(vdom.namespace, vdom.tagName);
        for (let name in vdom.attributes) {
            node.setAttribute(name, vdom.attributes[name]);
        }
        vdom.children.forEach((
            cnode
        ) => {
            const childNode = createElement(cnode, nodeFilter);
            if (childNode && nodeFilter(childNode)) {
                node.appendChild(childNode);
            }
        });
    }
    if (vdom.__flow) {
        node.__flow = vdom.__flow;
    }
    return node;
}