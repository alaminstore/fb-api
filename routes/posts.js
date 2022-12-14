const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//create a post
router.post("/", async (req, res) => {
  const create_post = new Post(req.body);
  try {
    const post = await create_post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    !post && res.status(404).json({ message: "Post not found!" });
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json({ message: "Post has been updated!" });
    } else {
      res.status(403).json({ message: "You can update only your post" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      return res.status(200).json({ message: "Post has been deleted!" });
    } else {
      return res
        .status(403)
        .json({ message: "You can destroy only your post" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//like or dislike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      return res.status(200).json({ message: "The post has been liked!" });
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      return res.status(200).json({ message: "The post has been disliked!" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    !post && res.status(404).json({ message: "Post not found" });
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//timeline post

router.get("/timeline/all", async (req, res) => {
  try {
    const authUser = await User.findById(req.body.userId);
    console.log(authUser);
    const authUserPost = await Post.find({ userId: authUser._id });
    const friendPosts = await Promise.all(
      authUser.followings.map((friendId) => Post.find({ userId: friendId }))
    );
    return res.status(200).json(authUserPost.concat(...friendPosts));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//next we need to add paginate system.

module.exports = router;
