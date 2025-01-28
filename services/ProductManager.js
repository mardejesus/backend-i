const fs = require("fs");
const path = require("path");

class ProductManager{

    constructor(productsPath) {
        this.filePath = path.join(__dirname, "../persistence", productsPath);
        this.lastId = 0;
        if (!fs.existsSync(this.filePath)) fs.writeFileSync(this.filePath, JSON.stringify([]));
    }

     async _readProductsFromFile() {
        const data = await fs.promises.readFile(this.filePath, "utf-8");
        return JSON.parse(data);
    }

    async _writeProductsToFile(products) {
        await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
    }

    async addProduct(product) {
        if (
            !(product.title &&
                product.description &&
                product.code &&
                product.price &&
                product.status !== undefined &&
                product.stock !== undefined &&
                product.category &&
                Array.isArray(product.thumbnails)
            )
        ) {
            console.log("The product must has title, description, price, thumbnail, code and stock")
            return;
        }
        // Leer productos existentes del archivo
        const products = await this._readProductsFromFile();

        // Verificar que no exista un producto con el mismo código
        if (products.some((p) => p.code === product.code)) {
            console.log("A product with this code already exists");
            return;
        }

        // Asignar un ID único al producto
        this.lastId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        const newProduct = {...product, id: this.lastId};
        products.push(newProduct);

        // Guardar productos actualizados en el archivo
        await this._writeProductsToFile(products);

        console.log("Product added successfully:", newProduct);
    }

    async getProducts() {
        return await this._readProductsFromFile();
    }

    async getProductById(id) {
        const products = await this._readProductsFromFile();
        const product = products.find((p) => p.id === id);
        if (!product) {
            console.log("Product not found");
            return null;
        }
        return product;
    }
}

module.exports = ProductManager;
