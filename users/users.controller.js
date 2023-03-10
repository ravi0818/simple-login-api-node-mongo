const express = require("express");
const router = express.Router();
const userService = require("./user.service");
const db = require("_helpers/db");
const errorHandler = require("../_helpers/error-handler");
const User = db.User;

// routes
router.post("/authenticate", authenticate);
router.post("/register", register);
router.get("/", getAll);
router.get("/current", getCurrent);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", _delete);

router.post("/audit", check, getAudit);
router.post("/logout", logout);

module.exports = router;

function getAudit(req, res, next) {
  userService
    .getAudit()
    .then((users) => res.json(users))
    .catch((err) => next(err));
}

async function check(req, res, next) {
  console.log(req.headers.authorization.split(" ")[1]);
  const userId = Buffer.from(req.headers.authorization.split(" ")[1], "base64")
    .toString()
    .split(":")[3]
    .split('"')[1];

  const user = await User.findOne({ _id: userId });

  //   console.log(user);
  if (user.role === "auditor") next();
  else {
    res.status(401).send("Unauthorized");
  }
}

function logout(req, res, next) {
  userService
    .logout(req.body)
    .then((user) => res.json(user))
    .catch((err) => next(err));
}

function authenticate(req, res, next) {
  const { username, password } = req.body;
  const ip = req.ip;
  //   console.log(ip);
  userService
    .authenticate({ username, password, ip })
    .then((user) =>
      user
        ? res.json(user)
        : res.status(400).json({ message: "Username or password is incorrect" })
    )
    .catch((err) => next(err));
}

function register(req, res, next) {
  userService
    .create(req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch((err) => next(err));
}

function getCurrent(req, res, next) {
  userService
    .getById(req.user.sub)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  userService
    .getById(req.params.id)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function update(req, res, next) {
  userService
    .update(req.params.id, req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function _delete(req, res, next) {
  userService
    .delete(req.params.id)
    .then(() => res.json({}))
    .catch((err) => next(err));
}
