const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");

const User = db.user;
const regexEmail = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;

//Création d'un compte utilisateur
exports.signup = (req, res, next) => {
  if (!req.body.email || !req.body.pseudo || !req.body.password) {
    return res.status(400).json({
      message: "Vos données sont incomplètes",
    });
  } else if (!regexEmail.test(req.body.email)) {
    return res.status(400).json({
      message: "error",
    });
  }
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = {
        email: req.body.email,
        pseudo: req.body.pseudo,
        password: hash,
        is_admin: req.body.is_admin,
      };
      User.create(user)
        .then(() => {
          res.status(200).json({
            message: "success",
          });
        })
        .catch((err) => {
          if ((err.errors[0].message = "users.email must be unique")) {
            res.status(409).json({ message: "conflict" });
          } else {
            res.status(500).json({ err });
          }
        });
    })
    .catch((err) => res.status(500).json({ err }));
};

//Connexion à un compte utilisateur
exports.login = (req, res, next) => {
  User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "L'authentification a échoué",
        });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              message: "Mot de passe incorrect",
            });
          }
          res.status(200).json({
            userId: user.id,
            token: jwt.sign({ userId: user.id }, "RANDOM_TOKEN_SECRET", { expiresIn: "24h" }),
          });
        })
        .catch((err) => res.status(500).json({ err }));
    })
    .catch((err) => res.status(500).json({ err }));
};

//Récupération d'un compte utilisateur
exports.getOneUser = (req, res, next) => {
  const id = req.params.id;
  User.findByPk(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "Le compte utilisateur n'a pas été trouvé",
        });
      }
      res.status(200).json({
        admin: user.is_admin,
        userId: user.id,
        email: user.email,
        pseudo: user.pseudo,
      });
    })
    .catch((err) => res.status(500).json({ err }));
};

//Modification d'un compte utilisateur
exports.modifyUser = (req, res, next) => {
  let password;
  if (req.body.password) {
    bcrypt.hash(req.body.password, 10).then((hash) => {
      password = hash;
    });
  }
  const user = {
    email: req.body.email,
    pseudo: req.body.pseudo,
    password,
    is_admin: req.body.is_admin,
  };
  if (req.file) {
    user.profil_picture = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
  }
  User.update(user, {
    where: { id: req.params.id },
  })
    .then((data) => {
      if (data[0] === 0) {
        return res.status(404).json({
          message: "Le compte utilisateur n'a pas été trouvé",
        });
      } else {
        res.status(200).json({ message: "Le compte utilisateur a été modifié" });
      }
    })
    .catch((err) => res.status(500).json({ err }));
};

//Suppression d'un compte utilisateur
exports.deleteUser = (req, res, next) => {
  User.update(
    {
      email: "ancien compte" + Date.now(),
      pseudo: "ancien compte",
      password: "",
      is_admin: 0,
    },
    {
      where: { id: req.params.id },
    }
  )
    .then((data) => {
      if (data[0] === 0) {
        return res.status(404).json({
          message: "user not found",
        });
      } else {
        res.status(200).json({ message: "user deleted" });
      }
    })
    .catch((err) => res.status(500).json({ err }));
};
