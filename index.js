const express = require('express')
const app = express()
const cors = require("cors");
app.use(express.json());
app.use(cors());
const port = 5001
const videos = require("./Data/Videos.json")
const detailsData = require("./Data/Videodetails.json")
app.get('/', (req, res) => {
  res.send('BrainFlix Server is running!')
})
app.get('/videos', (req, res) => {
    res.send(videos)
  })
  app.get("/video/:id", (req, res) => {
    const id = req.params.id;
    const details = detailsData.find((detail) => detail.id === id);
  
    if (details) {
      res.send(details);
    } else {
      res.status(404).send("Details not found");
    }
  });
  app.post("/addVideo",(req, res)=> {
    
  const videos = req.body; 
  console.log(videos)
  res.send(videos);
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})