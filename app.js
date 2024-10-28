require("dotenv").config();
const express = require("express");
const session = require("express-session");
//middleware imports
const errorHandelingMiddleware = require("./middlewares/errHandling");
//routes imports
const logInRouter = require("./routes/login");
const studentRouter = require("./routes/student");
const teacherRouter = require("./routes/teacher");
const groupRouter = require("./routes/group");
const moduleRouter = require("./routes/module");
const logoutRouter = require("./routes/logout");
const classRouter = require("./routes/class");

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
app.use("/api/login", logInRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/students", studentRouter);
app.use("/api/teachers", teacherRouter);
app.use("/api/groups", groupRouter);
app.use("/api/modules", moduleRouter);
app.use("/api/classes", classRouter);

//Error handling middleware
app.use(errorHandelingMiddleware);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
