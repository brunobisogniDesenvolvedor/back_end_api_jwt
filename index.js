const express = require ("express"); 
const app = express(); 
const mongoose = require ("mongoose"); 
const dotenv = require ("dotenv"); 
const authRoute = require ("./api/routes/auth");
const userRoute = require ("./api/routes/user"); 
const movieRoute = require("./api/routes/movies"); 

dotenv.config(); 

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connectado com Sucesso"))
    .catch(err =>  console.log(err)); 
    
    app.use(express.json()); 

    app.use("/api/auth" , authRoute); 
    app.use("/api/users", userRoute);
    app.use("/api/movies", movieRoute); 

    app.listen(8800, () =>  console.log("Backend server rodando !!!"))