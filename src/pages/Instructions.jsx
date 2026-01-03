import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
export default function Instructions({user}){
  const [agree, setAgree] = useState(false)
  const nav = useNavigate()
  if(!user) return <div style={{padding:20}}>Please login first</div>
  return (
    <div>
      <div className="header"><div className="brand">JEE 2027 - PEER GROUP TESTS</div></div>
      <div className="container">
        <div className="card">
          <h3>Please read the instructions carefully</h3>
          <div className="instructions">
            <ol>
              <li>Total duration of the test is <strong>180 minutes</strong>.</li>
              <li>The clock will be set at the server. The countdown timer in the top right corner of screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself.</li>
              <li>The Questions Palette displayed on the right side of screen will show the status of each question using one of the following symbols:
                <ul>
                  <li>A white square: You have not visited the question yet.</li>
                  <li>A red square: You have NOT answered the question.</li>
                  <li>A green square: You have answered the question.</li>
                  <li>A purple square: You have NOT answered the question, but have marked the question for review.</li>
                  <li>A cyan square: The question(s) "Answered and Marked for Review" will be considered for evaluation.</li>
                </ul>
              </li>
              <li>To answer a question, select the option and then click <strong>SAVE & NEXT</strong>. To deselect, click on the chosen option again and press <strong>CLEAR</strong>.</li>
              <li>Use <strong>MARK FOR REVIEW & NEXT</strong> to mark a question and move to next question without saving as final.</li>
              <li>Scoring: <strong>+4</strong> for correct, <strong>-1</strong> for incorrect, <strong>0</strong> for unattempted.</li>
              <li>There are 75 questions. First 25 Physics (20 MCQ + 5 Integer), next 25 Chemistry, last 25 Maths. Integer questions have numeric answers only.</li>
            </ol>

            <p style={{marginTop:8}}><input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} /> I have read and understood the instructions.</p>

            <div style={{textAlign:'center',marginTop:12}}>
              <button className="btn btn-green" disabled={!agree} onClick={()=>nav('/exam')}>PROCEED</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
