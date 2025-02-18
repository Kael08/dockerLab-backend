import http from 'http'
import express from 'express'
import filmsRouter from './routes/films.js'

const app = express()

app.use(express.json())

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    if(req.method==='OPTIONS'){
        res.sendStatus(204)
    } else {
        next()
    }
})

app.use('/films',filmsRouter)

app.use((req,res)=>{
    res.status(404).send(`Не найден`)
})

const PORT = process.env.PORT||3000

http.createServer(app).listen(PORT,()=>{
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`)
})