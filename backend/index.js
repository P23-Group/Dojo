import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);


const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok" });
})



function password(pass) {
  if (!pass || pass.length === 0){
    return false
  }

  let hasLetter = false;
  let hasDigit = false;

  for (let i = 0; i < pass.length; i++) {
    const char = pass[i];

    if(/[a-zA-Z-я-яА-Я]/.test(char)) 
      hasLetter = true;
    if(/[0-9]/.test(char))
      hasDigit = true;
  }

  if (!hasLetter || !hasDigit) {
    console.log("Error: Password must contain both letters and digits.");
    return false;
  }

  console.log("Password is valid.");
  return true;
}



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`)
    })
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err.message));