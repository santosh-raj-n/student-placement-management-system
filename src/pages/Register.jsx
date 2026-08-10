import React, {useState} from 'react'

const Register = () => {
    const [name, setName]=useState("");
    const [email, setEmail]=useState("");
    const [dept, setDept]=useState("");
    const [phone, setPhone]=useState("");

    const handleSubmit=(event)=>{
        event.preventDefault();
        console.log("Student Details");
        console.log("Name:", name);
        console.log("Email:", email);
        console.log("Department", dept);
    }

  return (
    <div>
        <h1>Student Registration</h1>
        <form onSubmit={handleSubmit}>
        <div>
        <label>Name:</label>
        <input
            type="text"
            value={name}
            placeholder='Enter Your Name:'
            onChange={(e)=>{
                setName(e.target.value)
            }}
        />
        </div>
        <br />
        <div>
        <label>Email:</label>
        <input type="text" 
            placeholder='Enter your email:'
            value={email}
            onChange={(e)=>{
                setEmail(e.target.value)
            }}
        />
        </div>
        <br />
        <div>
        <label>Department:</label>
        <input type="text" 
            placeholder='Enter Your Department'
            value={dept}
            onChange={(e)=>{
                setDept(e.target.value)
            }}
        />
        </div>
        <br />
        <div>
        <label>Phone Number:</label>
        <input
            type='tel'
            value={phone}
            placeholder='Enter Your PhoneNo:'
            onChange={(e)=>{
                setPhone(e.target.value)
            }}
        />
        </div>
        <br />
        <button type='submit'>Register</button>
        </form>

        <h2>Student Details</h2>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Department:</strong> {dept}</p>
            <p><strong>Phone Number:</strong> {phone}</p>

    </div>
  )
}

export default Register