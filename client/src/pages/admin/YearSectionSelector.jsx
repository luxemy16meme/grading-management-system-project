export default function YearSectionSelector({
  selectedYear,
  sectionAssignments,
  sections,
  yearLevels,
  handleSectionClick,
}) {
  return (
    <>
      <h3>Select Section for {yearLevels.find(y => y.value === selectedYear)?.label}</h3>
      <div className="d-flex flex-wrap gap-3 mb-4 mt-2">
        {sections.map((sec) => {
          const assigned = sectionAssignments[sec] || [];
          return (
            <button
              key={sec}
              className="section-button"
              onClick={() => handleSectionClick(sec)}
            >
              <strong>Section {sec}</strong>
              <br />
              <small>
                {assigned.length > 0
                  ? assigned.map(t => t.fullname).join(", ")
                  : "No teacher assigned"}
              </small>
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .section-button {
          flex: 1 1 180px; /* slightly taller base width */
          max-width: 300px;
          min-width: 150px;
          min-height: 120px; /* taller to fill space better */
          text-align: left;
          border: 2px solid #40653fff;
          border-radius: 10px;
          padding: 15px;
          background: white;
          color: #40653fff;
          transition: 0.2s;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .section-button:hover {
          background: #40653fff;
          color: white;
          cursor: pointer;
        }
        .section-button small {
          font-size: 0.85rem;
          color: inherit;
        }
      `}</style>
    </>
  );
}
