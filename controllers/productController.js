const Product = require("../models/Product");

exports.getAllProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const filter = query
            ? {
                $or: [
                    { category: { $regex: query, $options: "i" } },
                    { status: query === "true" }
                ]
            }
            : {};

        const sortOption = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};
        const skip = (page - 1) * limit;
        const total = await Product.countDocuments(filter);
        const products = await Product.find(filter).sort(sortOption).skip(skip).limit(Number(limit));

        const totalPages = Math.ceil(total / limit);
        const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;

        res.json({
            status: "success",
            payload: products,
            totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page: Number(page),
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null,
            nextLink: page < totalPages ? `${baseUrl}?page=${Number(page) + 1}&limit=${limit}` : null,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) return res.status(404).json({ message: "Producto no encontrado" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el producto", error: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ message: "Producto agregado con éxito", newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error al agregar el producto", error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Producto no encontrado" });
        res.status(200).json({ message: "Producto actualizado con éxito", updated });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el producto", error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.pid);
        if (!deleted) return res.status(404).json({ message: "Producto no encontrado" });
        res.status(200).json({ message: "Producto eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el producto", error: error.message });
    }
};
