import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Базовый роут для проверки сервера
app.get("/", (req, res) => {
  res.json({ message: "API is working!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
