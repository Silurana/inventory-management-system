import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

//! get all products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

//! get product by id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//! get product by barcodeS

const getProductByBarcode = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ barcode: req.params.barcode });

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//! delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//! create product
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, barcode, countInStock } =
    req.body;

  // Check if barcode already exists
  const productExists = await Product.findOne({ barcode });
  if (productExists) {
    res.status(400);
    throw new Error("Product with this barcode already exists");
  }

  const product = new Product({
    name,
    price,
    user: req.user._id,
    barcode,
    category,
    countInStock,
    description,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

//! update product
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, barcode, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.category = category;
    product.barcode = barcode;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//! sell products
const sellProducts = asyncHandler(async (req, res) => {
  const { items } = req.body; // Array of { product_id, quantity }

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("No items to sell");
  }

  for (const item of items) {
    const product = await Product.findById(item.product._id);
    if (product) {
      if (product.countInStock >= item.qty) {
        product.countInStock = product.countInStock - item.qty;
        await product.save();
      } else {
        res.status(400);
        throw new Error(`Not enough stock for ${product.name}`);
      }
    }
  }

  res.json({ message: "Sale successful, stock updated" });
});

export {
  getProducts,
  getProductById,
  getProductByBarcode,
  deleteProduct,
  createProduct,
  updateProduct,
  sellProducts,
};
