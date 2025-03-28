const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// Crear nuevo carrito
router.post("/", async (req, res) => {
    try {
        const newCart = new Cart({ products: [] });
        await newCart.save();
        res.status(201).json({ message: "Carrito creado con éxito", newCart });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el carrito", error: error.message });
    }
});

// Obtener carrito por ID (con populate)
router.get("/:cid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate("products.product");
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

        res.status(200).json({ products: cart.products });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el carrito", error: error.message });
    }
});

// Agregar producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

        const productInCart = cart.products.find(p => p.product.toString() === req.params.pid);
        if (productInCart) {
            productInCart.quantity++;
        } else {
            cart.products.push({ product: req.params.pid, quantity: 1 });
        }

        await cart.save();
        res.status(201).json({ message: "Producto agregado al carrito con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al agregar el producto al carrito", error: error.message });
    }
});

// Eliminar un producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

        cart.products = cart.products.filter(p => p.product.toString() !== req.params.pid);
        await cart.save();
        res.json({ message: "Producto eliminado del carrito" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el producto", error: error.message });
    }
});

// Actualizar todos los productos del carrito
router.put("/:cid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

        cart.products = req.body.products.map(p => ({
            product: p.productId,
            quantity: p.quantity
        }));

        await cart.save();
        res.json({ message: "Carrito actualizado con nuevos productos" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el carrito", error: error.message });
    }
});

// Actualizar cantidad de un producto
router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

        const product = cart.products.find(p => p.product.toString() === req.params.pid);
        if (!product) return res.status(404).json({ message: "Producto no encontrado en el carrito" });

        product.quantity = quantity;
        await cart.save();
        res.json({ message: "Cantidad del producto actualizada" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar cantidad", error: error.message });
    }
});

// Vaciar carrito
router.delete("/:cid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

        cart.products = [];
        await cart.save();
        res.json({ message: "Todos los productos eliminados del carrito" });
    } catch (error) {
        res.status(500).json({ message: "Error al vaciar el carrito", error: error.message });
    }
});

module.exports = router;
