export default function YearSectionSelector({ assignedYears, sectionsForSelectedYear, selectedYear, selectedSection, setSelectedYear, setSelectedSection }) {
  return (
    <>
      <h3 style={{color:"#40653fff"}}>Assigned Years</h3>
      <div className="d-flex gap-3 mb-4 mt-2 flex-wrap">
        {assignedYears.map(year => (
          <button key={year} className="btn" style={{
            background: selectedYear===year?"#40653fff":"white",
            color: selectedYear===year?"white":"#40653fff",
            border:"2px solid #40653fff", borderRadius:"10px", padding:"10px 18px", fontWeight:600
          }}
          onClick={()=>{ setSelectedYear(year); setSelectedSection(null); }}
          >Year {year}</button>
        ))}
      </div>

      {selectedYear && <>
        <h4 style={{color:"#40653fff"}}>Sections for {selectedYear}</h4>
        <div className="d-flex gap-3 mb-4 mt-2 flex-wrap">
          {sectionsForSelectedYear.map(sec => (
            <button key={sec} className="btn" style={{
              background: selectedSection===sec?"#40653fff":"white",
              color: selectedSection===sec?"white":"#40653fff",
              border:"2px solid #40653fff", borderRadius:"10px", padding:"10px 18px", fontWeight:600
            }}
            onClick={()=>{ setSelectedSection(sec); }}
            >Section {sec}</button>
          ))}
        </div>
      </>}
    </>
  );
}
