import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Result(){
  const nav = useNavigate()
  const raw = localStorage.getItem('jee_result')
  if(!raw) return <div style={{padding:20}}>No result found.</div>
  const r = JSON.parse(raw)
  return (
    <div>
      <div className="header"><div>JEE 2027 - PEER GROUP TESTS</div></div>
      <div className="container">
        <div className="card">
          <h3>Score Card</h3>
          <table className="result-table">
            <tbody>
              <tr><th>Total Question</th><td>{r.total}</td><th>Total Attempted</th><td>{r.attempted}</td></tr>
              <tr><th>Correct Answers</th><td>{r.correct}</td><th>Incorrect Answers</th><td>{r.incorrect}</td></tr>
              <tr><th>Score</th><td>{r.score}</td><td></td><td></td></tr>
            </tbody>
          </table>

          <h4 style={{marginTop:16}}>Question-wise</h4>
          <table className="result-table" style={{width:'100%',marginTop:8}}>
            <thead><tr><th>Q No.</th><th>Selected Option / Answer</th><th>Status</th><th>Correct Option</th></tr></thead>
            <tbody>
              {r.questions.map(q=>{
                const sel = r.answers[q.id]===null ? '---' : r.answers[q.id]
                const status = r.answers[q.id]===null ? 'N/A' : 'Attempted'
                return <tr key={q.id}><td>{q.id}</td><td>{sel}</td><td>{status}</td><td>{q.answer}</td></tr>
              })}
            </tbody>
          </table>

          <div style={{marginTop:12, display:'flex', gap:8}}>
            <button className="btn" onClick={()=>{
              // clear all exam keys to ensure exam cannot be re-entered
              localStorage.removeItem('jee_result')
              localStorage.removeItem('jee_answers')
              localStorage.removeItem('jee_marked')
              localStorage.removeItem('jee_marks')
              localStorage.removeItem('jee_timeleft')
              localStorage.removeItem('jee_current')
              nav('/', {replace:true})
            }}>Finish / Logout</button>

           
          </div>
        </div>
      </div>
    </div>
  )
}
