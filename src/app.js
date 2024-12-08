const express = require("express");
const app = express();
require("dotenv").config();
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const EFAManagerRouter = require("./routes/EFAManagerRouter");
const siteAdminRouter = require("./routes/siteAdminRouter");
// Middleware to parse JSON body data
app.use(express.json());

// Use the user router for any routes starting with "/users"
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/efamanager", EFAManagerRouter);
app.use("/siteadmin", siteAdminRouter);


// Basic route to check if the server is running
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
