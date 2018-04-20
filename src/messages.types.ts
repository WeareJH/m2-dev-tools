import {NodeId, NodeItem} from "./types";

export type A<T, P = any> = {type: T, payload?: P}

export interface ScrapeConfiguration {
    stripComments: boolean
}

export enum KeyCodes {
    Left = 37,
    Up = 38,
    Right = 39,
    Down = 40,
}

export enum Names {
    StripComments = 'strip-comments',
    Scrape = 'scrape',
    Inspect = 'inspect',
    Hover = 'hover',
    RemoveHover = 'remove-hover',
    ParsedComments = 'ParsedComments',
    Ping = 'Ping',
    KeyUp = 'KeyUp',
    DomHover = 'DomHover',
}

export type StripComments = A<Names.StripComments>;
export type Scrape = A<Names.Scrape, ScrapeConfiguration>;
export type Inspect = A<Names.Inspect, boolean>;
export type Hover = A<Names.Hover, string>;
export type RemoveHover = A<Names.RemoveHover, string>;
export type KeyUp = A<Names.KeyUp, KeyCodes>;
export type DomHover = A<Names.DomHover, NodeId>;

export type InjectIncomingActions
    = StripComments
    | Scrape
    | Inspect
    | Hover
    ;

export type ParsedComments = A<Names.ParsedComments, NodeItem[]>;
export type Ping = A<Names.Ping>;

export type InjectOutgoingActions
    = ParsedComments
    | Ping
    | DomHover
    ;

export type PanelOutgoingMessages
    = Hover
    | RemoveHover
    | Inspect
    | Scrape
    | StripComments
    ;

export type PanelIncomingMessages
    = ParsedComments
    | KeyUp
    | Ping
    | DomHover
    ;

export type BackgroundToContent
    = InjectOutgoingActions
    | Hover
    | Scrape
    | Inspect
    | StripComments
    ;

export type BackgroundMessages
    = InjectOutgoingActions
    | PanelOutgoingMessages
    ;
