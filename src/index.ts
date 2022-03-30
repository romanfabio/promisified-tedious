import * as tedious from 'tedious';

export const TYPES = tedious.TYPES;

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
            const clean = () => {
                self.connection.removeAllListeners('end').removeAllListeners('error');
            }
            
            self.connection.on('end', () => {
                clean(); resolve();
            });
            self.connection.on('error', (err) => {
                clean(); reject(err);
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

    public async beginTransaction(name = '', isolationLevel?: ISOLATION_LEVEL): Promise<void> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.connection.beginTransaction((err) => {
                if (err)
                    reject(err);
                else {
                    resolve();
                }
            }, name, (isolationLevel as unknown) as (tedious.ISOLATION_LEVEL))
        });
    }

    public async commitTransaction(name = ''): Promise<void> {
        const self = this;
        return new Promise((resolve, reject) => {
            (self.connection as any).commitTransaction((err: Error) => {
                if (err)
                    reject(err);
                else {
                    resolve();
                }
            }, name);
        });
    }

    public async rollbackTransaction(name = ''): Promise<void> {
        const self = this;
        return new Promise((resolve, reject) => {
            (self.connection as any).rollbackTransaction((err: Error) => {
                if (err)
                    reject(err);
                else {
                    resolve();
                }
            }, name);
        });
    }

    public async saveTransaction(name: string): Promise<void> {
        const self = this;
        return new Promise((resolve, reject) => {
            (self.connection as any).saveTransaction((err: Error) => {
                if (err)
                    reject(err);
                else {
                    resolve();
                }
            }, name);
        });
    }

    public execSql(request: Request): Promise<any[]> {
        const self = this;
        const raw = (request as any).request;
        return new Promise((resolve, reject) => {
            raw.userCallback = (err: Error, rc: number, rows: any[]) => { if (err) reject(err); else resolve(rows); }
            raw.callback = requestInternalCallback;

            self.connection.execSql(raw);
        });
    }

    public execSqlBatch(request: Request) : Promise<any[]> {
        const self = this;
        const raw = (request as any).request;
        return new Promise((resolve, reject) => {
            raw.userCallback = (err: Error, rc: number, rows: any[]) => { if (err) reject(err); else resolve(rows); }
            raw.callback = requestInternalCallback;

            self.connection.execSqlBatch(raw);
        });
    }

    public callProcedure(request: Request) : Promise<any[]> {
        const self = this;
        const raw = (request as any).request;
        return new Promise((resolve, reject) => {
            raw.userCallback = (err: Error, rc: number, rows: any[]) => { if (err) reject(err); else resolve(rows); }
            raw.callback = requestInternalCallback;

            self.connection.callProcedure(raw);
        });
    }

    public prepare(request: Request) : Promise<void> {
        const self = this;
        const raw = (request as any).request as tedious.Request;
        return new Promise((resolve, reject) => {
            const clean = () => {
                raw.removeAllListeners('prepared').removeAllListeners('error');
            }

            raw.on('prepared', () => {clean(); resolve()});
            raw.on('error', (err) => {clean(); reject(err)});
            
            self.connection.prepare(raw);
        });
    }

    public unprepare(request: Request) {
        const raw = (request as any).request;
        this.connection.unprepare(raw);
    }

    public execute(request: Request, parameters?: { [key: string]: unknown }) : Promise<any[]> {
        const self = this;
        const raw = (request as any).request;
        return new Promise((resolve, reject) => {
            raw.userCallback = (err: Error, rc: number, rows: any[]) => { if (err) reject(err); else resolve(rows); }
            raw.callback = requestInternalCallback;

            self.connection.execute(raw, parameters);
        });
    }
}

const requestInternalCallback = function (err: Error | undefined | null, rowCount?: number, rows?: any) {
    if (this.preparing) {
        this.preparing = false;
        if (err) {
            this.emit('error', err);
        } else {
            this.emit('prepared');
        }
    } else {
        this.userCallback(err, rowCount, rows);
        this.emit('requestCompleted');
    }
};

export interface ParameterOptions {
    output?: boolean;
    length?: number;
    precision?: number;
    scale?: number;
}

export class Request {
    private request: tedious.Request;

    constructor(sqlTextOrProcedure: string | undefined) {
        this.request = new tedious.Request(sqlTextOrProcedure, () => { });
    }

    public addParameter(name: string, type: any, value?: unknown, options?: Readonly<ParameterOptions> | null) {
        this.request.addParameter(name, type, value, options);
    }

    public setTimeout(timeout?: number) {
        this.request.setTimeout(timeout);
    }
}