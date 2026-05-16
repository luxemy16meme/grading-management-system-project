import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { db } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Grading Management System!");
});

// --------------------------- REGISTER TEACHER ---------------------------
app.post("/register-teacher", async (req, res) => {
  const { fullname, email, password, department } = req.body;

  if (!fullname || !email || !password || !department) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO teachers (fullname, email, password, department) 
                 VALUES (?,?,?,?)`;
    db.query(sql, [fullname, email, hashedPassword, department], (err) => {
      if (err) return res.status(500).json({ message: "Registration failed." });
      res.json({ message: "Registration submitted for approval." });
    });
  } catch (err) {
    res.status(500).json({ message: "Error hashing password." });
  }
});

// --------------------------- APPROVE TEACHER ---------------------------
app.put("/approve-teacher/:id", (req, res) => {
  const { id } = req.params;

  const sql = "UPDATE teachers SET status='approved' WHERE teachers_id=?";
  db.query(sql, [id], (err) => {
    if (err)
      return res.status(500).json({ message: "Failed to approve teacher" });
    res.json({ message: "Teacher approved" });
  });
});

// --------------------------- REJECT TEACHER ---------------------------
app.delete("/reject-teacher/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM teachers WHERE teachers_id=?";
  db.query(sql, [id], (err) => {
    if (err)
      return res.status(500).json({ message: "Failed to reject teacher" });
    res.json({ message: "Teacher rejected" });
  });
});

// --------------------------- ADMIN LOGIN ---------------------------
app.post("/login-admin", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM super_admins WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });

    if (results.length === 0)
      return res.json({ status: "fail", message: "Email not found" });

    const admin = results[0];

    if (password !== admin.password)
      return res.json({ status: "fail", message: "Incorrect password" });

    res.json({
      status: "success",
      message: "Admin login successful",
      admin: { id: admin.admin_id, fullName: admin.fullName },
    });
  });
});

// --------------------------- TEACHER LOGIN ---------------------------
app.post("/login-teacher", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM teachers WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });

    if (results.length === 0)
      return res.json({ status: "fail", message: "Email not found" });

    const teacher = results[0];

    const match = await bcrypt.compare(password, teacher.password);
    if (!match)
      return res.json({ status: "fail", message: "Incorrect password" });

    if (teacher.status === "pending")
      return res.json({
        status: "pending",
        message: "Your account is waiting for approval.",
      });

    if (teacher.status !== "approved")
      return res.json({
        status: "fail",
        message: "Your account is not approved to login.",
      });

    res.json({
      status: "success",
      message: "Teacher logged in successfully!",
      teacher: {
        id: teacher.teachers_id,
        fullName: teacher.fullName,
        email: teacher.email,
        department: teacher.department,
        status: teacher.status
      },
    });
  });
});

// --------------------------- FETCH PENDING TEACHERS ---------------------------
app.get("/pending-teachers", (req, res) => {
  const sql = `SELECT teachers_id, fullname, email, department, status 
               FROM teachers WHERE LOWER(status)='pending'`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch teachers." });
    res.json(results);
  });
});

// --------------------------- FETCH APPROVED TEACHERS ---------------------------
app.get("/approved-teachers", (req, res) => {
  const sql = `SELECT teachers_id, fullname, email, department, status 
               FROM teachers WHERE LOWER(status)='approved'`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch teachers." });
    res.json(results);
  });
});

/// ----------------------------ASSIGN TEACHERS----------------------------------
app.post("/assign-teacher", (req, res) => {
  const { teachers_id, year_level, section } = req.body;

  if (!teachers_id || !year_level || !section) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  const checkExclusiveSql = `
    SELECT * FROM teacher_assignments
    WHERE year_level = ? AND section = ?
  `;
  db.query(checkExclusiveSql, [year_level, section], (err, result) => {
    if (err) return res.status(500).send({ error: err.message });

    if (result.length > 0) {
      return res.status(400).send({
        error: "This Year & Section is already assigned to another teacher."
      });
    }

    const checkTeacherSql = `
      SELECT * FROM teacher_assignments
      WHERE teachers_id = ? AND year_level = ? AND section = ?
    `;
    db.query(checkTeacherSql, [teachers_id, year_level, section], (err, result2) => {
      if (err) return res.status(500).send({ error: err.message });

      if (result2.length > 0) {
        return res.status(400).send({
          error: "Teacher already assigned to this section."
        });
      }

      const insertSql = `
        INSERT INTO teacher_assignments (teachers_id, year_level, section)
        VALUES (?, ?, ?)
      `;
      db.query(insertSql, [teachers_id, year_level, section], (err) => {
        if (err) return res.status(500).send({ error: err.message });
        res.send({ message: "Assigned successfully" });
      });
    });
  });
});


// ------------------------FETCH TEACHER ASSIGNMENTS--------------------------------
app.get("/assigned-teachers/:year/:section", (req, res) => {
  const { year, section } = req.params;

  const sql = `
    SELECT ta.*, t.fullname, t.email, t.department
    FROM teacher_assignments ta
    JOIN teachers t ON ta.teachers_id = t.teachers_id
    WHERE ta.year_level = ? AND ta.section = ?
  `;

  db.query(sql, [year, section], (err, rows) => {
    if (err) {
      console.error("Fetch assigned teachers error:", err);
      return res.status(500).send({ error: err.message });
    }
    res.send(rows);
  });
});

// ------------------------ FETCH ALL TEACHER ASSIGNMENTS --------------------------------
app.get("/all-assignments", (req, res) => {
  const sql = `
    SELECT ta.*, t.fullname
    FROM teacher_assignments ta
    JOIN teachers t ON ta.teachers_id = t.teachers_id
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).send({ error: err.message });
    res.send(rows);
  });
});

