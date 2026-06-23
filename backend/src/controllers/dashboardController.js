const pool = require('../config/db');

exports.getStats = async (req, res, next) => {
  try {
    const [totals, byDept, todayAtt] = await Promise.all([
      pool.query(`
        SELECT
          (SELECT COUNT(*) FROM interns)                           AS total_interns,
          (SELECT COUNT(*) FROM tasks)                             AS total_tasks,
          (SELECT COUNT(*) FROM tasks WHERE status = 'completed')  AS completed_tasks,
          (SELECT COUNT(*) FROM tasks WHERE status = 'pending')    AS pending_tasks
      `),
      pool.query(
        'SELECT department, COUNT(*) AS count FROM interns GROUP BY department ORDER BY count DESC'
      ),
      pool.query(
        `SELECT status, COUNT(*) AS count
         FROM attendance
         WHERE date = CURRENT_DATE
         GROUP BY status`
      ),
    ]);

    const { total_interns, total_tasks, completed_tasks, pending_tasks } = totals.rows[0];
    res.json({
      totalInterns:    parseInt(total_interns),
      totalTasks:      parseInt(total_tasks),
      completedTasks:  parseInt(completed_tasks),
      pendingTasks:    parseInt(pending_tasks),
      internsByDepartment: byDept.rows,
      todayAttendance:     todayAtt.rows,
    });
  } catch (err) {
    next(err);
  }
};
