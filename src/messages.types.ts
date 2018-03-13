import {NodeItem} from "./types";

export type A<T, P = any> = {type: T, payload?: P}

export namespace Msg {

    export enum Names {
        StripComments = 'strip-comments',
        Scrape = 'scrape',
        Inspect = 'inspect',
        Hover = 'hover',
        RemoveHover = 'remove-hover',
        ParsedComments = 'ParsedComments',
        Ping = 'Ping',
    }

    export type StripComments = A<Names.StripComments>;
    export type Scrape = A<Names.Scrape>;
    export type Inspect = A<Names.Inspect, boolean>;
    export type Hover = A<Names.Hover, string>;
    export type RemoveHover = A<Names.RemoveHover, string>;

    export type InjectIncomingActions
        = StripComments
        | Scrape
        | Inspect
        | Hover;

    export type ParsedComments = A<Names.ParsedComments, NodeItem[]>;
    export type Ping = A<Names.Ping>;

    export type InjectOutgoingActions
        = ParsedComments
        | Ping;

    export type PanelOutgoingMessages
        = Hover
        | RemoveHover
        | Inspect;

    export type PanelIncomingMessages
        = ParsedComments;

    export type BackgroundToContent
        = InjectOutgoingActions
        | Hover
        | Scrape
        | Inspect;

    export type BackgroundMessages
        = InjectOutgoingActions
        | PanelOutgoingMessages
}