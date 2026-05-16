import mysql from "mysql";

export const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "grading_management"
});

db.connect(err => {
  if (err){
    console.log("Database connection failed: ", err);
  }
  else{
    console.log("Connected to MySQL database.")
  }
});