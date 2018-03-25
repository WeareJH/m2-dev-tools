import * as React from 'react';
import {NodeId} from "../types";

export interface NodeInfoButtonProps {
    showOverlay(id: NodeId): void
    id: NodeId;
}

export class NodeInfoButton extends React.PureComponent<NodeInfoButtonProps> {
    props: NodeInfoButtonProps;
    render() {
        return (
            <button
                className="node__meatball"
                type="button"
                onClick={() => this.props.showOverlay(this.props.id)}
            />
        )
    }
}
