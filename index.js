import express from "express"
import logger from "./logger.js"
import morgan from "morgan" 

const app = express()
const port = 3000
const morganFormat = ":method :url :status :response-time ms"

app.use(morgan(morganFormat, {
    stream: {
        write: (message) => {
            const logObject = {
                method: message.split(" ")[0],
                url: message.split(" ")[1],
                status: message.split(" ")[2],
                responseTime: message.split(" ")[3],
            }
            logger.info(JSON.stringify(logObject))
        }
    }
}))

app.use(express.json()) // Accept requests with json body

let data = []
let nextId = 1


app.post("/teas", (req, res) => {
    const {name, price} = req.body
    const newTea = {id: nextId++, name, price}
    data.push(newTea)
    res.status(201).send(newTea)
})

// get list of teas
app.get("/teas", (req, res) => {
    res.status(200).send(data)
})


// get a tea
app.get("/teas/:id", (req, res) => {
    const tea = data.find((tea) => tea.id === parseInt(req.params.id))
    if(!tea){
        res.status(404).send("Tea Not Found!")
    }
    res.status(200).send(tea)
})

app.put("/teas/:id", (req, res) => {
    const tea = data.find((tea) => tea.id === parseInt(req.params.id))
    if(!tea){
        res.status(404).send("Tea Not Found!")
    }
    const {name, price} = req.body
    tea.name = name
    tea.price = price
    res.status(200).send(tea)
})

app.delete("/teas/:id", (req, res) => {
    const index = data.findIndex((tea) => tea.id === parseInt(req.params.id))
    if(index === -1){
        return res.status(404).send("Tea Not Found!")
    }

    data.splice(index, 1)
    return res.status(204).send(`Deleted tea with id: ${parseInt(req.params.id)}`)
})

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.get('/login', (req, res) => {
//     res.send('Logged in Juvyyyyyy!')
// })  

app.listen(port, () => {
  console.log(`Server listening on port ${port}...`)
})