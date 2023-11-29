const { createUser } = require('../service/user.service');

module.exports.signUp = (req, res) => {
  createUser(req.body)
    .then(r => res.status(200).json(r))
    .catch(e => {
      console.log(e);
      res.status(400).json(e);
    });
};
