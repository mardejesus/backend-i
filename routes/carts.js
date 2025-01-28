const express = require("express");
const router = express.Router();
const CartManager = require("../services/CartManager");

const cartManager = new CartManager("carts.json");

// Crear un nuevo carrito
router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ message: "Carrito creado con éxito", newCart });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el carrito", error: error.message });
    }
});

// Obtener productos de un carrito por ID
router.get("/:cid", async (req, res) => {
    try {
        const cart = await cartManager.getCartById(Number(req.params.cid));
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        res.status(200).json(cart.products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el carrito", error: error.message });
    }
});

// Agregar un producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
    try {
        await cartManager.addProductToCart(Number(req.params.cid), Number(req.params.pid));
        res.status(201).json({ message: "Producto agregado al carrito con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al agregar el producto al carrito", error: error.message });
    }
});

module.exports = router;
