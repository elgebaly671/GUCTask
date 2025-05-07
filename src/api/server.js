/*
-> express library allows us to start a server locally and define routs
-> getData is the importing of the getData() from pupp.js which is responsible for puppeteer
-> cors (Cross-Origin Resource Sharing) allows frontend (the react local server) make requests to the backend (server made using express) 
*/
import express, { json } from 'express'
import getData from './pupp.js'
import cors from 'cors'
import { config } from 'dotenv'
//creating the actual web server with 5000 as the port
const app = express()
const PORT = 5000;


//creates the link between the server and the frontend
app.use(cors())
//asks the server to use json
app.use(express.json())
//defining a POST endPoint that gets the data posted by the mehtod that called that POST method and then calls the server to execute getData
app.post("/run-pupp", async (req, res) => {
    const {username, password} = req.body;
    try{
        
        const data = await getData(username, password);
        res.json(data);
       
    }catch(e){
        res.status(500).send("Error: "+ e.message)
    }

    
})

//start the server on the chosen PORT
app.listen(PORT, () => {
       console.log(`Backend server running at http://localhost:${PORT}`) 
})