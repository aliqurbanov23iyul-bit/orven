const crypto=require('node:crypto');
const hash=x=>crypto.createHash('sha256').update(String(x)).digest();
const equal=(a,b)=>crypto.timingSafeEqual(hash(a),hash(b));
const sign=(value,secret)=>crypto.createHmac('sha256',secret).update(value).digest('base64url');
function token(env,now=Date.now()){const data=Buffer.from(JSON.stringify({role:'admin',exp:now+8*60*60*1000,version:hash(env.ADMIN_PASSWORD).toString('hex')})).toString('base64url');return data+'.'+sign(data,env.SESSION_SECRET)}
function authenticated(req,env,now=Date.now()){if(!env.SESSION_SECRET||!env.ADMIN_PASSWORD)return false;try{const match=(req.headers.cookie||'').split(';').map(v=>v.trim()).find(v=>v.startsWith('orven_session='));if(!match)return false;const [data,sig,extra]=match.slice('orven_session='.length).split('.');if(extra||!data||!sig||!equal(sig,sign(data,env.SESSION_SECRET)))return false;const obj=JSON.parse(Buffer.from(data,'base64url'));return obj.role==='admin'&&obj.exp>now&&equal(obj.version,hash(env.ADMIN_PASSWORD).toString('hex'))}catch{return false}}
function cookie(value,req,maxAge=28800){const secure=req.headers['x-forwarded-proto']==='https'||process.env.VERCEL||req.socket?.encrypted;return `orven_session=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure?'; Secure':''}`}
module.exports={equal,token,authenticated,cookie,hash};
