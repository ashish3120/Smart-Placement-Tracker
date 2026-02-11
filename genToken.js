const jwt = require('jsonwebtoken');
const config = require('./config/env');
const fs = require('fs');
const token = jwt.sign({ id: '1770744313691' }, config.jwtSecret, { expiresIn: '1h' });
fs.writeFileSync('token.txt', token);
