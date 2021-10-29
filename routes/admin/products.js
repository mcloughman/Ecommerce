const express = require("express");

const multer = require("multer");

const { handleErrors } = require("./middlewares");
const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");
const productsIndexTemplate = require("../../views/admin/products/index");
const { requireTitle, requirePrice } = require("./validators");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/admin/products", async (req, res) => {
  const products = await productsRepo.getAll();
  res.send(productsIndexTemplate({ products: products }));
});

router.get("/admin/products/new", (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post(
  "/admin/products/new",
  upload.single("image"), // multer now handling body parsing since form is not urlencoded. we need multer middleware to run first
  [requireTitle, requirePrice],
  handleErrors(productsNewTemplate),

  async (req, res) => {
    const image = req.file.buffer.toString("base64");
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });
    res.redirect("/admin/products");
  }
);

module.exports = router;
