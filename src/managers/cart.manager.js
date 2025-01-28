import { CartsModels } from '../models/cart.model.js';
import { ProductsModels } from '../models/products.model.js'; // Asegúrate de importar el modelo de productos


class CartManager {
    async getAllCarts() {
        try {
            const carts = await CartsModels.find().populate('products.product'); // Popular datos de productos
            return carts;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createCart() {
        try {
            const cart = await CartsModels.create({ products: [] });
            return cart;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getCartById(id) {
        try {
            const cart = await CartsModels.findById(id).populate('products.product');
            if (!cart) {
                throw new Error('Cart not found');
            }
            return cart;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async saveProductToCart(idCart, idProd) {
        try {
            // Verificar si el producto existe
            const product = await ProductsModels.findById(idProd);
            if (!product) {
                throw new Error('Product not found');
            }

            // Verificar si el carrito existe
            const cart = await CartsModels.findById(idCart);
            if (!cart) {
                throw new Error('Cart not found');
            }

            // Verificar si el producto ya está en el carrito
            const productInCart = cart.products.find((item) => item.product.toString() === idProd);

            if (productInCart) {
                // Incrementar la cantidad si ya está en el carrito
                productInCart.quantity += 1;
            } else {
                // Agregar un nuevo producto al carrito
                cart.products.push({ product: idProd, quantity: 1 });
            }

            // Guardar los cambios en la base de datos
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteProductFromCart(idCart, idProd) {
        try {
            const cart = await CartsModels.findById(idCart);
            if (!cart) {
                throw new Error('Cart not found');
            }

            // Filtrar el producto a eliminar
            cart.products = cart.products.filter((item) => item.product.toString() !== idProd);

            // Guardar los cambios
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async clearCart(idCart) {
        try{
            const cart = await CartsModels.findById(idCart)
            if(!cart){
                throw new Error('Cart not found')
            }

            cart.products = []

            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export const cartManager = new CartManager();
