import * as tedious from 'tedious';

export class Connection {
    private config : tedious.ConnectionConfig;
    private connection : tedious.Connection;
    private connected : boolean;

    constructor(config: tedious.ConnectionConfig) {
        this.config = config;
        this.connected = false;
        
        if(config.options === undefined)
            config.options = {};
        config.options.rowCollectionOnRequestCompletion = true;

        this.connection = new tedious.Connection(config);
    }

    public async connect() : Promise<void> {
        const self = this;
        this.connection.on('end', () => { self.connected = false; });
        return new Promise((resolve, reject) => {
            self.connection.connect((err) => {
                if(err)
                    reject(err);
                else {
                    self.connected = true;
                    resolve();
                }
            });
        });
    }

    public async close() : Promise<void> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.connection.on('end', () => {
                self.connected = false;
                resolve();
            });

            self.connection.close();
        });
    }

    public isConnected() : boolean {
        return this.connected;
    }
}