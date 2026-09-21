import express from 'express'; import cors from 'cors'; import dotenv from 'dotenv'; import mongoose from 'mongoose'; import {randomBytes,scryptSync,timingSafeEqual} from 'crypto'; import {products} from '../../frontend/src/data/product-catalog.js'; import {Order,User} from './database-models.js'; dotenv.config();
const app=express(); app.use(cors()); app.use(express.json());
app.use(async (req, res, next) => {
  try {
    if (process.env.MONGODB_URI && mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    next();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    next(); // still proceed, but readyState check in routes will catch it
  }
});
const hashPassword=password=>{const salt=randomBytes(16).toString('hex'); const hash=scryptSync(password,salt,64).toString('hex'); return `${salt}:${hash}`};
const verifyPassword=(password,stored)=>{const [salt,key]=String(stored||'').split(':'); if(!salt||!key)return false; const hash=scryptSync(password,salt,64); const saved=Buffer.from(key,'hex'); return saved.length===hash.length&&timingSafeEqual(saved,hash)};
app.get('/api/health',(req,res)=>res.json({status:'ok',mode:mongoose.connection.readyState===1?'mongodb':'demo'}));
app.get('/api/products',(req,res)=>res.json(products)); app.get('/api/products/:id',(req,res)=>res.json(products.find(p=>p.id===req.params.id)||{}));
app.get('/api/brands',(req,res)=>res.json(['M·A·C','Fenty Beauty','K-Beauty','Rare Beauty'])); app.get('/api/categories',(req,res)=>res.json(['Foundation','Concealer','Blush','Lip','Highlighter','Eyes']));
app.post('/api/auth/register',async(req,res)=>{try{if(mongoose.connection.readyState!==1)return res.status(503).json({message:'MongoDB is not connected.'}); const name=String(req.body.name||'').trim(); const email=String(req.body.email||'').trim().toLowerCase(); const password=String(req.body.password||''); if(!name||!email||password.length<4)return res.status(400).json({message:'Name, email, and a password of at least 4 characters are required.'}); const user=await User.create({name,email,passwordHash:hashPassword(password)}); res.status(201).json({user:{id:user._id,name:user.name,email:user.email},storedIn:'MongoDB'});}catch(error){if(error.code===11000)return res.status(409).json({message:'An account with this email already exists.'}); console.error('Registration error:',error.message); res.status(500).json({message:'Could not create account.'});}});
app.post('/api/auth/login',async(req,res)=>{try{if(mongoose.connection.readyState!==1)return res.status(503).json({message:'MongoDB is not connected.'}); const email=String(req.body.email||'').trim().toLowerCase(); const password=String(req.body.password||''); const user=await User.findOne({email}); if(!user||!verifyPassword(password,user.passwordHash))return res.status(401).json({message:'Invalid email or password.'}); res.json({user:{id:user._id,name:user.name,email:user.email},storedIn:'MongoDB'});}catch(error){console.error('Login error:',error.message); res.status(500).json({message:'Could not sign in.'});}});
app.post('/api/cart',(req,res)=>res.status(201).json({message:'Cart item stored (demo)',item:req.body}));
app.post('/api/orders',async(req,res)=>{const orderNumber=`MM-${Date.now().toString().slice(-7)}`; try { if(mongoose.connection.readyState===1){const order=await Order.create({orderNumber,...req.body}); return res.status(201).json({orderId:order._id,orderNumber:order.orderNumber,status:order.status,storedIn:'MongoDB'});} return res.status(201).json({orderNumber,status:'confirmed',storedIn:'browser demo'}); }catch(error){console.error('Order save error:',error.message);res.status(500).json({message:'Could not save order',error:error.message});}});
app.get('/api/orders',async(req,res)=>{try{if(mongoose.connection.readyState!==1)return res.json([]);res.json(await Order.find().sort({createdAt:-1}).lean());}catch(error){res.status(500).json({message:error.message});}});
app.get('/api/orders/:id',async(req,res)=>{try{if(mongoose.connection.readyState!==1)return res.json({orderNumber:req.params.id,status:'demo'});res.json(await Order.findOne({$or:[{_id:mongoose.isValidObjectId(req.params.id)?req.params.id:null},{orderNumber:req.params.id}]}).lean());}catch(error){res.status(500).json({message:error.message});}});
let dbReady = null;
function connectDB() {
  if (!dbReady) {
    dbReady = mongoose.connect(process.env.MONGODB_URI)
      .then(() => console.log('MongoDB connected'))
      .catch((err) => { dbReady = null; throw err; });
  }
  return dbReady;
}

if (process.env.NODE_ENV !== 'production') {
    const port = Number(process.env.PORT || 5000);
    app.listen(port, () => console.log(`Luma API running on http://localhost:${port}`));
}
export default app;

