import 'dotenv/config'
import {app} from "./app.js";
import connectDB from "./db/index.js";


connectDB().then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port ${process.env.PORT}`)
    })
}).catch((error)=>{
    console.log("MONGO DB connection FAILED !!! ",error)
})