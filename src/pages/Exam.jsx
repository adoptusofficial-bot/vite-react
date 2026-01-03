import React, {useEffect, useState, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import questionsData from '../data/questions.json'

function formatTime(seconds){
  const h = Math.floor(seconds/3600).toString().padStart(2,'0')
  const m = Math.floor((seconds%3600)/60).toString().padStart(2,'0')
  const s = Math.floor(seconds%60).toString().padStart(2,'0')
  return `${h}:${m}:${s}`
}

export default function Exam({user}){
  const navigate = useNavigate()
  const exam = questionsData.exam
  const qlist = questionsData.questions
  const total = exam.totalQuestions
  const durationSeconds = exam.duration * 60
  const [timeLeft, setTimeLeft] = useState(()=>{
    const saved = localStorage.getItem('jee_timeleft')
    return saved ? parseInt(saved,10) : durationSeconds
  })
  const [current, setCurrent] = useState(()=>{
    const s = localStorage.getItem('jee_current')
    return s ? parseInt(s,10) : 1
  })
  const [answers, setAnswers] = useState(()=>{
    const s = localStorage.getItem('jee_answers')
    return s ? JSON.parse(s) : Array(total+1).fill(null)
  })
  const [marks, setMarks] = useState(()=>{ const s = localStorage.getItem('jee_marks'); return s ? JSON.parse(s) : Array(total+1).fill(false) })
  const [marked, setMarked] = useState(()=>{ const s = localStorage.getItem('jee_marked'); return s ? JSON.parse(s) : Array(total+1).fill(false) })
  const timerRef = useRef(null)

  useEffect(()=>{
    if(!user) { navigate('/'); return; }
    // If exam already submitted, redirect to result (prevents back navigation into exam after submit)
    if(localStorage.getItem('jeeresult')) { navigate('/result', {replace:false}); return }
    timerRef.current = setInterval(()=> {
      setTimeLeft(t => {
        if(t<=1){ clearInterval(timerRef.current); handleSubmit(true); return 0 }
        const nt = t-1
        localStorage.setItem('jee_timeleft', nt)
        return nt
      })
    }, 1000)
    return ()=> clearInterval(timerRef.current)
  },[])

  useEffect(()=>{
    localStorage.setItem('jee_answers', JSON.stringify(answers))
    localStorage.setItem('jee_marked', JSON.stringify(marked))
    localStorage.setItem('jee_marks', JSON.stringify(marks))
  },[answers, marked, marks])

  function qById(id){
    return qlist.find(q => q.id === id)
  }

  function handleSelectOption(qid, opt){
    const arr = [...answers]
    arr[qid] = opt
    setAnswers(arr)
    const m = [...marks]; m[qid] = !!opt; setMarks(m)
  }

  function handleEnterInteger(qid, val){
    const arr = [...answers]; arr[qid] = val; setAnswers(arr)
    const m = [...marks]; m[qid] = !!val; setMarks(m)
  }

  function clearAnswer(qid){
    const arr = [...answers]; arr[qid] = null; setAnswers(arr)
    const m = [...marks]; m[qid] = false; setMarks(m)
  }

  function toggleMark(qid){
    const m = [...marked]; m[qid] = !m[qid]; setMarked(m)
  }

  function goTo(qid){
    setCurrent(qid)
    localStorage.setItem('jee_current', qid)
  }

  function saveAndNext(){
    if(current < total) goTo(current+1)
  }

  function markForReviewNext(){
    toggleMark(current)
    saveAndNext()
  }

  function handleSubmit(isAuto=false){
    // compute score and redirect to result page with payload in localStorage
    const qarr = qlist
    let score = 0, correct=0, incorrect=0, attempted=0
    for(const q of qarr){
      const sel = answers[q.id]
      if(sel===null || sel===undefined || sel==='') continue
      attempted++
      if(q.type==='mcq'){
        if(String(sel) === String(q.answer)){ score += 4; correct++ }
        else { score -= 1; incorrect++ }
      } else {
        const a = String(q.answer).trim()
        const s = String(sel).trim()
        if(s===a){ score += 4; correct++ } else { score -= 1; incorrect++ }
      }
    }
    const result = { total: total, attempted, correct, incorrect, score, answers, questions: qarr, autoSubmitted: !!isAuto }
    localStorage.setItem('jee_result', JSON.stringify(result))
    // clear sensitive exam state to prevent back navigation into exam
    localStorage.removeItem('jee_answers')
    localStorage.removeItem('jee_marked')
    localStorage.removeItem('jee_marks')
    localStorage.removeItem('jee_timeleft')
    // navigate replace to remove exam from history
    navigate('/result', {replace:true})
  }

  function statusOf(id){
    if(answers[id]===null || answers[id]===undefined) {
      return marked[id] ? 'marked' : 'notAnswered'
    } else {
      return marked[id] ? 'answeredMarked' : 'answered'
    }
  }

  return (
    <div>
      <div className="header"><div>JEE 2027 - PEER GROUP TESTS</div></div>
      <div className="container">
        <div className="top-info card">
          <div>
            <strong>Candidate Name :</strong> {user?.name || 'N/A'} <br/>
            <strong>Exam :</strong> {exam.name}
          </div>
          <div style={{textAlign:'right'}}>
            <div className="timer">Remaining Time: {formatTime(timeLeft)}</div>
          </div>
        </div>

        <div className="exam-layout">
          <div className="left">
            <div className="question-box card">
              <h4>Question {current}:</h4>
              <div style={{minHeight:140}}>
                {(() => {
                  const q = qById(current)
                  if(!q) return <div>Question not found</div>
                  return (
                    <div>
                      <p><strong>{q.question}</strong></p>
                      {q.type === 'mcq' ? (
                        <div>
                          {Object.entries(q.options).map(([k,v])=>(
                            <div key={k} style={{margin:'6px 0'}}>
                              <label style={{cursor:'pointer'}}>
                                <input type="radio" name={'q'+q.id} checked={answers[q.id]===k} onChange={()=>handleSelectOption(q.id,k)} /> <strong style={{marginLeft:8}}>{k})</strong> <span style={{marginLeft:6}}>{v}</span>
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>
                          <input className="input" placeholder="Enter numeric answer" value={answers[q.id]||''} onChange={e=>handleEnterInteger(q.id, e.target.value)} />
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>

              <div className="controls">
                <button className="btn btn-green" onClick={()=>{ saveAndNext() }}>
                  <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="white" strokeWidth="2"/></svg>
                  SAVE & NEXT
                </button>

                <button className="btn btn-clear" onClick={()=>{ clearAnswer(current) }}>
                  CLEAR
                </button>

                <button className="btn btn-orange" onClick={()=>{ toggleMark(current); saveAndNext() }}>
                  SAVE & MARK FOR REVIEW
                </button>

                <button className="btn btn-blue" onClick={()=>{ toggleMark(current); saveAndNext() }}>
                  MARK FOR REVIEW & NEXT
                </button>

                <div style={{marginLeft:'auto'}}>
                  <button className="btn" onClick={()=>{ if(current>1) goTo(current-1) }}>&lt;&lt; BACK</button>
                  <button className="btn" onClick={()=>{ if(current<total) goTo(current+1) }}>NEXT &gt;&gt;</button>
                  <button className="btn btn-submit" onClick={()=>{ if(window.confirm('Submit exam?')) handleSubmit(false) }}>SUBMIT</button>
                </div>
              </div>
            </div>

            <div style={{marginTop:12}} className="card">
              <strong>Navigation</strong>
              <div style={{marginTop:8}}>
                <button className="btn btn-primary" onClick={()=>goTo(1)}>Go to Q1</button>
                <button className="btn" onClick={()=>{ alert('Use palette to navigate directly.') }}>Palette Help</button>
              </div>
            </div>
          </div>

          <div className="right">
            <div className="palette card">
              <div style={{marginBottom:8}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div><strong>Legend</strong></div>
                  <div><select className="lang-select"><option>English</option></select></div>
                </div>
              </div>
              <div className="legend-box">
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}><div style={{width:16,height:16,background:'#fff',border:'1px solid #ccc'}}></div> Not Visited</div>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}><div style={{width:16,height:16,background:'#f8d7da'}}></div> Not Answered</div>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}><div style={{width:16,height:16,background:'#d4edda'}}></div> Answered</div>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}><div style={{width:16,height:16,background:'#e2d5f7'}}></div> Marked for Review</div>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}><div style={{width:16,height:16,background:'#d1f0f0'}}></div> Answered & Marked</div>
                </div>
              </div>
              <hr/>
              <div style={{maxHeight:360,overflowY:'auto',padding:6}}>
                {Array.from({length:total},(_,i)=>i+1).map(n=>{
                  const st = statusOf(n)
                  return <div key={n} style={{display:'inline-block'}}><div className={'qnum '+st} onClick={()=>goTo(n)}>{String(n).padStart(2,'0')}</div></div>
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="footer-note">© Mock CBT - For practice only</div>
      </div>
    </div>
  )
}
