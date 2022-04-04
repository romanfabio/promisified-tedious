# promisified-tedious
A promisified layer over [Tedious](https://github.com/tediousjs/tedious) package

## Usage Example
```javascript
import {Connection, Request, TYPES} from 'promisified-tedious';

async function getUser(username) {
  const conn = new Connection({ /* configuration */ });

  try {
    await conn.connect();
  } catch(err) {
    console.error(err);
    return;
  }
  
  try {
    const request = new Request('SELECT * FROM [dbo].[users] WHERE [username] = @user');
    
    request.addParameter('user', TYPES.VarChar, 'admin');

    const result = await conn.execSql(request);
    
    const user = result[0];
  
  } catch(err) {
    console.error(err);
  } finally {
    await conn.close();
  }
}
```
## Installation
```javascript 
npm i promisified-tedious
```
## Version
Version `0.5.x` uses `tedious@14.3.x` 

## Documentation
This package tries to provide the same interface as the Tedious package.

All callback parameters are removed.

Please refer to the official [Tedious](http://tediousjs.github.io/tedious/) documentation for more details.

## Transaction
```javascript
const conn; // Connection

await conn.beginTransaction();

await conn.saveTransaction();

await conn.commitTransaction();

await conn.rollbackTransaction();
```

## Request
```javascript
const conn; // Connection

const request = new Request('SELECT 1 AS n FROM [dbo].[numbers]');

await conn.execSql(request); // [ { n: 1 } ]
```

## Bulk Load
```javascript
const conn; // Connection

const bulk = conn.newBulkLoad('[dbo].[users]', {keepNulls: true});

bulk.addColumn('username', TYPES.VarChar, {nullable: false});
bulk.addColumn('password', TYPES.VarChar, {nullable: false});

await conn.execBulkLoad(bulk, [ {username: 'admin', password: 'qwerty'} ]);
```

## Tedious license

Copyright (c) 2010-2021 Mike D Pilsbury

The MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[more details about the license](https://github.com/tediousjs/tedious/blob/master/LICENSE)
