const express = require("express");
const { extractAllData } = require("./confluenceScraper");

const app = express();
const PORT = 5000;

app.get("/confluence/all", async (req, res) => {
  try {
    const data = await extractAllData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter os dados do Confluence" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
