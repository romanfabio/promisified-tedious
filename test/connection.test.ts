import {Connection, ISOLATION_LEVEL, Request, TYPES} from "../src/index";
import config from "./config";

jest.setTimeout(20000)

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

test('the query returns 1 result', async () => {

    const conn = new Connection(config);

    await conn.connect();

    const request = new Request('SELECT TOP(1) * FROM [void].[dbo].[users]');

    const result = await conn.execSql(request);

    await conn.close();

    expect(result.length).toBe(1);
});

test('the query has 2 parameters', async () => {
    const conn = new Connection(config);

    await conn.connect();

    const request = new Request('SELECT TOP(1) * FROM [void].[dbo].[users] WHERE [username] = @u AND [password] = @p');
    request.addParameter('u', TYPES.VarChar, 'admin', {length: 100});
    request.addParameter('p', TYPES.VarChar, 'qwerty123', {length: 100});

    const result = await conn.execSql(request);

    await conn.close();

    expect(result.length).toBe(1);
});

test('the query returns 1 result with execSqlBatch', async () => {

    const conn = new Connection(config);

    await conn.connect();

    const request = new Request('SELECT TOP(1) * FROM [void].[dbo].[users]');

    const result = await conn.execSqlBatch(request);

    await conn.close();

    expect(result.length).toBe(1);
});

test('the procedure returns 1 result', async () => {

    const conn = new Connection(config);

    await conn.connect();

    const request = new Request('[void].[dbo].[get_default]');

    const result = await conn.callProcedure(request);

    await conn.close();

    expect(result.length).toBe(1);
});

test('the prepared statement returns 1 result', async() => {
    const conn = new Connection(config);

    await conn.connect();

    const request = new Request('SELECT TOP(1) * FROM [void].[dbo].[users] WHERE [username] LIKE @user');
    request.addParameter('user', TYPES.VarChar);

    await conn.prepare(request);

    const result = await conn.execute(request, {user: '%a%'});

    conn.unprepare(request);

    await conn.close();

    expect(result.length).toBe(1);
});