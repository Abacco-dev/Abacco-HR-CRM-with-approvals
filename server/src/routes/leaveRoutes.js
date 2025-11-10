const express = require("express");
const router = express.Router();
const { authenticate } = require("../utils/auth");
const {
    getAllLeaves,
    createLeave,
    updateLeaveStatus,
    markLeaveSeen,
    getLeaveBalance,
    adminApproveLeave,
    getEmployeeLeaves,
    getAllLeavesForAdmin,
} = require("../controllers/leaveController");

router.use(authenticate);

// ✅ Employee-only: their own leaves
router.get("/employee", getEmployeeLeaves);

// ✅ Admin/Manager: all employees’ leaves
router.get("/admin", getAllLeavesForAdmin);

router.get("/view", getAllLeaves);

// ✅ Default: keeps backward compatibility
router.get("/", getAllLeaves);

// ✅ Leave balance
router.get("/balance", getLeaveBalance);

// ✅ Create leave request
router.post("/", createLeave);

// ✅ Manager/Admin status updates
router.patch("/:id/status", updateLeaveStatus);

// ✅ Mark leave as seen
router.patch("/:id/seen", markLeaveSeen);

// ✅ Admin-only final approval
router.patch("/:id/approval", adminApproveLeave);

module.exports = router;
