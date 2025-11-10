// server/src/controllers/teamController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * @desc Create a new team
 * @route POST /api/teams
 * @access ADMIN, MANAGER
 */
exports.createTeam = async (req, res, next) => {
    try {
        const { name, leaderId } = req.body;

        if (!name || !leaderId) {
            return res.status(400).json({ error: "Team name and leaderId are required" });
        }

        // Ensure leader exists in User table
        const leader = await prisma.user.findUnique({ where: { id: leaderId } });
        if (!leader) {
            return res.status(400).json({ error: "Leader not found in User table" });
        }

        const team = await prisma.team.create({
            data: {
                name,
                leader: { connect: { id: leaderId } },
            },
            include: { leader: true },
        });

        res.json(team);
    } catch (err) {
        console.error("Error creating team:", err);
        if (err.code === "P2002") {
            return res.status(400).json({ error: "Team name already exists" });
        }
        next(err);
    }
};


/**
 * @desc Get all teams with leader and members
 * @route GET /api/teams
 * @access Authenticated
 */
exports.getAllTeams = async (req, res, next) => {
    try {
        const teams = await prisma.team.findMany({
            include: {
                leader: {
                    select: { id: true, name: true, email: true, role: true },
                },
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true, role: true },
                        },
                    },
                },
                teamTargets: true,
            },
            orderBy: { name: "asc" }, // ✅ FIXED: Team doesn’t have createdAt, so order by name
        });

        res.json(teams);
    } catch (err) {
        console.error("❌ Error fetching teams:", err);
        next(err);
    }
};

/**
 * @desc Get team by ID
 * @route GET /api/teams/:id
 * @access Authenticated
 */
exports.getTeamById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const team = await prisma.team.findUnique({
            where: { id },
            include: {
                leader: { select: { id: true, name: true, email: true, role: true } },
                members: {
                    include: {
                        user: { select: { id: true, name: true, email: true, role: true } },
                    },
                },
                teamTargets: true,
            },
        });

        if (!team) return res.status(404).json({ error: "Team not found" });

        res.json(team);
    } catch (err) {
        console.error("Error fetching team by ID:", err);
        next(err);
    }
};

/**
 * @desc Update team
 * @route PUT /api/teams/:id
 * @access ADMIN, MANAGER
 */
exports.updateTeam = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, leaderId } = req.body;

        const team = await prisma.team.update({
            where: { id },
            data: {
                name,
                leaderId: leaderId || null,
            },
            include: {
                leader: { select: { id: true, name: true, email: true } },
            },
        });

        res.json(team);
    } catch (err) {
        console.error("Error updating team:", err);
        next(err);
    }
};

/**
 * @desc Add member to team
 * @route POST /api/teams/:id/members
 * @access ADMIN, MANAGER
 */
exports.addMember = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { userId, role } = req.body;

        if (!userId) return res.status(400).json({ error: "User ID required" });

        const team = await prisma.team.findUnique({ where: { id } });
        if (!team) return res.status(404).json({ error: "Team not found" });

        const existing = await prisma.teamMember.findFirst({
            where: { teamId: id, userId },
        });
        if (existing) return res.status(400).json({ error: "User already in team" });

        const member = await prisma.teamMember.create({
            data: {
                teamId: id,
                userId,
                role: role || "MEMBER",
            },
            include: {
                user: { select: { id: true, name: true, email: true, role: true } },
            },
        });

        res.status(201).json(member);
    } catch (err) {
        console.error("Error adding member:", err);
        next(err);
    }
};

/**
 * @desc Remove member from team
 * @route DELETE /api/teams/:id/members/:memberId
 * @access ADMIN, MANAGER
 */
exports.removeMember = async (req, res, next) => {
    try {
        const { memberId } = req.params;

        const member = await prisma.teamMember.findUnique({ where: { id: memberId } });
        if (!member) return res.status(404).json({ error: "Member not found" });

        await prisma.teamMember.delete({ where: { id: memberId } });

        res.json({ success: true, message: "Member removed successfully" });
    } catch (err) {
        console.error("Error removing team member:", err);
        next(err);
    }
};

/**
 * @desc Delete team
 * @route DELETE /api/teams/:id
 * @access ADMIN
 */
exports.deleteTeam = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Delete members first
        await prisma.teamMember.deleteMany({ where: { teamId: id } });

        // Delete team itself
        await prisma.team.delete({ where: { id } });

        res.json({ success: true, message: "Team deleted successfully" });
    } catch (err) {
        console.error("Error deleting team:", err);
        next(err);
    }
};
