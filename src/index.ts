import * as tedious from 'tedious';

export enum ISOLATION_LEVEL {
    NO_CHANGE = tedious.ISOLATION_LEVEL.NO_CHANGE,
    READ_UNCOMMITTED = tedious.ISOLATION_LEVEL.READ_UNCOMMITTED,
    READ_COMMITTED = tedious.ISOLATION_LEVEL.READ_COMMITTED,
    REPEATABLE_READ = tedious.ISOLATION_LEVEL.REPEATABLE_READ,
    SERIALIZABLE = tedious.ISOLATION_LEVEL.SERIALIZABLE,
    SNAPSHOT = tedious.ISOLATION_LEVEL.SNAPSHOT
};

export class Connection {
    private config: tedious.ConnectionConfig;
    private connection: tedious.Connection;

    constructor(config: tedious.ConnectionConfig) {
        this.config = config;

        if (config.options === undefined)
            config.options = {};
        config.options.rowCollectionOnRequestCompletion = true;

        this.connection = new tedious.Connection(config);
    }

    public async connect(): Promise<void> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.connection.connect((err) => {
                if (err)
                    reject(err);
                else {
                    resolve();
                }
            });
        });
    }

    public async close(): Promise<void> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.connection.on('end', () => {
                resolve();
            });

            self.connection.close();
        });
    }

    public async reset(): Promise<void> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.connection.reset((err) => {
                if (err)
                    reject(err);
                else {
                    resolve();
                }
            });
        });
    }

    public async beginTransaction(name?: string, isolationLevel?: ISOLATION_LEVEL): Promise<void> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.connection.beginTransaction((err) => {
                if (err)
                    reject(err);
                else {
                    resolve();
                }
            }, name, isolationLevel as (tedious.ISOLATION_LEVEL | undefined))
        });
    }

    public async commitTransaction(name?: string): Promise<void> {
        const self = this;
        return new Promise((resolve, reject) => {
            (self.connection as any).commitTransaction((err : Error) => {
                if (err)
                    reject(err);
                else {
                    resolve();
                }
            }, name);
        });
    }

    public async rollbackTransaction(name?: string) : Promise<void> {
        const self = this;
        return new Promise((resolve, reject) => {
            (self.connection as any).rollbackTransaction((err : Error) => {
                if (err)
                    reject(err);
                else {
                    resolve();
                }
            }, name);
        });
    }

    public async saveTransaction(name?: string) : Promise<void> {
        const self = this;
        return new Promise((resolve, reject) => {
            (self.connection as any).saveTransaction((err : Error) => {
                if (err)
                    reject(err);
                else {
                    resolve();
                }
            }, name);
        });
    }
}