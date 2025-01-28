import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const cartCollections = 'cart';

const cartSchema = new Schema({
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'products', required: true }, // Referencia al modelo de productos
            quantity: { type: Number, required: true, default: 1 }, // Cantidad del producto
        },
    ],
});

// Crear el modelo de carritos
export const CartsModels = mongoose.model(cartCollections, cartSchema);
