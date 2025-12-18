/**
 * Skip-Bo Game Types and Interfaces
 */

export type Strategy = 'Optimiert' | 'Zufall' | 'Spontan' | 'Fortgeschritten';

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

export interface MoveOption {
    source: string;          // 'stockpile', 'hand', or 'discard-N'
    card: number;            // Card value (0-12)
    buildPileIndex: number;  // Which build pile to play on (0-3)
    priority: number;        // 3=Stockpile, 2=Hand, 1=Discard
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
