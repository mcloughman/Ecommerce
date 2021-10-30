const express = require("express");
const cartsRepo = require("../repositories/carts");

const router = express.Router();

// receive post request to add item to cart
router.post("/cart/products", async (req, res) => {
  // Figure out the cart. Do we already have one?
  // Either increment quantity for existing product or add new item
  let cart;
  if (!req.session.cartId) {
    // we need to create a cart and store the cart id req.session.cartId
    cart = await cartsRepo.create({ items: [] });
    req.session.cartId = cart.id;
  } else {
    // we have a cart...let's get it from the repository
    cart = await cartsRepo.getOne(req.session.cartId);
  }
  const existingItem = cart.items.find((item) => {
    return item.id === req.body.productId;
  });
  if (existingItem) {
    // increment quantity
    existingItem.quantity++;
  } else {
    //add new product id to items array
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }
  await cartsRepo.update(cart.id, {
    items: cart.items,
  });
  res.send("Product Added to Cart");
});
// receive get request to show the cart
// receive post request to delete an item

module.exports = router;
