const express = require("express");
const router = express.Router();
const users = require("./MOCK_DATA.json");
const app = express();
const port = 5000;

// application level middleware
const loggerMiddleware = (req, res, next) => {
  console.log(`${new Date()}: --- Response: [${req.method}] [${req.url}] `);
  next();
};

// Define a router-level middleware function
const checkAuth = (req, res, next) => {
  const isAuthenticated = false;

  if (isAuthenticated) {
    console.log("user authstatus : ", isAuthenticated);
    next();
  } else {
    //   res.status(401).send('Unauthorized user');
    // or
    res.status(401);
    throw new Error("user is not authorized");
  }
};

app.use(loggerMiddleware);
// router level middleware
app.use("/api/users", router);
router.use(checkAuth);
const getUser = (req, res, nex) => {
  res.json(users);
};
router.route("/").get(getUser).post();
// error handling middleware
// buil in middleware
// third party level middleware

app.listen(port, () => console.log(`Server started at ${port}`));
