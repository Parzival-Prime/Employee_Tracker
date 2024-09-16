import mongoose, { Schema } from "mongoose"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const validateEmail = function (email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

// const shippingAddressSchema = new mongoose.Schema({
//     city: {
//         type: String,
//         required: true
//     },

//     state: {
//         type: String,
//         required: true
//     },

//     line1: {
//         type: String,
//         required: true
//     },

//     line2: {
//         type: String
//     },

//     pinCode:{
//         type: Number,
//         required: true
//     },

//     country: {
//         type: String,
//         required: true
//     } 
// })

// const cartItemSchema = new mongoose.Schema({
//     productId: {
//         type: Schema.Types.ObjectId,
//         ref: 'Product',
//         required: true
//     },
//     quantity: {
//         type: Number,
//         required: true,
//         default: 1
//     },
//     price: {
//         type: Number,
//         required: true
//     },
//     name: {
//         type: String,
//         required: true
//     }
// }, { timestamps: true })


// const wishListSchema = new mongoose.Schema({
//     productId: {
//         type: Schema.Types.ObjectId,
//         ref: 'Product',
//         required: true
//     },
//     quantity: {
//         type: Number,
//         required: true,
//         default: 1
//     }
// }, { timestamps: true })


// const orderItemSchema = new mongoose.Schema({
//     products: [
//         {
//             productName: {
//                 type: String,
//                 required: true
//             },

//             units:{
//                 type: Number,
//                 required: true
//             },

//             price: {
//                 type: Number,
//                 required: true
//             }
//         },
//     ],

//     shippingAddress: shippingAddressSchema,

//     totalAmount: {
//         type: Number,
//         required: true
//     },

//     billID: {
//         type: String,
//         required: true
//     },

//     paymentMode: {
//         type: String,
//         required: true
//     }

// }, { timestamps: true })



const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        maxLength: 25,
        minLength: 3
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },

    password: {
        type: String,
        required: true
    },

    profileImage: {
        type: String,
    },

    phone: {
        type: Number,
        required: true,
        maxLength: 10,
        minLength: true
    },

    address: {
        type: String,
        required: true
    },
    

    // dateOfBirth: {
    //     type: String,
    //     required: true
    // },

    answer: {
        type: String,
        required: true,
    },

    pincode: {
        type: Number,
        required: true
    },

    role: {
        type: Number,
        default: 0
    },
    // cart: {
    //     type: [cartItemSchema],
    //     default: []
    // },
    // wishList: {
    //     type: [wishListSchema],
    //     default: []
    // },

    // orders: {
    //     type: [orderItemSchema],
    //     default: []
    // },

    refreshToken: {
        type: String
    }
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
    }, process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        })
}

userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign({
        _id: this._id
    }, process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        })
}

export const User = mongoose.model('User', userSchema)

