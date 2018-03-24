export type NodeId = string;
export type NodePath = (string|number)[];
export interface NodeItem {
    name: string
    json?: string
    data?: INodeData
    children: NodeItem[]
    hasRelatedElement: boolean;
    path: NodePath | null;
    id: NodeId;
}
export type NodeItems = {[id: string]: NodeItemShort}
export interface NodeItemShort {
    path: NodePath,
    id: NodeId,
    children: string[],
    parent: NodeId
    index: number,
    namePath: {name: string, type: string}[]
}

interface INodeData {
    name: string;
    type: string;
    block_type?: string;
    template?: string;
    template_file?: string;
    args?: IArgs;
}

interface IArgs {
    type: string;
    module_name: string;
}
