const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const sequelize = require("./utils/dbConfig");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const paymentsRoutes = require("./routes/paymetsRoute");
const emailRoutes = require("./routes/emailRoutes");

const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json("expense working");
});

app.use("/", userRoutes);
app.use("/", expenseRoutes);
app.use("/", paymentsRoutes);
app.use("/", emailRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log("server connected");
    });
  })
  .catch((error) => {
    console.log(error);
  });
