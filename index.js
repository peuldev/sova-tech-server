const express = require("express");
var cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Sova Tech Server !!!");
});

app.listen(port, () => {
  console.log(`sova tech server running on port ${port}`);
});
