require("dotenv").config();
const express = require("express");
const session = require("express-session");
//middleware imports
const errorHandelingMiddleware = require("./middlewares/errHandling");
//routes imports
const logInRouter = require("./routes/login");
const adminRouter = require("./routes/admin");
const app = express();
app.use(express.json());

//Auth
app.use(
  session({
    secret: "jdkflqfmodjfdjf",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

//Routes
app.use("/api/admin", adminRouter);
app.use("/api/login", logInRouter);
//Error handling middleware
app.use(errorHandelingMiddleware);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
