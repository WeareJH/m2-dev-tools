import {h} from 'preact';

export function NodeAttr(props: {data: any, attrName: string, dataKey: string}) {
    const {data, attrName, dataKey} = props;
    if (!data) return null;
    if (!data[dataKey]) return null;
    return (
        <span>
            {' '}
            <span class="token token--attr">{attrName}</span>
            <span class="token token--attr">=</span>
            <span class="token token--string">{data[dataKey]}</span>
        </span>
    );
}
