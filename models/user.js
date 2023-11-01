const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true   
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: { type: Schema.Types.ObjectId ,ref: 'Products', required: true}, quantity:{type: Number,required: true}
            }
        ]
    }

})

userSchema.methods.addtoCart = function(product){
    const cartproductindex = this.cart.items.findIndex(cp=>{
        return cp.productId.toString() === product._id.toString()
    })
    let newQuantity = 1;
    const updatedCartitems = [...this.cart.items]
    if(cartproductindex >=0){
        newQuantity = this.cart.items[cartproductindex].quantity + 1
        updatedCartitems[cartproductindex].quantity = newQuantity
    }else{
        updatedCartitems.push({productId: product._id,quantity : newQuantity})
    }
    const updatedCart = {items: updatedCartitems}
    this.cart = updatedCart
    return this.save()
}

userSchema.methods.deletePostCart = function(prodId){
    const updatedCartItems = this.cart.items.filter(pro=>{
    return pro.productId.toString() !== prodId.toString()
    })
    const updatedCart = {items: updatedCartItems}
    this.cart = updatedCart
    return this.save()
}

module.exports = mongoose.model('User',userSchema)


// const mongodb = require('mongodb');
// const { get } = require('../routes/admin');
// const getDb = require('../util/database').getDb

// const ObjectId = mongodb.ObjectId

// class User{
//   constructor(name, email,cart,id){
//     this.name = name;
//     this.email = email;
//     this.cart = cart;
//     this._id = id
//   }
//   save(){
//     const db = getDb();
//     return db
//     .collection('users')
//     .insertOne(this)
//     .then(user=>{
//       console.log(user)
//     }).catch(err=>{
//       console.log(err)
//     })
//   }
//   getCart(){
//     const db = getDb()
//     let productids = this.cart.items.map(m=>{
//       return m.productId
//     })
//     return db.collection('products').find({_id: {$in: productids}})
//     .toArray()
//     .then(products=>{
//       return products.map(p=>{
//           return {
//             ...p,
//             quantity: this.cart.items.find(i=>{
//             return i.productId.toString() === p._id.toString()
//           }).quantity
//         }
//       })
//     })
//   }
//   deletePostCart(prodId){
//     const updatedCartItems = this.cart.items.filter(pro=>{
//       return pro.productId.toString() !== prodId.toString()
//     })
//     const updatedCart = {items: updatedCartItems}
//     const db = getDb()
//     return db
//     .collection('users')
//     .updateOne(
//       {_id : new ObjectId(this._id)},
//       {$set: {cart: updatedCart}}
//     )
//   }
//   addtoCart(product){
//     const cartproductindex = this.cart.items.findIndex(cp=>{
//       return cp.productId.toString() === product._id.toString()
//     })
//     let newQuantity = 1;
//     const updatedCartitems = [...this.cart.items]
//     if(cartproductindex >=0){
//       newQuantity = this.cart.items[cartproductindex].quantity + 1
//       updatedCartitems[cartproductindex].quantity = newQuantity
//     }else{
//       updatedCartitems.push({productId: new ObjectId(product._id),quantity : newQuantity})
//     }
//     const updatedCart = {items: updatedCartitems}
//     const db = getDb()
//     return db
//     .collection('users')
//     .updateOne(
//       {_id : new ObjectId(this._id)},
//       {$set: {cart: updatedCart}}
//     )
//   }

//   placeOrder(){
//     const db=getDb()
//     return this.getCart().then(products=>{
//       const order = {
//         items: products,
//         user: {
//           _id: this._id,
//           name: this.name,
//         }
//       }
//       return db.collection('orders').insertOne(order)
//     }).then(res=>{
//       this.cart = {items: []}
//       return db
//       .collection('users')
//       .updateOne(
//         {_id : new ObjectId(this._id)},
//         {$set: {cart: {items: []}}}
//       )
//     })
//   }
//   getOrders(){
//     const db = getDb()
//     return db.collection('orders').find({'user._id': this._id}).toArray()
//   }

//   static findById(userId){
//     const db = getDb()
//     return db
//     .collection('users')
//     .findOne({_id: new ObjectId(userId)})
//     .then(user=>{
//       console.log(user)
//       return user
//     })
//     .catch(err=>{
//       console.log(err)
//     })
//   }
// }

// module.exports = User;
