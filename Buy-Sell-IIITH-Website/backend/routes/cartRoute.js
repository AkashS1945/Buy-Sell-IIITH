import express from "express";
import User from "../models/userModel.js"; 
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();


router.post("/add",authMiddleware, async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const updatedUser = await User.updateOne(
      { _id: userId },
      { $push: { itemsInCart: productId } }
    );

    if (updatedUser.modifiedCount === 0) {
      return res.status(400).send("User not found or no changes made.");
    }

    console.log("Item added to cart successfully");

    res.status(200).json({ message: "Item added to cart successfully" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).send(error.message);
  }
});


// Get Cart Items
router.get("/:id",authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user.itemsInCart);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Remove from Cart
router.post("/remove",authMiddleware, async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const updatedUser = await User.updateOne(
      { _id: userId },
      { $pull: { itemsInCart: productId } } // Ensure this matches the field in your User model
    );

    if (updatedUser.modifiedCount === 0) {
      return res.status(400).send("User not found or no changes made.");
    }

    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).send(error.message);
  }
});

// Final Order
router.post("/order",authMiddleware, async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user || user.itemsInCart.length === 0) {
      return res.status(400).send("Cart is empty");
    }

    await User.updateOne(
      { _id: userId },
      { $set: { itemsInCart: [] } }
    );
    res.status(200).send("Order placed successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
