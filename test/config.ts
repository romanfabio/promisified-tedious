import { ConnectionConfig } from "tedious"


const config : ConnectionConfig = {
    authentication: {
        options: {
            userName: 'sqluser',
            password: 'SQLserver1!'
        },
        type: 'default'
    },
    server: 'localhost',
    options: {
        port: 1433,
        trustServerCertificate: true
    }
};

export default config;