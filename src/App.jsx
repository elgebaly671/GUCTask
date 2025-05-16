import { useEffect, useState } from 'react';
//import  main from './api/Groq'
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
//import 'dotenv/config.js'
import './App.css';


function App() {
  
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Handle login submission
  const submitted = () => {
    localStorage.setItem('username', document.getElementById('usern').value);
    localStorage.setItem('password', document.getElementById('pass').value);
    window.location.reload();
  };

  // If not logged in, show login form
  if (!localStorage.getItem('username') || !localStorage.getItem('password')) {
    return (
      <div id='login-cont'>
        <h2>Username: </h2>
        <input type='text' id='usern'/>
        <h2>Password:</h2>
        <input type='password' id='pass'/>
        <button id='Sub' onClick={submitted} className='rounded-full'>Login</button>
      </div>
    );
  }

  // Button click handler
  const onCLCK = async () => {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    const res = await fetch('http://localhost:5000/run-pupp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    localStorage.setItem('courses', JSON.stringify(data[0]));
    setAnnouncements(data[1])
    setCourses(data[0]);
  };
console.log(announcements)
  // Load saved courses on component mount
  useEffect(() => {
    const savedCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    setCourses(savedCourses);
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Here are your courses:</h1>
      <ul className='courses'>
        {courses.length === 0 ? (
          <li>No courses found.</li>
        ) : (
          courses.map((course, index) => <li key={index}>{course}</li>)
        )}
      </ul>

      <div className="card">
        <button onClick={onCLCK}>
          Fetch Courses
        </button>
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
