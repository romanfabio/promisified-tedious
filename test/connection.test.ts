import {Connection, ISOLATION_LEVEL} from "../src/index";
import config from "./config";

test('the connection is created and then closed', async () => {
    const conn = new Connection(config);

    await conn.connect();

    await conn.close();
});

test('the connection fails with empty config', async () => {
    expect(() => new Connection({})).toThrow();
});

test('the connections begins, save and commits a transaction', async () => {
    const conn = new Connection(config);

    await conn.connect();

    await conn.beginTransaction('test', ISOLATION_LEVEL.READ_UNCOMMITTED);

    await conn.saveTransaction('test');

    await conn.commitTransaction('test');

    await conn.close();
});

test('the connections begins and rollbacks a transaction', async () => {
    const conn = new Connection(config);

    await conn.connect();

    await conn.beginTransaction('', ISOLATION_LEVEL.READ_UNCOMMITTED);

    await conn.rollbackTransaction('');
    
    await conn.close();
});