import mongoose from 'mongoose'
import { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productsCollections = 'products'
const productsSchema = new Schema({
    title: String,
    description: String,
    code: {
        type: String,
        unique: true
    },
    price: Number,
    status: Boolean,
    stock: Number,
    category: String
})

productsSchema.plugin(mongoosePaginate)

export const ProductsModels = mongoose.model(productsCollections, productsSchema)