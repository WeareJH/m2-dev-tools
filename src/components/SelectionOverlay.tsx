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
    return (
        <div className="info-window">
            <button
                type="button"
                onClick={() => props.toggleSelectionOverlay(false)}
            >
                Close
            </button>
            <pre><code>codex here</code></pre>
        </div>
    )
}