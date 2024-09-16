import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import bcrypt from 'bcrypt'

const options = {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: 'strict'
}
const options2 = {
    path: "/",
    sameSite: 'strict',
    secure: true,
}


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findOne(userId)

        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        
        return { accessToken, refreshToken }
    } catch (error) {
        console.log('Error occured in generating access and refresh token', error)
    }
}


export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!password && !email) {
            return res.status(400).send({
                success: false,
                message: 'All fields are required'
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User does not exists'
            })
        }

        const isPasswordValid = await user.isPasswordCorrect(password)

        if (!isPasswordValid) {
            return res.status(401).send({
                success: false,
                message: 'Invalid Password'
            })
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken -answer")

        if (loggedInUser.role === 1) {

            return res
                .status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .cookie("isLoggedIn", 'true', options2)
                .cookie("isAdmin", 'true', options2)
                .json({
                    success: true,
                    message: 'User LoggedIn Successfully',
                    user: loggedInUser,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                })
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .cookie("isLoggedIn", 'true', options2)
            .json({
                success: true,
                message: 'User LoggedIn Successfully',
                user: loggedInUser,
                accessToken: accessToken,
                refreshToken: refreshToken
            })

    } catch (error) {
        console.log(error)
        return res.status(400).send({
            success: false,
            message: 'Error occured in login Controller',
            error
        })
    }
}


export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer, pincode } = req.body

        if (
            !name || !email || !password || !phone || !address || !answer || !pincode
        ) {
            return res.status(400).send({
                success: false,
                message: 'All fields are required'
            })
        }
        // console.log('auth controller reach1')
        const existingUser = await User.findOne({ email })
        
        if (existingUser) return res.status(404).send({ success: false, message: 'User with this email already exists' })
            // console.log('auth controller reach2')
        
        const ImageLocalPath = req.file?.path
        const profileImage = await uploadOnCloudinary(ImageLocalPath)
        // console.log('auth controller reach4')
        
        
        const user = await User.create({ name, email, password, phone, pincode, address, answer, profileImage: profileImage?.url })
        // console.log('auth controller reach5')

        // const createdUser = await User.findOne(user._id).select('-password -refreshToken')

        req.body.email = email
        req.body.password = password
        console.log('before moving to login')
        await loginController(req, res)
        // return res.status(201).send({
        //     success: true,
        //     message: 'User registered Successfully',
        //     createdUser
        // })

    } catch (error) {
        console.log(error)
        return res.status(400).send({
            success: false,
            message: 'Error occured in registerController',
            error
        })
    }
}


// export const logoutController = async (req, res) => {
//     try {
//         await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: null } }, { new: true })

//         return res
//             .status(200)
//             .clearCookie('accessToken', options)
//             .clearCookie('refreshToken', options)
//             .clearCookie('isLoggedIn', options2)
//             .clearCookie('isAdmin', options2)
//             .send({
//                 success: true,
//                 message: 'LoggedOut Successfully'
//             })
//     } catch (error) {
//         console.log(error)
//         return res.status(400).send({
//             success: false,
//             message: "Error occured in logout Controller"
//         })
//     }
// }


// export const changePasswordController = async (req, res) => {
//     try {
//         const { password, answer } = req.body
//         console.log(req.body)
//         if (!password || !answer) return res.status(400).send({ success: false, message: 'All fields are required!' })

//         const canswer = await User.findOne({ email: req.user.email }, { answer: 1 })

//         console.log("canswer", canswer)

//         if(answer !== canswer.answer) return res.status(400).send({success: false, message: 'Unauthorized! Answer is Incorrect'})

//         const hashedPassword = await bcrypt.hash(password, 10)

//         const response = await User.findOneAndUpdate({ email: req.user.email }, { $set: { password: hashedPassword } }, { new: true }).select('-password -refreshToken')

//         console.log("response", response)

//         return res.status(200).send({
//             success: true,
//             message: 'Password Changed Successfully'
//         })
//     } catch (error) {
//         console.log(error)
//         return res.status(400).send({
//             success: false,
//             message: 'Some error occured in changePassword Controller',
//             error
//         })
//     }
// }



// export const userProfileController = async (req, res) => {
//     try {
//         const { user } = req.user
//         // console.log(user)
//         return res.status(200).send({
//             success: true,
//             message: 'User data fetched Successfully',
//             user
//         })
//     } catch (error) {
//         console.log(error)
//         return res.status(400).send({
//             success: false,
//             message: 'Some Error occuered in user Profile Controller'
//         })
//     }
// }



// export const updateUserController = async (req, res) => {
//     try {
//         const { name, email, phone, address, dateOfBirth, pincode, profileImage } = req.body

//         const user = req.user

//         if (
//             !name || !email || !phone || !address || !dateOfBirth || !pincode
//         ) {
//             return res.status(400).send({
//                 success: false,
//                 message: 'All fields are required'
//             })
//         }

//         const ImageLocalPath = req?.file?.path
//         let profileImageres
//         if (ImageLocalPath) {
//             profileImageres = await uploadOnCloudinary(ImageLocalPath)
//         }

//         let fileToPut

