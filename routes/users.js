const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

// Update user
router.put("/:id", async (req, res) => {
  if (
    req.body.user_id.toString() === req.params.id.toString() ||
    req.user.isAdmin
  ) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    const user = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json({ message: "Account has been updated!" });
  } else {
    return res
      .send(403)
      .json({ message: "You have the permission to update only your accout" });
  }
});
// Delete user
// Get a user
// Follow a user
// Unfollow a user

module.exports = router;
