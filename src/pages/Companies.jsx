import React from 'react'
import { useState } from 'react'

const Companies = () => {
    const [companies, setCompanies] = useState([
        {
            id: 1,
            name: "TCS",
            location: "Chennai",
            package: 6,
            openings: 20
        },
        {
            id: 2,
            name: "Infosys",
            location: "Bangalore",
            package: 7,
            openings: 15
        }
    ])
    const [newCompany, setNewCompany]=useState({
        name:"",
        location:"",
        package: "",
        openings: ""
    })
    const registerComp=(e)=>{
        e.preventDefault();
        const company={
            ...newCompany,
            id: companies.length+1
        }
        setCompanies([
            ...companies,
            company
        ])
        setNewCompany({
            name: "",
            location: "",
            package: "",
            openings: ""
        })
    }

  return (
    <>
        <h1>Companies That Are Hiring</h1>
        {companies.map((company)=>(
            <div key={company.id}>
                <h2>{company.name}</h2>
                <p>{company.location}</p>
                <p>Package: {company.package}</p>
                <p>No. of openings: {company.openings}</p>
            </div>
        ))}
    <form onSubmit={registerComp}>
        <div>
            <label>Company Name: </label>
            <input type="text"
                placeholder='Enter the Company Name'
                value={newCompany.name}
                onChange={(e)=>{
                    setNewCompany({
                        ...newCompany,
                        name: e.target.value
                    })
                }}
            />
        </div>
        <br />
        <div>
            <label>Openings Location: </label>
            <input type="text"
                placeholder='Enter the location for openings'
                value={newCompany.location}
                onChange={(e)=>{
                    setNewCompany({
                        ...newCompany,
                        location: e.target.value
                    })
                }}
            />
        </div>
        <br />
        <div>
            <label>Package per annum: </label>
            <input type="number"
                placeholder='Enter the package amount'
                value={newCompany.package}
                onChange={(e)=>{
                    setNewCompany({
                        ...newCompany,
                        package: e.target.value
                    })
                }}
            />
        </div>
        <br />
        <div>
            <label>No. of Openings: </label>
            <input type="number" 
                placeholder='Enter no. of openings'
                value={newCompany.openings}
                onChange={(e)=>{
                    setNewCompany({
                        ...newCompany,
                        openings: e.target.value
                    })
                }}
            />
        </div>
        <br />
        <button type='submit'>Register</button>
    </form>
    </>
  )
}

export default Companies