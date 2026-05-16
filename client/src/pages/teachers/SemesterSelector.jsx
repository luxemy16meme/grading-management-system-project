export default function SemesterSelector({ semester, setSemester }) {
  return (
    <div className="mb-3">
      <label>Semester:</label>
      <select className="form-control" value={semester} onChange={e=>setSemester(e.target.value)}>
        <option value="">Select Semester</option>
        <option value="1st">1st Semester</option>
        <option value="2nd">2nd Semester</option>
      </select>
    </div>
  );
}
