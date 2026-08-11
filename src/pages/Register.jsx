import React, {useState} from 'react'

const Register = () => {
    const [formData, setFormData]=useState({
        name:"",
        email:"",
        dept:"",
        phone:""
    })
    const [errors, setErrors]=useState({

    })

    const handleSubmit=(event)=>{
        event.preventDefault();
        const newErrors={};
        if(formData.name.trim()===""){
            newErrors.name="Name is required";
        }
        if(formData.email.trim()===""){
            newErrors.email= "Email should not be empty";
        }else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())){
            newErrors.email="Enter a valid Email"
        }
        if(formData.dept.trim()===""){
            newErrors.dept="Department cannot be empty"
        }
        if(!/^\d{10}$/.test(formData.phone.trim())){
            newErrors.phone="Enter a valid phone no."
        }
        setErrors(newErrors);
        if(Object.values(newErrors).length>0){
            return
        }
        console.log("Student Details");
        console.log("Name:", formData.name);
        console.log("Email:", formData.email);
        console.log("Department", formData.dept);
        console.log("Phone", formData.phone);
    }

    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }

  return (
    <div>
        <h1>Student Registration</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        placeholder='Enter Your Name:'
                        onChange={handleChange}
                    />
            </div>
            {errors.name && <p>{errors.name}</p>}
            <br />
            <div>
                <label>Email:</label>
                <input type="text"
                    name="email"
                    placeholder='Enter your email:'
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>
            {errors.email && <p>{errors.email}</p>}
            <br />
            <div>
                <label>Department:</label>
                <input type="text" 
                    name="dept"
                    placeholder='Enter Your Department'
                    value={formData.dept}
                    onChange={handleChange}
                />
            </div>
            {errors.dept && <p>{errors.dept}</p>}
            <br />
            <div>
                <label>Phone Number:</label>
                <input
                    type='tel'
                    name="phone"
                    value={formData.phone}
                    placeholder='Enter Your PhoneNo:'
                    onChange={handleChange}
                />
            </div>
            {errors.phone && <p>{errors.phone}</p>}
            <br />
            <button type='submit'>Register</button>
        </form>

        <h2>Student Details</h2>
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Department:</strong> {formData.dept}</p>
            <p><strong>Phone Number:</strong> {formData.phone}</p>

    </div>
  )
}

export default Register