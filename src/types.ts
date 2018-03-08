export interface NodeItem {
    name: string
    json?: string
    data?: INodeData
    children: NodeItem[]
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
