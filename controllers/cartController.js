const Cart = require("../models/Cart");

exports.createCart = async (req, res) => {
    try {
        const newCart = new Cart({ products: [] });
        await newCart.save();
        res.status(201).json({ message: "Carrito creado con éxito", newCart });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el carrito", error: error.message });
    }
};

exports.getCartById = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate("products.product");
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
        res.status(200).json({ products: cart.products });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el carrito", error: error.message });
    }
};

exports.addProductToCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

        const existing = cart.products.find(p => p.product.toString() === req.params.pid);
        if (existing) {
            existing.quantity++;
        } else {
            cart.products.push({ product: req.params.pid, quantity: 1 });
        }

        await cart.save();
        res.status(201).json({ message: "Producto agregado al carrito con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al agregar el producto al carrito", error: error.message });
    }
};

exports.removeProductFromCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

        cart.products = cart.products.filter(p => p.product.toString() !== req.params.pid);
        await cart.save();
        res.json({ message: "Producto eliminado del carrito" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar producto", error: error.message });
    }
};

exports.updateCartProducts = async (req, res) => {
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
};

exports.updateProductQuantity = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

        const product = cart.products.find(p => p.product.toString() === req.params.pid);
        if (!product) return res.status(404).json({ message: "Producto no encontrado en el carrito" });

        product.quantity = req.body.quantity;
        await cart.save();
        res.json({ message: "Cantidad del producto actualizada" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar cantidad", error: error.message });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

        cart.products = [];
        await cart.save();
        res.json({ message: "Todos los productos eliminados del carrito" });
    } catch (error) {
        res.status(500).json({ message: "Error al vaciar el carrito", error: error.message });
    }
};
