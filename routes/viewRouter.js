const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Cart = require("../models/Cart");

// Vista: Lista de productos
router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        const total = await Product.countDocuments();
        const products = await Product.find().skip(skip).limit(Number(limit));

        const totalPages = Math.ceil(total / limit);

        res.render("products", {
            products,
            page: Number(page),
            totalPages,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevPage: Number(page) - 1,
            nextPage: Number(page) + 1,
            cartId: "64f1eabc1234567890abcdef" // Reemplazalo por un ID real o dinámico
        });
    } catch (error) {
        res.status(500).send("Error al cargar la vista de productos");
    }
});

// Vista: Detalle del producto
router.get("/products/:pid", async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) return res.status(404).send("Producto no encontrado");

        res.render("productDetail", { ...product.toObject(), cartId: "64f1eabc1234567890abcdef" });
    } catch (error) {
        res.status(500).send("Error al cargar el producto");
    }
});

// Vista: Ver carrito con productos populados
router.get("/carts/:cid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate("products.product");
        if (!cart) return res.status(404).send("Carrito no encontrado");

        res.render("cart", { products: cart.products });
    } catch (error) {
        res.status(500).send("Error al cargar el carrito");
    }
});

module.exports = router;
