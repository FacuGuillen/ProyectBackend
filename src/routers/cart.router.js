import express from 'express';
import { cartManager } from '../managers/cart.manager.js';
import { CartsModels } from '../models/cart.model.js';

const router = express.Router();


router.post('/', async (req, res) => {
    try {
        const cart = await cartManager.createCart();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// router.get('/:idCart', async (req, res) => {
//     try {
//         const { idCart } = req.params;
//         const cart = await cartManager.getCartById(idCart);
//         res.status(200).json(cart);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

router.get('/:idCart', async (req, res) => {
    try {
        const { idCart } = req.params;

        // Buscar el carrito por ID y popular los productos
        const cart = await CartsModels.findById(idCart).populate('products.product');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/:idCart/product/:idProd', async (req, res) => {
    try {
        const { idCart, idProd } = req.params;
        const cart = await cartManager.saveProductToCart(idCart, idProd);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.delete('/:idCart/product/:pid', async (req, res) => {
    try {
        const { idCart, pid } = req.params;
        const cart = await cartManager.deleteProductFromCart(idCart, pid);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.delete('/:idCart', async (req, res) => {
    try{
        const { idCart } = req.params
        const cart = await cartManager.clearCart(idCart)
        res.status(200).json(cart)
    } catch (e) {
        res.status(500).json({ message: error.message })
    }
})


export default router;
