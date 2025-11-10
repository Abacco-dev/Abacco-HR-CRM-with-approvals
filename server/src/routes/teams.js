const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../utils/auth");
const {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  addMember,
  removeMember,
  deleteTeam,
} = require("../controllers/teamController");

router.use(authenticate);

router.post("/", authorize("ADMIN", "MANAGER"), createTeam);
router.get("/", getAllTeams);
router.get("/:id", getTeamById);
router.put("/:id", authorize("ADMIN", "MANAGER"), updateTeam);
router.post("/:id/members", authorize("ADMIN", "MANAGER"), addMember);
router.delete("/:id/members/:memberId", authorize("ADMIN", "MANAGER"), removeMember);
router.delete("/:id", authorize("ADMIN"), deleteTeam);

module.exports = router;
