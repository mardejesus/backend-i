const fs = require("fs");
const path = require("path");

class CartManager{

    constructor(cartsPath) {
        this.filePath = path.join(__dirname, "../persistence", cartsPath);
        this.lastId = 0;
        if (!fs.existsSync(this.filePath)) fs.writeFileSync(this.filePath, JSON.stringify([]));
    }

    async __readCartsFromFile() {
        const data = await fs.promises.readFile(this.filePath, "utf-8");
        return JSON.parse(data);
    }

    async _writeCartsToFile(carts) {
        await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
    }

    async createCart() {
        const carts = await this._readCartsFromFile();
        this.lastId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
        const newCart = { id: this.lastId, products: [] };
        carts.push(newCart);
        await this._writeCartsToFile(carts);
        return newCart;
    }

    async getCartById(id) {
        const carts = await this._readCartsFromFile();
        return carts.find((cart) => cart.id === id) || null;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this._readCartsFromFile();
        const cart = carts.find((c) => c.id === cartId);

        if (!cart) {
            throw new Error("Cart not found");
        }

        const productInCart = cart.products.find((p) => p.product === productId);
        if (productInCart) {
            productInCart.quantity++;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await this._writeCartsToFile(carts);
    }
}

module.exports = CartManager;