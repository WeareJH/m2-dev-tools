import {h} from 'preact';
import {NodeItem} from "../types";
import {NodeAttr} from "./NodeAttr";
const classnames = require('classnames');

export interface NodeInfoProps {
    node: NodeItem,
    indent: number,
    isSelected: boolean,
    isCollapsed: boolean,
    hasChildren: boolean,
    searchTerm: string,
    toggle(name: string): void,
    addHover(name: string): void,
    removeHover(name: string): void
}

export function NodeHead(props: NodeInfoProps) {
    const {node, indent, addHover, removeHover, hasChildren, isCollapsed} = props;
    const classes = classnames({
        node_info: true,
        'node_info--hovered': this.props.isSelected
    });
    const nodeName = node.data && node.data.type;
    return (
        <div style={{paddingLeft: String(indent) + 'px'}}
             class={classes}
             onMouseLeave={() => removeHover(node.name)}
             onMouseEnter={() => addHover(node.name)}>
            <p class="node__line">
                {hasChildren && (
                    <button
                        class="node__toggle"
                        type="button"
                        onClick={() => props.toggle(node.name)}
                    >
                        <svg
                            class="arrow"
                            height="6"
                            viewBox="0 0 50 50"
                            transform={`${isCollapsed ? '' : 'rotate(-180)'}`}
                            id="canvas">
                            <polygon points="0,0 50,0 25.0,43.3" style="fill:000000"></polygon>
                        </svg>
                    </button>
                )}
                <span class="token lt">&lt;</span>
                <span class="token">{nodeName}</span>
                <NodeAttr
                    data={node.data}
                    dataKey={'name'}
                    attrName={'name'}
                    searchTerm={props.searchTerm}
                />
                <NodeAttr
                    data={node.data}
                    dataKey={'template_file'}
                    attrName={'template'}
                    searchTerm={props.searchTerm}
                />
                {!hasChildren && (
                    <span class="token gt">{' /'}</span>
                )}
                <span class="token gt">&gt;</span>
                <span class="token token--icon">
                    {node.hasRelatedElement && (
                        <SyncIcon />
                    )}
                </span>
            </p>
            <div class="node__props">
                {node.data && Object.keys(node.data).map(key => {
                    const value = node.data[key];
                    if (typeof value === 'string') {
                        return (
                            <p>
                                <span class="token token--key">{key}:</span>
                                {' '}
                                <span class="token token--value">{node.data[key]}</span>
                            </p>
                        )
                    }
                })}
            </div>
        </div>
    )
}

function SyncIcon() {
    return (
        <svg height="10px" version="1.1" viewBox="0 0 16 16" >
            <g fill="none" fill-rule="evenodd" id="Icons with numbers" stroke="none" stroke-width="1">
                <g fill="#000000" id="Group" transform="translate(-288.000000, -144.000000)">
                    <path d="M296,158 C298.973001,158 301.440972,155.837706 301.917042,153 L303.938106,153 C303.446016,156.946304 300.079623,160 296,160 C293.310983,160 290.931833,158.673299 289.481412,156.63876 L288,158 L288,153 L288.061894,153 L290.082958,153 L293.441406,153 L290.969469,155.271414 C292.039897,156.914078 293.893133,158 296,158 Z M301.917042,151 L301,151 L299,151 L301.123754,148.876298 C300.069891,147.151341 298.169401,146 296,146 C293.026999,146 290.559028,148.162294 290.082958,151 L288.061894,151 C288.553984,147.053696 291.920377,144 296,144 C298.719979,144 301.122913,145.357428 302.568307,147.43178 L304,146.000122 L304,151 L303.938106,151 Z M301.917042,151"/>
                </g>
            </g>
        </svg>
    )
}