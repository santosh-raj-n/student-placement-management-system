import { DEGREE_OPTIONS } from "../data/degreeOptions";

const AcademicProgramFields = ({ degree, department, onChange, errors = {} }) => (
  <>
    <div className="form-group">
      <label htmlFor="degree">Degree *</label>
      <select
        id="degree"
        name="degree"
        value={degree}
        onChange={(event) =>
          onChange({ degree: event.target.value, department: "" })
        }
        required
      >
        <option value="">Select your degree</option>
        {Object.keys(DEGREE_OPTIONS).map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {errors.degree && <p className="error-message">{errors.degree}</p>}
    </div>

    <div className="form-group">
      <label htmlFor="department">Department / Stream *</label>
      <select
        id="department"
        name="department"
        value={department}
        onChange={(event) => onChange({ department: event.target.value })}
        disabled={!degree}
        required
      >
        <option value="">Select your department</option>
        {(DEGREE_OPTIONS[degree] || []).map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {errors.department && <p className="error-message">{errors.department}</p>}
    </div>
  </>
);

export default AcademicProgramFields;
