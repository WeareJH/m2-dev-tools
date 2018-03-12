export type A<T, P = any> = {type: T, payload?: P}

export namespace Msg {
    export enum Names {
        StripComments = 'strip-comments',
        Scrape = 'scrape',
        Inspect = 'inspect',
        Hover = 'hover',
    }
    export type StripComments = A<Names.StripComments>;
    export type Scrape = A<Names.Scrape>;
    export type Inspect = A<Names.Inspect, boolean>;
    export type Hover = A<Names.Hover, boolean>;

    export type InjectActions
        = StripComments
        | Scrape
        | Inspect
        | Hover;
}