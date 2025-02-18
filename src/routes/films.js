import dbClient from "../db/client.js";
import express from 'express'
const router = express.Router()

router.get(`/`,async(req,res)=>{
    try{
        res.status(200).json((
                await dbClient.query(
                    'SELECT * FROM films'
                )
            ).rows
        )
    } catch(error){
        console.error('Ошибка при выполнении запроса', error.stack)
        res.status(500).json({error:'Ошибка сервера',details:error.message})
    }
})

router.post(`/add`,async(req,res)=>{
    const {name}=req.body
    try{
        const result = await dbClient.query(
         'INSERT INTO films (name) VALUES ($1)',
         [name]   
        )

        res.status(201).json("Фильм успешно добавлен")
    } catch(error){
        console.error('Ошибка при выполнении запроса',error.stack)
        res.status(500).json({error:'Ошибка сервера',details:error.message})
    }
})

router.delete(`/delete/:id`,async(req,res)=>{
    const {id}=req.params
    try{
        const idCheck = await dbClient.query(
            'SELECT * FROM films WHERE id=$1',
            [id]
        )

        if(!idCheck.rows[0])
            return res.status(404).json(`Фильм с id ${id} не найден`)

        const result = await dbClient.query(
            'DELETE FROM films WHERE id=$1',
            [id]
        )

        res.status(200).json("Фильм успешно удален")
    }catch(error){
        console.error('Ошибка при выполнении запроса',error.stack)
        res.status(500).json({error:'Ошибка сервера',details:error.message})
    }
})

export default router