//         if (profileImageres) {
//             fileToPut = profileImageres.url
//         } else {
//             fileToPut = profileImage
//         }

//         const updatedUser = await User.findByIdAndUpdate(user._id, { email, name, phone, address, profileImage: fileToPut, pincode, dateOfBirth }, { new: true }).select('-password -refreshToken')

//         return res.status(200).send({
//             success: true,
//             message: 'User Updated Successfully',
//             user: updatedUser
//         })
//     } catch (error) {
//         console.log(error)
//         return res.status(400).send({
//             success: false,
//             message: 'Some Error occuered in user Update Controller',
//             error
//         })
//     }
// }


// export const addToCartController = async (req, res) => {
//     try {
//         const { productId, quantity, price, name } = req.body
//         const user = req.user

//         if (!productId) return res.status(404).send({ success: false, message: 'ProductId not found' })


//         if (quantity === undefined) {
//             try {
//                 const result = await User.findOneAndUpdate({ _id: user._id }, { $push: { cart: { productId, quantity: 1, price, name } } }, { new: true })

//                 // console.log("undefined: ",result)
//                 return res.status(200).send({
//                     success: true,
//                     message: 'Item added to cart successfully',
//                     result
//                 })
//             } catch (error) {
//                 console.log(error)
//             }
//         }

//         else if (quantity !== undefined) {
//             try {
//                 const result = await User.findOneAndUpdate(
//                     { _id: user._id, 'cart.productId': productId },
//                     { $set: { 'cart.$.quantity': quantity } }, { new: true }
//                 )

//                 // console.log("not undefined: ",result)
//                 return res.status(200).send({
//                     success: true,
//                     message: 'Item added to cart successfully',
//                     result
//                 })
//             } catch (error) {
//                 console.log(error)
//             }
//         }

//     } catch (error) {
//         console.log(error)
//         return res.status(400).send({
//             success: false,
//             message: 'Something went wrong in addToCart Controller'
//         })
//     }
// }



// export const updateCartController = async (req, res) => {
//     try {
//         const cart = req.body

//         if (!cart) return res.status(404).send({ success: false, message: 'Cart is found Empty' })

//         await User.findByIdAndUpdate(req.user._id, { $set: { cart: cart } }, { new: true })

//         return res.status(200).send({
//             success: true,
//             message: 'User Cart Updated Successfully!'
//         })
//     } catch (error) {
//         console.log(error)
//         return res.status(404).send({
//             success: false,
//             message: 'Something went wrong in updateCart Controller'
//         })
//     }
// }



// export const getCartController = async (req, res) => {
//     try {
//         const user = await User.findById(req.user._id)

//         return res.status(200).send({
//             success: true,
//             message: 'All Products in Cart Fetched successfully!',
//             cart: user.cart
//         })

//     } catch (error) {
//         console.log(error)
//         return res.status(400).send({
//             success: false,
//             message: 'Something went wrong in getCartItems Controller'
//         })
//     }
// }



// export const removeItemsFromUserCart = async (user) => {
//     try {
//         const { email, productsNameAndQuantity } = user

//         const result = await User.updateOne(
//             { email: email },
//             {
//                 $pull: {
//                     cart: {
//                         name: { $in: productsNameAndQuantity.map(item => item.name) }
//                     }
//                 }
//             }
//         )

//         return {
//             success: true,
//             message: 'Items Removed from cart Successfully',
//             result
//         }

//     } catch (error) {
//         console.log(error)
//         return {
//             success: false,
//             message: 'Something went wrong in remove Items from cart Controller'
//         }
//     }
// }



// export const InsertTransactionInOrder = async (data) => {
//     try {
//         const { status, totalAmount, billID, lineItems, paymentMethod, customerDetails } = data

//         const alpha3 = ['IND', 'CHN', 'JPN', 'NLD', 'ITA', 'USA', 'RUS', 'IRL', 'FRA', 'IDN', 'VNM', 'TWN', 'KOR', 'NOR', 'ESP', 'DEU', 'CAN', 'BRA', 'SAU', 'ARE', 'PRT', 'THA']

//         const alpha2 = ['IN', 'CH', 'JP', 'NL', 'IT', 'US', 'RU', 'IE', 'FR', 'ID', 'VN', 'TW', 'KR', 'NO', 'ES', 'DE', 'CA', 'BR', 'SA', 'AE', 'PT', 'TH']

//         const index = alpha2.findIndex(item => customerDetails.address.country === item)

//         const productsarray = lineItems.data.map((item) => (
//             { productName: item.description, units: item.quantity, price: item.amount_subtotal }
//         ))


//         const orderData = {
//             products: productsarray,
//             shippingAddress: {
//                 city: customerDetails.address.city,
//                 state: customerDetails.address.state,
//                 line1: customerDetails.address.line1,
//                 line2: customerDetails.address.line2,
//                 pincode: customerDetails.address.postal_code,
//                 country: alpha3[index]
//             },
//             billID,
//             totalAmount,
//             paymentMode: paymentMethod
//         }


//         const result = await User.findOneAndUpdate(
//             { email: customerDetails.email },
//             {
//                 $push: {
//                     orders: orderData
//                 }
//             },
//             { new: true }
//         )

