const express = require('express')
const path = require('path')

const app = express()

// HOME
app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname})
})

app.listen(3000, () => {
    console.log('Shits running boss! Reporting on port 3000!')
})