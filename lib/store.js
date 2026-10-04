const {neon}=require('@neondatabase/serverless');
const fs=require('node:fs');const path=require('node:path');
const defaults=require('../assets/data/defaults.json');
const schema=fs.readFileSync(path.join(__dirname,'../database/schema.sql'),'utf8').split(';').map(s=>s.trim()).filter(Boolean);
function createStore(query){let ready;const init=()=>ready??=(async()=>{for(const statement of schema)await query(statement,[])})().catch(e=>{ready=null;throw e});
 return {
  async read(){await init();const rows=await query('SELECT payload, revision, updated_at FROM orven_store WHERE id = $1',[1]);return rows[0]?{...rows[0].payload,revision:rows[0].revision,updatedAt:rows[0].updated_at}:{...structuredClone(defaults),revision:0,updatedAt:null}},
  async write(data,revision){await init();const sql=revision===0?'INSERT INTO orven_store (id,payload,revision) VALUES (1,$1::jsonb,1) ON CONFLICT(id) DO NOTHING RETURNING revision, updated_at':'UPDATE orven_store SET payload = $1::jsonb, revision = revision + 1, updated_at = NOW() WHERE id = 1 AND revision = $2 RETURNING revision, updated_at';const rows=await query(sql,revision===0?[JSON.stringify(data)]:[JSON.stringify(data),revision]);return rows[0]?{...data,revision:rows[0].revision,updatedAt:rows[0].updated_at}:null},
  async attempt(key){await init();const rows=await query("INSERT INTO orven_login_limits (key, attempts, window_start) VALUES ($1,1,NOW()) ON CONFLICT(key) DO UPDATE SET attempts = CASE WHEN orven_login_limits.window_start < NOW() - INTERVAL '15 minutes' THEN 1 ELSE orven_login_limits.attempts + 1 END, window_start = CASE WHEN orven_login_limits.window_start < NOW() - INTERVAL '15 minutes' THEN NOW() ELSE orven_login_limits.window_start END RETURNING attempts",[key]);return rows[0].attempts<=10},
  async clear(key){await init();await query('DELETE FROM orven_login_limits WHERE key = $1',[key])}
 }
}
let instance;function getStore(){if(!process.env.DATABASE_URL)throw Error('DATABASE_URL yoxdur.');if(!instance){const sql=neon(process.env.DATABASE_URL);instance=createStore((q,p)=>sql.query(q,p))}return instance}
module.exports={createStore,getStore};
