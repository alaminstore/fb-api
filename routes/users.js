const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

// Update user
router.put("/:id", async (req, res) => {
  if (
    req.body.user_id.toString() === req.params.id.toString() ||
    req.body.isAdmin
  ) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err.message);
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
router.delete("/:id", async (req, res) => {
  if (
    req.body.user_id.toString() === req.params.id.toString() ||
    req.body.isAdmin
  ) {
    try {
      const user = await User.findOne({ _id: req.params.id });
      !user &&
        res.status(404).json({ message: "Sorry! the User is not available" });

      await User.deleteOne({ _id: req.params.id }); //or
      // await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Account has been deleted!" });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  } else {
    return res
      .status(403)
      .json({ message: "You have the permission to delete only your accout" });
  }
});

// Get all user
router.get("/", (req, res) => {
  User.find({}, function (err, users) {
    if (err) {
      res.send("Something went wrong!");
      next();
    }
    res.json(users);
  });
});
// Get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    !user &&
      res.status(404).json({ message: "Sorry the use is not available" });
    // const { updatedAt, ...other } = user._doc
    res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});
// Follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.params.id !== req.body.user_id) {
    try {
      const user = await User.findById(req.params.id);
      const authUser = await User.findById(req.body.user_id);
      if (!user.followers.includes(req.body.user_id)) {
        await user.updateOne({ $push: { followers: req.body.user_id } });
        await authUser.updateOne({ $push: { followings: req.params.id } });

        res.status(200).json({ message: `You followed ${authUser.username}` });
      } else {
        res.status(403).json({ message: "You already follow the user" });
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  } else {
    res.status(403).json("You can't follow yourself");
  }
});
// Unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.params.id !== req.body.user_id) {
    try {
      const user = await User.findById(req.params.id);
      const authUser = await User.findById(req.body.user_id);
      if (user.followers.includes(req.body.user_id)) {
        await user.updateOne({ $pull: { followers: req.body.user_id } });
        await authUser.updateOne({ $pull: { followings: req.params.id } });
        res
          .status(200)
          .json({ message: `You just unfollow ${authUser.username}` });
      } else {
        res.status(403).json({ message: "You don't follow the user before" });
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  } else {
    res.status(403).json("You can't unfollow yourself");
  }
});

module.exports = router;
