const express = require("express");
const router = express.Router();
const ProductManager = require("../services/ProductManager");

const productManager = new ProductManager("products.json");

router.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los productos", error: error.message });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const product = await productManager.getProductById(Number(req.params.pid));
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el producto", error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        await productManager.addProduct(req.body);
        res.status(201).json({ message: "Producto agregado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al agregar el producto", error: error.message });
    }
});

router.put("/:pid", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const index = products.findIndex((p) => p.id === Number(req.params.pid));
        if (index === -1) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const updatedProduct = { ...products[index], ...req.body, id: products[index].id };
        products[index] = updatedProduct;

        await productManager._writeProductsToFile(products);
        res.status(200).json({ message: "Producto actualizado con éxito", updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el producto", error: error.message });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const filteredProducts = products.filter((p) => p.id !== Number(req.params.pid));

        if (products.length === filteredProducts.length) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        await productManager._writeProductsToFile(filteredProducts);
        res.status(200).json({ message: "Producto eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el producto", error: error.message });
    }
});

module.exports = router;
