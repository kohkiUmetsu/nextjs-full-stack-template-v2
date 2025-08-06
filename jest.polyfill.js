// jest.polyfill.js
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// ✅ Web API の polyfill（Request, Response）
global.Request = require('node-fetch').Request;
global.Response = require('node-fetch').Response;
global.Headers = require('node-fetch').Headers;
global.fetch = require('node-fetch');
