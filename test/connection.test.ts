import {Connection} from "../src/index";
import config from "./config";

test('the connection is created and then closed', async () => {
    const conn = new Connection(config);

    await conn.connect();

    await conn.close();
});

test('the connection fails with empty config', async () => {
    expect(() => new Connection({})).toThrow();
});

test('isConnected() returns correct values after connection is created/closed', async() => {
    const conn = new Connection(config);

    expect(conn.isConnected()).toBe(false);

    await conn.connect();

    expect(conn.isConnected()).toBe(true);

    await conn.close();

    expect(conn.isConnected()).toBe(false);
});