// controllers/leaveController.js
const { prisma } = require("../utils/auth");

/**
 * ✅ Get all leave requests (generic)
 */
exports.getAllLeaves = async (req, res, next) => {
    try {
        let leaves;
        if (req.user.role === "ADMIN" || req.user.role === "MANAGER") {
            leaves = await prisma.leaveRequest.findMany({
                include: { user: { select: { id: true, name: true, email: true, role: true } } },
                orderBy: { createdAt: "desc" },
            });
        } else {
            leaves = await prisma.leaveRequest.findMany({
                where: { userId: req.user.id },
                include: { user: { select: { id: true, name: true } } },
                orderBy: { createdAt: "desc" },
            });
        }
        return res.status(200).json({ success: true, leaves });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Error fetching leaves" });
    }
};


/**
 * ✅ Get leave balance (per user)
 */
exports.getLeaveBalance = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const leaves = await prisma.leaveRequest.groupBy({
            by: ["type"],
            where: { userId, status: "APPROVED" },
            _count: { _all: true },
        });

        const totalAllowed = { Sick: 12, Casual: 10, Annual: 20 };

        const getUsedCount = (keyword) => {
            const record = leaves.find((l) =>
                l.type.toLowerCase().includes(keyword.toLowerCase())
            );
            return record ? record._count._all : 0;
        };

        const balances = {
            sick: {
                used: getUsedCount("sick"),
                total: totalAllowed.Sick,
                remaining: totalAllowed.Sick - getUsedCount("sick"),
            },
            casual: {
                used: getUsedCount("casual"),
                total: totalAllowed.Casual,
                remaining: totalAllowed.Casual - getUsedCount("casual"),
            },
            annual: {
                used: getUsedCount("annual"),
                total: totalAllowed.Annual,
                remaining: totalAllowed.Annual - getUsedCount("annual"),
            },
        };

        res.status(200).json(balances);
    } catch (err) {
        console.error("❌ Error fetching leave balance:", err);
        next(err);
    }
};

/**
 * ✅ Create new leave request
 */
exports.createLeave = async (req, res, next) => {
    try {
        const { type, startDate, endDate, reason } = req.body;

        if (!type || !startDate || !endDate) {
            return res.status(400).json({ message: "Leave type, start date, and end date are required." });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
            return res.status(400).json({ message: "End date cannot be earlier than start date." });
        }

        const diffTime = end.getTime() - start.getTime();
        const noOfDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

        const overlap = await prisma.leaveRequest.findFirst({
            where: {
                userId: req.user.id,
                OR: [
                    { startDate: { lte: end }, endDate: { gte: start } },
                ],
            },
        });

        if (overlap) {
            return res.status(409).json({ message: "You already have a leave during this period." });
        }

        const leave = await prisma.leaveRequest.create({
            data: {
                userId: req.user.id,
                type,
                startDate: start,
                endDate: end,
                reason: reason || "",
                status: "PENDING",
                noOfDays,
            },
        });

        res.status(201).json({
            message: `Leave request submitted for ${noOfDays} day${noOfDays > 1 ? "s" : ""}.`,
            leave,
        });
    } catch (err) {
        console.error("❌ Error creating leave:", err);
        next(err);
    }
};

/**
 * ✅ Update leave status (manager/admin)
 */
exports.updateLeaveStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["PENDING", "APPROVED", "REJECTED"];
        if (!validStatuses.includes(status.toUpperCase())) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const existing = await prisma.leaveRequest.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ message: "Leave not found" });

        const updatedLeave = await prisma.leaveRequest.update({
            where: { id },
            data: {
                status: status.toUpperCase(),
                isUpdated: true,
            },
            include: { user: { select: { id: true, name: true, email: true, role: true } } },
        });

        await prisma.notification.create({
            data: {
                userId: updatedLeave.userId,
                ntype: "LEAVE_UPDATE",
                content: `Your ${updatedLeave.type} leave was ${updatedLeave.status.toLowerCase()}.`,
            },
        });

        res.status(200).json({ message: "Leave status updated", updatedLeave });
    } catch (err) {
        console.error("❌ Error updating leave status:", err);
        next(err);
    }
};

/**
 * ✅ Mark leave as seen (resets notification flag)
 */
exports.markLeaveSeen = async (req, res, next) => {
    try {
        const { id } = req.params;

        const leave = await prisma.leaveRequest.findUnique({ where: { id } });
        if (!leave) return res.status(404).json({ message: "Leave not found" });

        const updated = await prisma.leaveRequest.update({
            where: { id },
            data: { isUpdated: false },
        });

        res.status(200).json({ message: "Leave marked as seen", updated });
    } catch (err) {
        console.error("❌ Error marking leave as seen:", err);
        next(err);
    }
};

/**
 * ✅ Admin approval (final)
 */
exports.adminApproveLeave = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { decision } = req.body;

        if (!["APPROVED", "REJECTED"].includes(decision.toUpperCase())) {
            return res.status(400).json({ message: "Invalid decision value" });
        }

        const updatedLeave = await prisma.leaveRequest.update({
            where: { id },
            data: {
                status: decision.toUpperCase(),
                isUpdated: decision.toUpperCase() === "APPROVED",
            },
            include: { user: true },
        });

        await prisma.notification.create({
            data: {
                userId: updatedLeave.userId,
                ntype: "LEAVE_APPROVAL",
                content: `Your leave request was ${updatedLeave.status.toLowerCase()}.`,
            },
        });

        res.json({
            success: true,
            message: `Leave ${decision.toLowerCase()} successfully.`,
            leave: updatedLeave,
        });
    } catch (err) {
        console.error("❌ Error approving/rejecting leave:", err);
        next(err);
    }
};

/**
 * ✅ Employee: get only their own leaves
 */
exports.getEmployeeLeaves = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const leaves = await prisma.leaveRequest.findMany({
            where: { userId },
            include: {
                user: { select: { id: true, name: true, email: true, role: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        res.status(200).json({ success: true, leaves });
    } catch (err) {
        console.error("❌ Error fetching employee leaves:", err);
        next(err);
    }
};

/**
 * ✅ Admin/Manager: get all employees’ leaves
 */
exports.getAllLeavesForAdmin = async (req, res, next) => {
    try {
        if (!["ADMIN", "MANAGER"].includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        const leaves = await prisma.leaveRequest.findMany({
            include: {
                user: { select: { id: true, name: true, email: true, role: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        res.status(200).json({ success: true, leaves });
    } catch (err) {
        console.error("❌ Error fetching admin/manager leaves:", err);
        next(err);
    }
};
