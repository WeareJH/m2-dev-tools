import * as React from 'react';
import {NodeId} from "../types";

export interface NodeToggleProps {
    toggle(id: string): void
    id: NodeId;
    isSelected: boolean
    isCollapsed: boolean
}

export class NodeToggle extends React.PureComponent<NodeToggleProps> {
    props: NodeToggleProps;
    render() {
        return (
            <button
                className="node__toggle"
                type="button"
                onClick={(e) => {
                    // don't let toggles propagate to node line
                    e.preventDefault();
                    e.stopPropagation();
                    this.props.toggle(this.props.id)
                }}
            >
                <svg
                    className="arrow"
                    height="7"
                    fill={this.props.isSelected ? 'white' : 'black'}
                    viewBox="0 0 50 50"
                    transform={`${this.props.isCollapsed ? 'rotate(-90)' : ''}`}
                    id="canvas">
                    <polygon points="0,0 50,0 25.0,43.3"></polygon>
                </svg>
            </button>
        )
    }
}
