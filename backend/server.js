const express = require('express');
const app = require('./src/app');
require('dotenv').config()

const PORT = process.env.PORT || 3000;


app.listen(PORT, ()=> {
    console.log(`O servidor esta rodando na porta ${PORT}`);
})