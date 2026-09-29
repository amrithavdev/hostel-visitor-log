const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


// Test route
app.get('/ping', (req, res) => {
  res.send('Backend is running');
});


// =========================
// RESIDENTS
// =========================

// Get all residents
app.get('/api/residents', (req, res) => {
  const sql = `
    SELECT resident_id, name, room_no
    FROM residents
    ORDER BY resident_id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch residents' });
    }

    res.json(results);
  });
});


// Add a resident
app.post('/api/residents', (req, res) => {
  const { name, room_no } = req.body;

  if (!name || !room_no) {
    return res.status(400).json({
      error: 'Name and room number are required'
    });
  }

  const sql = `
    INSERT INTO residents (name, room_no)
    VALUES (?, ?)
  `;

  db.query(sql, [name, room_no], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: 'Failed to add resident'
      });
    }

    res.status(201).json({
      message: 'Resident added successfully',
      resident_id: result.insertId
    });
  });
});


// Delete a resident
app.delete('/api/residents/:id', (req, res) => {
  const residentId = req.params.id;

  const sql = `
    DELETE FROM residents
    WHERE resident_id = ?
  `;

  db.query(sql, [residentId], (err, result) => {
    if (err) {
      console.error(err);

      if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({
          error: 'Cannot delete resident because visitor records exist for this resident'
        });
      }

      return res.status(500).json({
        error: 'Failed to delete resident'
      });
    }

    res.json({
      message: 'Resident deleted successfully'
    });
  });
});


// =========================
// VISITORS
// =========================

// Get all visitors with resident name and room number
app.get('/api/visitors', (req, res) => {
  const sql = `
    SELECT
      v.visitor_id,
      v.visitor_name,
      v.purpose,
      v.check_in,
      v.check_out,
      r.name AS resident_name,
      r.room_no
    FROM visitors v
    JOIN residents r
      ON v.resident_id = r.resident_id
    ORDER BY v.visitor_id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: 'Failed to fetch visitors'
      });
    }

    res.json(results);
  });
});


// Get current visitors
app.get('/api/visitors/current', (req, res) => {
  const sql = `
    SELECT
      v.visitor_id,
      v.visitor_name,
      v.purpose,
      v.check_in,
      r.name AS resident_name,
      r.room_no
    FROM visitors v
    JOIN residents r
      ON v.resident_id = r.resident_id
    WHERE v.check_out IS NULL
    ORDER BY v.check_in DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: 'Failed to fetch current visitors'
      });
    }

    res.json(results);
  });
});


// Search visitors
app.get('/api/visitors/search', (req, res) => {
  const query = req.query.query || '';

  const searchValue = `%${query}%`;

  const sql = `
    SELECT
      v.visitor_id,
      v.visitor_name,
      v.purpose,
      v.check_in,
      v.check_out,
      r.name AS resident_name,
      r.room_no
    FROM visitors v
    JOIN residents r
      ON v.resident_id = r.resident_id
    WHERE
      v.visitor_name LIKE ?
      OR r.name LIKE ?
      OR r.room_no LIKE ?
      OR v.purpose LIKE ?
    ORDER BY v.visitor_id DESC
  `;

  db.query(
    sql,
    [searchValue, searchValue, searchValue, searchValue],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: 'Failed to search visitors'
        });
      }

      res.json(results);
    }
  );
});


// Add a visitor / check-in
app.post('/api/visitors', (req, res) => {
  const {
    visitor_name,
    purpose,
    resident_id
  } = req.body;

  if (!visitor_name || !purpose || !resident_id) {
    return res.status(400).json({
      error: 'Visitor name, purpose and resident are required'
    });
  }

  const sql = `
    INSERT INTO visitors
      (visitor_name, purpose, resident_id)
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [visitor_name, purpose, resident_id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: 'Failed to check in visitor'
        });
      }

      res.status(201).json({
        message: 'Visitor checked in successfully',
        visitor_id: result.insertId
      });
    }
  );
});


// Checkout visitor
app.put('/api/visitors/:id/checkout', (req, res) => {
  const visitorId = req.params.id;

  const sql = `
    UPDATE visitors
    SET check_out = NOW()
    WHERE visitor_id = ?
  `;

  db.query(sql, [visitorId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: 'Failed to checkout visitor'
      });
    }

    res.json({
      message: 'Visitor checked out successfully'
    });
  });
});


// Delete visitor
app.delete('/api/visitors/:id', (req, res) => {
  const visitorId = req.params.id;

  const sql = `
    DELETE FROM visitors
    WHERE visitor_id = ?
  `;

  db.query(sql, [visitorId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: 'Failed to delete visitor'
      });
    }

    res.json({
      message: 'Visitor deleted successfully'
    });
  });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});