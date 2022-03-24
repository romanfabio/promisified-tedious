import * as tedious from 'tedious';

export default class Connection {
    private config : tedious.ConnectionConfig;
    private connection : tedious.Connection;

    constructor(config: tedious.ConnectionConfig) {
        this.config = config;
        
        if(config.options === undefined)
            config.options = {};
        config.options.rowCollectionOnRequestCompletion = true;

        this.connection = new tedious.Connection(config);
    }

    public async connect() : Promise<void> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.connection.connect((err) => {
                if(err)
                    reject(err);
                else
                    resolve();
            });
        });
    }

    public async close() : Promise<void> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.connection.on('end', () => {
                resolve();
            });

            self.connection.close();
        });
    }
}