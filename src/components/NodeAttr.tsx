import * as React from 'react';

export interface NodeAttrProps {
    data?: any;
    attrName: string;
    dataKey: string;
    searchTerm: string;
}

export class NodeAttr extends React.PureComponent<NodeAttrProps> {
    props: NodeAttrProps;
    render() {
        const {props} = this;
        const {data, attrName, dataKey} = props;
        if (!data) return null;
        if (!data[dataKey]) return null;
        const subjectValue = data[dataKey];

        return (
            <span data-label={`${attrName}:`} className="token--attr-name">
                {wrapValue(subjectValue, props.searchTerm)}
            </span>
        );
    }
}

function wrapValue(value, term) {
    if (!term) return (
        <span className="token token--string">{value}</span>
    );
    const index = value.indexOf(term);
    if (index === -1) return (
        <span className="token token--string">{value}</span>
    );
    const pre = (
        <span>{value.slice(0, index)}</span>
    );
    const match = (
        <span className="token token--search">{value.slice(index, index + term.length)}</span>
    );
    const post = (
        <span>{value.slice(index + term.length)}</span>
    );
    return (
        <span className="token token--string">
            {pre}{match}{post}
        </span>
    )
}
