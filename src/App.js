import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import { jsPDF } from 'jspdf';

const QUESTIONS = [
  { id: 1, q: 'What is the capital of India?', options: ['Mumbai', 'Delhi', 'Kolkata', 'Chennai'], ans: 1 },
  { id: 2, q: 'Which language runs in a web browser?', options: ['Java', 'C++', 'JavaScript', 'Python'], ans: 2 },
  { id: 3, q: 'HTML stands for?', options: ['Hyper Trainer Marking Language', 'HyperText Markup Language', 'HyperText Makeup Language', 'HyperText Markdown Language'], ans: 1 },
  { id: 4, q: 'CSS is used for?', options: ['Structure', 'Styling', 'Database', 'Logic'], ans: 1 },
  { id: 5, q: 'React is a _______.', options: ['Library', 'Database', 'OS', 'Language'], ans: 0 },
  { id: 6, q: 'Which company created React?', options: ['Google', 'Facebook', 'Microsoft', 'Twitter'], ans: 1 },
  { id: 7, q: '2 + 2 * 2 = ?', options: ['6', '8', '4', '10'], ans: 0 },
  { id: 8, q: 'Largest planet in our Solar System?', options: ['Earth', 'Mars', 'Jupiter', 'Saturn'], ans: 2 },
  { id: 9, q: 'HTTP stands for?', options: ['HyperText Transfer Protocol', 'HyperTool Transfer Program', 'HyperText Transmission Protocol', 'None'], ans: 0 },
  { id: 10, q: 'Which of these is a JS framework?', options: ['Laravel', 'Django', 'Angular', 'Flask'], ans: 2 },
  { id: 11, q: 'Binary of decimal 5 is?', options: ['101', '110', '010', '011'], ans: 0 },
  { id: 12, q: 'Which gas do plants absorb?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'], ans: 1 },
  { id: 13, q: 'Speed of light (approx) km/s?', options: ['300000', '150000', '30', '30000'], ans: 0 },
  { id: 14, q: 'CSS selector for id uses?', options: ['.', '#', '*', '!'], ans: 1 },
  { id: 15, q: 'Full form of SQL?', options: ['Structured Query Language', 'Simple Query Language', 'Sequential Query Language', 'Stylish Query Language'], ans: 0 },
  { id: 16, q: 'Which is not a programming paradigm?', options: ['Functional', 'Object-oriented', 'Relational', 'Procedural'], ans: 2 },
  { id: 17, q: 'Which organ pumps blood?', options: ['Liver', 'Lungs', 'Heart', 'Kidney'], ans: 2 },
  { id: 18, q: 'Which one is a NoSQL database?', options: ['MySQL', 'MongoDB', 'PostgreSQL', 'SQLite'], ans: 1 },
  { id: 19, q: 'Which is used to style web pages?', options: ['HTML', 'JS', 'CSS', 'SQL'], ans: 2 },
  { id: 20, q: 'Mount Everest is located in?', options: ['India', 'Nepal/China border', 'USA', 'Australia'], ans: 1 },
  { id: 21, q: 'Which element has symbol O?', options: ['Gold', 'Oxygen', 'Sodium', 'Silver'], ans: 1 },
  { id: 22, q: 'Which year did JavaScript first appear?', options: ['1995', '2000', '1990', '1985'], ans: 0 },
  { id: 23, q: 'Smallest prime number?', options: ['0', '1', '2', '3'], ans: 2 },
  { id: 24, q: 'Who wrote Romeo and Juliet?', options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'], ans: 1 },
  { id: 25, q: 'Which device converts digital to analog?', options: ['Modem', 'Router', 'Switch', 'Hub'], ans: 0 },
];

