const express = require('express');
const config = require('./config');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use('/assets', express.static(path.join(__dirname, '../assets')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/api/user', (req, res) => {
    res.json(config.user);
});

app.listen(config.port, () => {
    console.log(`Server is running http://localhost:${config.port}`);
});