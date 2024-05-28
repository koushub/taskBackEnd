const express = require("express");
const rootRouter = require("./routes/index");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());
app.use("/api/v1", rootRouter);

const port = process.env.PORT 
app.listen(port, () => {
    console.log("Server started on port 3000")
});