// ------------------------ FETCH SPECIFIC TEACHER --------------------------------
app.get("/teacher-assignments/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT year_level, section
    FROM teacher_assignments
    WHERE teachers_id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ------------------------ FETCH STUDENTS FOR A SECTION ------------------------
app.get("/students/:year/:section", (req, res) => {
  const { year, section } = req.params;

  const sql = `
    SELECT 
      s.student_id,
      s.fullname,
      s.student_number,
      s.password,
      s.year_level,
      s.section,
      g.midterm,
      g.final,
      g.average,
      g.remarks
    FROM students s
    LEFT JOIN grades g 
      ON s.student_id = g.student_id
    WHERE s.year_level = ? AND s.section = ?
    ORDER BY s.fullname ASC
  `;

  db.query(sql, [year, section], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(results);
  });
});

// ------------------------------------------ADD A STUDENT-------------------------------------------------------------
app.post("/add-student", (req, res) => {
  const { fullname, student_number, year_level, section } = req.body;

  if (!fullname || !student_number || !year_level || !section) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const password = Math.random().toString(36).slice(-8);

  const checkSql = `
    SELECT * FROM students
    WHERE student_number = ? AND year_level = ? AND section = ?
  `;

  db.query(checkSql, [student_number, year_level, section], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      return res.status(400).json({ error: "Student already exists in this section." });
    }

    const insertSql = `
      INSERT INTO students (student_number, fullname, year_level, section, password)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [student_number, fullname, year_level, section, password],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const newStudentId = result.insertId;

        res.json({
          message: "Student added successfully!",
          student_id: newStudentId,
          assigned_password: password
        });
      }
    );
  });
});

//--------------------------------DELETE STUDENT--------------------------
app.delete("/delete-student/:id", (req, res) => {
  const student_id = req.params.id;

  const sql = "DELETE FROM students WHERE student_id = ?";

  db.query(sql, [student_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  });
});


//-------------------------------------GET GRADES------------------------
app.get("/grades/:student_id/:teacher_id/:semester", (req, res) => {
  const { student_id, teacher_id, semester } = req.params;

  const sql = `
    SELECT * FROM grades
    WHERE student_id = ? AND teachers_id = ? AND semester = ?
  `;

  db.query(sql, [student_id, teacher_id, semester], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0] || {});
  });
});


//-----------------------------------------SAVE A ROW OF GRADE-------------------
app.post("/save-grade-row", (req, res) => {
  const { student_id, teacher_id, semester, midterm, final, average, remarks } = req.body;

  const sql = `
    INSERT INTO grades (student_id, teachers_id, semester, midterm, final, average, remarks)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      midterm = VALUES(midterm),
      final = VALUES(final),
      average = VALUES(average),
      remarks = VALUES(remarks)
  `;

  db.query(sql, [student_id, teacher_id, semester, midterm, final, average, remarks], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Grade saved successfully!" });
  });
});

// --------------------------- STUDENT LOGIN ---------------------------
app.post("/student-login", (req, res) => {
  const { student_number, password } = req.body;

  const sql = "SELECT * FROM students WHERE student_number = ?";
  db.query(sql, [student_number], async (err, results) => {
    if (err) return res.status(500).json({ status: "fail", message: "Server error" });

    if (results.length === 0)
      return res.json({ status: "fail", message: "Student number not found" });

    const student = results[0];

    if (password !== student.password)
      return res.json({ status: "fail", message: "Incorrect password" });

    res.json({
      status: "success",
      message: "Student logged in successfully!",
      student: {
        id: student.student_id,
        fullname: student.fullname,
        student_number: student.student_number,
        year_level: student.year_level,
        section: student.section,
      },
    });
  });
});

// --------------------------- GET STUDENT GRADES ---------------------------
app.get("/student-grades/:student_id", (req, res) => {
  const { student_id } = req.params;

  const sql = `
    SELECT semester, midterm, final, average, remarks
    FROM grades
    WHERE student_id = ?
    ORDER BY FIELD(semester, '1st', '2nd')
  `;

  db.query(sql, [student_id], (err, results) => {
    if (err) return res.status(500).json({ status: "fail", message: err.message });

    res.json({ status: "success", grades: results });
  });
});



const PORT = 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
