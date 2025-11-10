// server/src/controllers/attendanceController.js
const { prisma } = require("../utils/auth");

/**
 * Clock In — create attendance record for the user for today.
 */
exports.clockIn = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        const dateOnly = new Date(today.toISOString().split("T")[0]);

        // Prevent duplicate clock-in
        const existing = await prisma.attendanceRecord.findUnique({
            where: {
                userId_date: { userId, date: dateOnly },
            },
        });

        if (existing) {
            return res.status(400).json({ message: "Already clocked in today" });
        }

        const record = await prisma.attendanceRecord.create({
            data: {
                userId,
                date: dateOnly,
                clockIn: today,
                status: "PRESENT",
            },
        });

        res.json({ success: true, record });
    } catch (error) {
        console.error("Clock-in error:", error);
        next(error);
    }
};

/**
 * Clock Out — update today's record with clock-out time.
 */
exports.clockOut = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        const dateOnly = new Date(today.toISOString().split("T")[0]);

        const record = await prisma.attendanceRecord.findUnique({
            where: {
                userId_date: { userId, date: dateOnly },
            },
        });

        if (!record) {
            return res
                .status(404)
                .json({ message: "No clock-in record found for today" });
        }

        if (record.clockOut) {
            return res.status(400).json({ message: "Already clocked out today" });
        }

        const updated = await prisma.attendanceRecord.update({
            where: {
                userId_date: { userId, date: dateOnly },
            },
            data: {
                clockOut: today,
            },
        });

        res.json({ success: true, updated });
    } catch (error) {
        console.error("Clock-out error:", error);
        next(error);
    }
};


/**
 * Get all attendance records for logged-in user.
 */
exports.getAllRecords = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const records = await prisma.attendanceRecord.findMany({
            where: { userId },
            orderBy: { date: "desc" },
        });

        res.json({ success: true, records });
    } catch (error) {
        console.error("Error fetching all records:", error);
        next(error);
    }
};



/**
 * Get today's attendance record.
 */
exports.getTodayRecord = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        const dateOnly = new Date(today.toISOString().split("T")[0]);

        const record = await prisma.attendanceRecord.findUnique({
            where: {
                userId_date: { userId, date: dateOnly },
            },
        });

        res.json({ success: true, record });
    } catch (error) {
        next(error);
    }
};
