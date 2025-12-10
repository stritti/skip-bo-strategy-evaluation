/**
 * Skip-Bo Game Types and Interfaces
 */

export interface GameResult {
    id: number;
    winner: string;
    turns: number;
    duration: number;
    starter: string;
    jokers: number;
    strategy: string;
}

export interface LogEntry {
    id: number;
    time: string;
    type: string;
    color: string;
    text: string;
}

export interface PlayCandidate {
    source: string;
    card: number;
    priority: number;
}

export interface Scenario {
    title: string;
    desc: string;
    stacks: {
        label: string;
        value: string;
        styleClass: string;
    }[];
    analysis: string;
}

export interface SimulationApp {
    logEvent: (type: string, text: string) => void;
    tempJokersPlayed: number;
}
