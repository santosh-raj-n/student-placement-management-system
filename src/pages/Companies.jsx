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

    const deleteCompany=(idToDelete)=>{
        const remainingCompanies=companies.filter((company)=>{
            return company.id!==idToDelete
        })
        setCompanies(remainingCompanies);
    }
    const [editingCompany, setEditingCompany]=useState(null);
    const editCompany=(idToEdit)=>{
        const companyToEdit=companies.find((company)=>{
            return company.id===idToEdit
        })
        setEditingCompany(companyToEdit)
    }

    const updateCompany = () => {
    const updatedCompanies = companies.map((company) => {
        if (company.id === editingCompany.id) {
            return editingCompany
        }
            return company
        })
        setCompanies(updatedCompanies)
        setEditingCompany(null)
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
                <button onClick={()=>{deleteCompany(company.id)}}>Delete</button>
                <button onClick={()=>{editCompany(company.id)}}>Edit</button>
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

    {editingCompany &&(
        <div>
            <form onSubmit={updateCompany}>
                <label>Edit Company Name: </label>
                <input type="text"
                    placeholder='Edit the companies name'
                    value={editingCompany.name}
                    onChange={(e)=>{
                        setEditingCompany({
                            ...editingCompany,
                            name: e.target.value
                        })
                    }} 
                />
                <br />
                <label>Edit Opening location: </label>
                <input type="text"
                    placeholder='Edit Location'
                    value={editingCompany.location}
                    onChange={(e)=>{
                        setEditingCompany({
                            ...editingCompany,
                            location: e.target.value
                        })
                    }}
                />
                <br />
                <label>Edit package Details: </label>
                <input type="number" 
                    placeholder='Enter package details'
                    value={editingCompany.package}
                    onChange={(e)=>{
                        setEditingCompany({
                            ...editingCompany,
                            package: e.target.value
                        })
                    }}
                />
                <br />
                <label>Edit No.of Openings: </label>
                <input type='number'
                    placeholder='Edit the no. of openings'
                    value={editingCompany.openings}
                    onChange={(e)=>{
                        setEditingCompany({
                            ...editingCompany,
                            openings: e.target.value
                        })
                    }}
                />
                <br />
                <button type="submit"> Update </button>
            </form>
        </div>
    )}
    </>
  )
}

export default Companies