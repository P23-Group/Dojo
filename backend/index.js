import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dns from "node:dns";
import User from "./Model/model.js";
import bcrypt  from  "bcrypt" ;
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import jwt from "jsonwebtoken";


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`)
    })
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err.message));


const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok" });
})


app.post("/auth/register", async (req, res) => {

// Тип данных — что произойдёт, если вместо строки придёт число или null?  

  const emailRegex = /^(?=[^@]*[a-zA-Z])(?=[^@]*\d)[a-zA-Z0-9]{3,}@[^\s@]+\.[^\s@]+$/;
  const email = req.body.email.toLowerCase().trim();
  const name = req.body.name.trim();
  const password = req.body.password.trim();

  let emailExists = await User.findOne({ email: email });
  let hasLetter = false;
  let hasNumber = false;

  try{

  if(!name || !email || !password) 
    return res.status(400).json({error: "Missing required fields"});

  if ( name.length < 3 || name.length > 20) 
    return res.status(400).json({error: "Name must be between 3 and 20 characters"});

  if (email.length < 5 || email.length > 50) 
    return res.status(400).json({error: "Email must be between 5 and 50 characters"});
  
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email must be valid" });
  }

  if (password.length < 8 || password.length > 50) 
    return res.status(400).json({error: "Password must be between 8 and 50 characters"});
  
  for (let i = 0; i < password.length; i++) {
    const char = password[i];
    if (/[a-zA-Z]/.test(char)) hasLetter = true;
    if (/[0-9]/.test(char)) hasNumber = true;
  }

  if (!hasLetter || !hasNumber) 
    return res.status(400).json({error: "Password must contain at least one letter and one number"});

  if (emailExists)
    return res.status(400).json({error: "Email already exists"});

    const newUser = await User.create({
      name: name,
      email: email,
      hashPassword: bcrypt.hashSync(password, 10),  // 10 = Раунды соли, повышает безопасность хэша, но увеличивает время
      lvl: 1,
      xp: 0,
    })
  }

  catch(err){
    console.error(err);
    return res.status(500).json({error: "Internal server error"});
  }
  
})


app.post("/auth/login", async (req, res) => {


  // проверка если ничего не напишет 
  const email = req.body.email.toLowerCase().trim();
  const password = req.body.password.trim();

  if(!email || !password) 
    return res.status(400).json({error: "Missing required fields"});

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({error: "User not found"});
  }

  let isPasswordCorrect = await bcrypt.compareSync(password, user.hashPassword);

  if (!isPasswordCorrect)
    return res.status(401).json({error: "Invalid password or email"});
  
  const token = jwt.sign(
  {
    userId: user.id
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "1h"
  }
  );

  return res.status(200).json({token: token});


})