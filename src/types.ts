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
