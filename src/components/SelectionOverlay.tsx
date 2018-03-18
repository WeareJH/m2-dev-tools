import * as React from 'react';
import {NodeMetaData} from "../utils";

interface SelectionOverlayProps {
    getItem(): NodeMetaData,
    visible: boolean
    toggleSelectionOverlay(checked: boolean): void
}
export function SelectionOverlay(props: SelectionOverlayProps) {
    if (!props.visible) {
        return null;
    }
    const item = props.getItem();
    return (
        <div className="info-window">
            <div className="info-window__controls">
                <button
                    type="button"
                    onClick={() => props.toggleSelectionOverlay(false)}
                >
                    Close
                </button>
            </div>
            <div className="info-window__path">
                {item.node && item.node.namePath.map((x) => (
                        <span className="info-window__segment" key={x}>{x}</span>
                    )
                )}
            </div>
            {Object.keys(item.data)
                .filter(x => x !== 'args')
                .map(key => {
                return (
                    <p key={key}>
                        <span className="token">{key}:{' '}</span>
                        <span className="token token--string">{item.data[key]}</span>
                    </p>
                )
            })}
            <pre><code>{JSON.stringify(item.data.args, null, 2)}</code></pre>
        </div>
    )
}