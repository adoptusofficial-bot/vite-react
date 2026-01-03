import React, {useState} from 'react'

export default function Login({onLogin, users}){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')

  function handleSubmit(e){
    e?.preventDefault()
    const found = users.find(u => u.username === username && u.password === password)
    if(found){
      onLogin(found)
    } else {
      setErr('Invalid username or password')
    }
  }

  return (
    <div>
      <div className="header">
        <div style={{flex:1}} className="brand">JEE 2027 - PEER GROUP TESTS</div>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <div style={{fontSize:13,color:'#cfe9ff'}}>Practice CBT environment</div>
        </div>
      </div>

      <div className="container">
        <div className="login-hero">
          <div style={{maxWidth:960, margin:'0 auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',color:'#fff'}}>
              <div>
                <div style={{fontSize:22,fontWeight:700}}>Sample Mock Test Environment</div>
                <div style={{marginTop:6}}>Simulated CBT UI for JEE practice</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div
  style={{
    background: '#fff',
    color: '#052d50',
    padding: '6px 10px',
    borderRadius: 4,
    fontWeight: 700
  }}
>
  Home
</div>
              </div>
            </div>

            <div className="login-center" style={{marginTop:18}}>
              <div style={{textAlign:'center',marginBottom:8}}>
                <strong>Login (Demo)</strong>
                <div className="small-note">Enter your credentials to begin the mock exam</div>
              </div>

              <form className="login-form" onSubmit={handleSubmit}>
                <input className="input" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
                <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
                <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:8}}>
                  <button className="btn btn-login" type="submit">
                    <svg viewBox="0 0 24 24" fill="none" style={{verticalAlign:'middle'}}><path d="M12 3v18" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                    LOGIN
                  </button>
                </div>
                {err && <div style={{color:'crimson',marginTop:10,textAlign:'center'}}>{err}</div>}
                <div className="hint" style={{textAlign:'center',marginTop:10}}>Use credentials from `src/data/users.json`</div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
