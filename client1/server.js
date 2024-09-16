import express from 'express'
import { fileURLToPath } from "url";
import path from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()

app.use(express.static(path.join(__dirname, 'dist')));

// Handle all other routes by sending index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

const port = 8080;

app.listen(port, () => {
  console.log("Server started on port:", port);
});