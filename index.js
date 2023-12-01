const express = require("express");
const app = express()
const http = require("http")
const cors = require("cors")
const {Server} = require("socket.io")
const PORT = process.env.PORT || 5000
app.use(cors());
const server = http.createServer(app);
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

app.get('/', (req, res) => res.send('Hello World!' ))
  
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`)

    socket.on("join_room", (data) => {
        socket.join(data)
        console.log(`User with ID: ${socket.id} joined room: ${data}`)
    })

    socket.on("shared_PublicFile", (data) => {
        socket.join(data.companyId)
        socket.to(data.companyId).emit("receive_Publicfile", data);
    })

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id)
    })
})


server.listen(PORT, () => console.log(`Server up at PORT:${PORT}`))