export default function App() {
  const [step, setStep] = useState('register');
  const [candidate, setCandidate] = useState({ name: '', email: '', mobile: '' });
  const [timeLeft, setTimeLeft] = useState(600);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [score, setScore] = useState(0);
  const [feedbacks, setFeedbacks] = useState(Array(QUESTIONS.length).fill(null));
  const timerRef = useRef(null);

  useEffect(() => {
    if (step === 'exam') {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            finishExam();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [step]);

  const startExam = () => {
    if (!candidate.name || !candidate.email || !candidate.mobile) {
      alert('Please fill all details');
      return;
    }
    setStep('exam');
  };

  const selectOption = (qIndex, optionIndex) => {
    if (answers[qIndex] !== null) return;
    const newAnswers = [...answers];
    newAnswers[qIndex] = optionIndex;
    setAnswers(newAnswers);

    const correct = QUESTIONS[qIndex].ans === optionIndex;
    if (correct) setScore((s) => s + 1);

    const newFb = [...feedbacks];
    newFb[qIndex] = correct ? '✅ Correct' : '❌ Wrong';
    setFeedbacks(newFb);
  };

  const nextQ = () => {
    if (currentQ < QUESTIONS.length - 1) setCurrentQ((q) => q + 1);
    else finishExam();
  };

  const prevQ = () => {
    if (currentQ > 0) setCurrentQ((q) => q - 1);
  };

  const finishExam = () => {
    clearInterval(timerRef.current);
    setStep('result');
  };

  const resetExam = () => {
    setStep('register');
    setCandidate({ name: '', email: '', mobile: '' });
    setAnswers(Array(QUESTIONS.length).fill(null));
    setFeedbacks(Array(QUESTIONS.length).fill(null));
    setCurrentQ(0);
    setScore(0);
    setTimeLeft(600);
  };

  const formatTime = (t) => `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Nandi Softech Solutions', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Marks Card', 105, 35, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Candidate Name: ${candidate.name}`, 20, 55);
    doc.text(`Email: ${candidate.email}`, 20, 65);
    doc.text(`Mobile: ${candidate.mobile}`, 20, 75);
    doc.text(`Total Marks: ${QUESTIONS.length}`, 20, 95);
    doc.text(`Obtained Marks: ${score}`, 20, 105);
    doc.text(`Result: ${score >= 15 ? 'PASS' : 'FAIL'}`, 20, 115);
    doc.text(`Date of Exam: ${new Date().toLocaleString()}`, 20, 125);

    doc.save(`${candidate.name.replace(/\s+/g, '_')}_marks_card.pdf`);
  };

  return (
    <div className="app-root">
      <header className="header">Nandi Softech Solutions</header>

      {step === 'register' && (
        <div className="card">
          <h2>Registration</h2>
          <input placeholder="Full Name" value={candidate.name} onChange={(e) => setCandidate({ ...candidate, name: e.target.value })} />
          <input placeholder="Email" value={candidate.email} onChange={(e) => setCandidate({ ...candidate, email: e.target.value })} />
          <input placeholder="Mobile" value={candidate.mobile} onChange={(e) => setCandidate({ ...candidate, mobile: e.target.value })} />
          <button className="btn primary" onClick={startExam}>Start Exam</button>
          <p className="muted">⏱ Time Limit: 10 Minutes (Countdown starts after clicking “Start Exam”)</p>
        </div>
      )}

      {step === 'exam' && (
        <div className="card exam">
          <div className="exam-header">
            <span><strong>Candidate:</strong> {candidate.name}</span>
            <span><strong>Time Left:</strong> {formatTime(timeLeft)}</span>
            <span><strong>Q:</strong> {currentQ + 1}/25</span>
          </div>

          <h3>{QUESTIONS[currentQ].q}</h3>
          <div className="options">
            {QUESTIONS[currentQ].options.map((opt, idx) => (
              <button
                key={idx}
                className={`option ${answers[currentQ] === idx ? 'selected' : ''}`}
                onClick={() => selectOption(currentQ, idx)}
                disabled={answers[currentQ] !== null}
              >
                {String.fromCharCode(65 + idx)}. {opt}
              </button>
            ))}
          </div>
          {feedbacks[currentQ] && <div className="feedback">{feedbacks[currentQ]}</div>}

          <div className="controls">
            <button className="btn" onClick={prevQ} disabled={currentQ === 0}>Previous</button>
            <button className="btn primary" onClick={nextQ}>{currentQ === 24 ? 'Finish' : 'Next'}</button>
          </div>

          <div className="progress">
            {answers.map((a, i) => (
              <div key={i} className={`dot ${a !== null ? 'answered' : ''} ${i === currentQ ? 'active' : ''}`} onClick={() => setCurrentQ(i)}>{i + 1}</div>
            ))}
          </div>
        </div>
      )}

      {step === 'result' && (
        <div className="card">
          <h2>Exam Result</h2>
          <p><strong>Name:</strong> {candidate.name}</p>
          <p><strong>Email:</strong> {candidate.email}</p>
          <p><strong>Mobile:</strong> {candidate.mobile}</p>
          <p><strong>Total Marks:</strong> {QUESTIONS.length}</p>
          <p><strong>Obtained Marks:</strong> {score}</p>
          <p><strong>Result:</strong> {score >= 15 ? '🎉 Pass' : '❌ Fail'}</p>
          <p><strong>Date of Exam:</strong> {new Date().toLocaleString()}</p>

          <button className="btn primary" onClick={downloadPDF}>Download Marks Card (PDF)</button>
          <button className="btn" onClick={resetExam}>Restart</button>
        </div>
      )}

      <footer className="footer">© 2025 Nandi Softech Solutions. Built with ❤️ using React.</footer>
    </div>
  );
}