//         return {
//             success: true,
//             result
//         }
//     } catch (error) {
//         console.log(error)
//         return
//     }
// }



// export const getAllOrders = async (req, res) => {
//     try {
//         const allOrders = await User.findOne({ email: req.user.email }, { orders: 1 })

//         return res.status(200).send({
//             success: true,
//             message: 'All Orders fetched Successfully',
//             allOrders
//         })
//     } catch (error) {
//         console.log(error)
//         return res.status(400).send({
//             success: false,
//             message: 'Something went wrong in getAllOrdersController'
//         })
//     }
// }



// export const getDashboardData = async (req, res) => {
//     try {
//         // console.log('Inside GetDashboard')

//         const totalSalesAndRevenue = await User.aggregate([
//             {
//                 $unwind: "$orders"
//             },
//             {
//                 $unwind: "$orders.products"
//             },
//             {
//                 $group: {
//                     _id: "$_id",
//                     name: { $first: "$name" },
//                     email: { $first: "$email" },
//                     totalSpent: { $sum: "$orders.totalAmount" },
//                     totalSales: { $sum: "$orders.products.units" }
//                 }
//             },
//             {
//                 $group: {
//                     _id: null,
//                     users: {
//                         $push: {
//                             name: "$name",
//                             email: "$email",
//                             totalSpent: "$totalSpent",
//                             totalSales: "$totalSales"
//                         }
//                     },
//                     totalRevenue: { $sum: "$totalSpent" },
//                     totalSaleCount: { $sum: "$totalSales" }
//                 }
//             },
//             {
//                 $project: {
//                     totalRevenue: 1,
//                     totalSaleCount: 1
//                 }
//             }
//         ])
//         // console.log('totalSalesAndRevenue', totalSalesAndRevenue)

//         const totalUser_totalProducts_topFiveCustomers = await User.aggregate([
//             {
//                 "$facet": {
//                     "totalUsers": [{ "$count": "count" }],
//                     "totalProducts": [
//                         {
//                             "$lookup": {
//                                 "from": "products",
//                                 "pipeline": [{ "$count": "count" }],
//                                 "as": "totalProducts"
//                             }
//                         },
//                         { "$unwind": "$totalProducts" },
//                         { "$replaceRoot": { "newRoot": "$totalProducts" } }
//                     ],
//                     "topCustomers": [
//                         { "$unwind": "$orders" },
//                         {
//                             "$group": {
//                                 "_id": "$_id",
//                                 "name": { "$first": "$name" },
//                                 "totalSpent": { "$sum": "$orders.totalAmount" }
//                             }
//                         },
//                         { "$sort": { "totalSpent": -1 } },
//                         { "$limit": 5 }
//                     ]
//                 }
//             }
//         ])
//         // console.log('totalUser_totalProducts_topFiveCustomers', totalUser_totalProducts_topFiveCustomers)

//         const allUsers = await User.find({}).sort('-1')
//         // console.log('allUsers', allUsers)

//         const topFiveMostSoldProducts = await User.aggregate([
//             {
//                 $unwind: "$orders"
//             },
//             {
//                 $unwind: "$orders.products"
//             },
//             {
//                 $group: {
//                     _id: "$orders.products.productName",
//                     totalSold: {
//                         $sum: "$orders.products.units"
//                     }
//                 }
//             },
//             {
//                 $sort: {
//                     totalSold: -1
//                 }
//             },
//             {
//                 $limit: 5
//             }
//         ])
//         // console.log('topFiveMostSoldProducts', topFiveMostSoldProducts)

//         const productsSoldEachMonth = await User.aggregate([
//             {
//                 $unwind: "$orders"
//             },
//             {
//                 $unwind: "$orders.products"
//             },
//             {
//                 $group: {
//                     _id: {
//                         year: { $year: "$orders.createdAt" },
//                         month: { $month: "$orders.createdAt" }
//                     },
//                     totalProductsSold: { $sum: 1 }
//                 }
//             },
//             {
//                 $project: {
//                     year: "$_id.year",
//                     month: "$_id.month",
//                     totalProductsSold: 1,
//                     _id: 0
//                 }
//             }
//         ])

//         const OrdersPlacedInCountries = await User.aggregate([
//             {
//                 "$unwind": "$orders"
//             },
//             {
//                 "$group": {
//                     "_id": "$orders.shippingAddress.country",
//                     "numberOfOrders": {
//                         "$sum": 1
//                     }
//                 }
//             },
//             {
//                 "$project": {
//                     "country": "$_id",
//                     "numberOfOrders": 1
//                 }
//             }
//         ])


//         return res.status(200).send({
//             success: true,
//             totalSalesAndRevenue,
//             totalUser_totalProducts_topFiveCustomers,
//             allUsers,
//             topFiveMostSoldProducts,
//             productsSoldEachMonth,
//             OrdersPlacedInCountries
//         })

//     } catch (error) {
//         console.log(error)
//         return res.status(400).send({
//             success: false,
//             message: 'Something went wrong in getDashboardData Controller'
//         })
//     }
// }



