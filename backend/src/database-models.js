import mongoose from 'mongoose';
const {Schema,model}=mongoose;
export const User=model('User',new Schema({name:String,email:{type:String,unique:true},passwordHash:String},{timestamps:true}));
export const Brand=model('Brand',new Schema({brandName:String,description:String,image:String}));
export const Product=model('Product',new Schema({brandId:{type:Schema.Types.ObjectId,ref:'Brand'},productName:String,category:String,price:Number,description:String,rating:Number,image:String,shades:[{shadeName:String,shadeHex:String}],reviews:[{userName:String,rating:Number,reviewText:String,createdAt:Date}]}));
export const Cart=model('Cart',new Schema({userId:{type:Schema.Types.ObjectId,ref:'User'},items:[{productId:{type:Schema.Types.ObjectId,ref:'Product'},shadeName:String,quantity:Number}]}));
export const Wishlist=model('Wishlist',new Schema({userId:{type:Schema.Types.ObjectId,ref:'User'},productIds:[{type:Schema.Types.ObjectId,ref:'Product'}]}));
export const Order=model('Order',new Schema({
  orderNumber:{type:String,unique:true,index:true},
  customer:{name:String,email:String,phone:String,address:String,city:String,state:String,pin:String,country:String},
  paymentMethod:{type:String,enum:['Card','UPI','Cash on Delivery']},
  items:[{productId:String,productName:String,brand:String,shadeName:String,quantity:Number,price:Number}],
  subtotal:Number,shipping:Number,total:Number,status:{type:String,default:'confirmed'}
},{timestamps:true}));
