import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { GameResult } from '../game/types';

export interface SimulationRun {
    id?: number;
    shared?: boolean;
    version?: number;
    file?: string;
    timestamp: number;
    gamesCount: number;
    winsP1: number;
    winsP2: number;
    strategyP1: string;
    strategyP2: string;
    totalTurns: number;
    totalJokers: number;
    ties?: number;
    seed?: number;
    results: GameResult[];
}

interface SkipBoSimDB extends DBSchema {
    simulationRuns: {
        key: number;
        value: SimulationRun;
        indexes: { 'by-date': number };
    };
}

const DB_NAME = 'skip-bo-sim-db';
const DB_VERSION = 1;

class DBService {
    private dbPromise: Promise<IDBPDatabase<SkipBoSimDB> | null>;

    constructor() {
        try {
            this.dbPromise = openDB<SkipBoSimDB>(DB_NAME, DB_VERSION, {
                upgrade(db) {
                    if (!db.objectStoreNames.contains('simulationRuns')) {
                        const store = db.createObjectStore('simulationRuns', {
                            keyPath: 'id',
                            autoIncrement: true,
                        });
                        store.createIndex('by-date', 'timestamp');
                    }
                },
            }).catch(() => null);
        } catch {
            this.dbPromise = Promise.resolve(null);
        }
    }

    async saveRun(run: SimulationRun): Promise<number | null> {
        const db = await this.dbPromise;
        if (!db) return null;
        return db.add('simulationRuns', run);
    }

    async getAllRuns(): Promise<SimulationRun[]> {
        const db = await this.dbPromise;
        if (!db) return [];
        return db.getAllFromIndex('simulationRuns', 'by-date');
    }

    async clearHistory(): Promise<void> {
        const db = await this.dbPromise;
        if (!db) return;
        await db.clear('simulationRuns');
    }
}

export const dbService = new DBService();
