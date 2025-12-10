import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { GameResult } from '../game/types';

export interface SimulationRun {
    id?: number;
    timestamp: number;
    gamesCount: number;
    winsP1: number;
    winsP2: number;
    strategyP1: string;
    strategyP2: string;
    totalTurns: number;
    totalJokers: number;
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
    private dbPromise: Promise<IDBPDatabase<SkipBoSimDB>>;

    constructor() {
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
        });
    }

    async saveRun(run: SimulationRun): Promise<number> {
        const db = await this.dbPromise;
        return db.add('simulationRuns', run);
    }

    async getAllRuns(): Promise<SimulationRun[]> {
        const db = await this.dbPromise;
        return db.getAllFromIndex('simulationRuns', 'by-date');
    }

    async clearHistory(): Promise<void> {
        const db = await this.dbPromise;
        await db.clear('simulationRuns');
    }
}

export const dbService = new DBService();
