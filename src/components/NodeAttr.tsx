import {h} from 'preact';
import {processSourceMaps} from "parcel-plugin-typescript/build/frontend/assets/classes/transpile";

export interface NodeAttrProps {
    data?: {[index: string]: string};
    attrName: string;
    dataKey: string;
    searchTerm: string;
}

export function NodeAttr(props: NodeAttrProps) {
    const {data, attrName, dataKey} = props;
    if (!data) return null;
    if (!data[dataKey]) return null;
    const subjectValue = data[dataKey];

    return (
        <span>
            {' '}
            <span class="token token--attr">{attrName}</span>
            <span class="token token--attr">=</span>
            <span class="token token--string">
                {wrapValue(subjectValue, props.searchTerm)}
            </span>
        </span>
    );
}

function wrapValue(value, term) {
    if (!term) return (
        <span class="token token--string">{value}</span>
    );
    const index = value.indexOf(term);
    if (index === -1) return (
        <span class="token token--string">{value}</span>
    );
    const pre = (
        <span>{value.slice(0, index)}</span>
    );
    const match = (
        <span class="token token--search">{value.slice(index, index + term.length)}</span>
    );
    const post = (
        <span>{value.slice(index + term.length)}</span>
    );
    return (
        <span class="token token--string">
            {pre}{match}{post}
        </span>
    )
}