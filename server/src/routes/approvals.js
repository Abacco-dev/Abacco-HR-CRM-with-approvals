// src/routes/approvals.js
const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');
console.log("Approvals router loaded");

// In-memory storage (replace with database in production)
let approvals = [];
let employees = [];

// Email configuration (replace with your actual email service)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-password'
    }
});

// Function to send email
const sendEmail = async (to, subject, body) => {
    try {
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: Array.isArray(to) ? to.join(',') : to,
            subject: subject,
            text: body,
            html: `<p>${body}</p>`
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}: ${subject}`);
        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
};

// GET all approvals
router.get("/", (req, res) => {
    res.json(approvals);
});

// Create approval request
router.post("/", (req, res) => {
    const { actionType, entity, requestedBy, data } = req.body;
    const approval = {
        id: Date.now().toString(),
        createdAt: new Date(),
        requestedBy: { id: requestedBy, name: "Employee" },
        actionType,
        entity,
        data,
        status: "PENDING",
    };
    approvals.push(approval);
    res.json(approval);
});

// Approve
router.post("/:id/approve", async (req, res) => {
    const approval = approvals.find((a) => a.id === req.params.id);
    if (!approval) return res.status(404).json({ error: "Not found" });

    approval.status = "APPROVED";
    
    // Handle employee creation
    if (approval.entity === 'Employee') {
        const employee = { 
            id: Date.now().toString(), 
            ...approval.data,
            createdAt: new Date()
        };
        employees.push(employee);

        // Send email notification for each lead
        const totalLeads = employee.totalLeads || 0;
        const emailList = employee.leadEmails ? 
            employee.leadEmails.split(',').map(email => email.trim()) : 
            ["admin@company.com"];
        
        if (totalLeads > 0) {
            for (let i = 0; i < totalLeads; i++) {
                const subject = `New Lead Notification - ${employee.name}`;
                const body = `
                    <h3>New Lead Achieved</h3>
                    <p><strong>Employee:</strong> ${employee.name}</p>
                    <p><strong>Lead Number:</strong> ${i + 1} of ${totalLeads}</p>
                    <p><strong>Total Leads:</strong> ${totalLeads}</p>
                    <p><strong>Target:</strong> ${employee.target}</p>
                    <p><strong>Today Achieved:</strong> ${employee.todayAchieved || 0}</p>
                    <p><strong>Weekly Achieved:</strong> ${employee.weeklyAchieved || 0}</p>
                    <p>This is an automated notification for a new lead achieved by the employee.</p>
                `;
                
                await sendEmail(emailList, subject, body);
            }
        }
    }
    
    approvals = approvals.filter((a) => a.id !== req.params.id);

    res.json({ message: "Approved", employees });
});

// Reject
router.post("/:id/reject", (req, res) => {
    const approval = approvals.find((a) => a.id === req.params.id);
    if (!approval) return res.status(404).json({ error: "Not found" });

    approval.status = "REJECTED";
    approval.reason = req.body.reason || "No reason provided";
    approvals = approvals.filter((a) => a.id !== req.params.id);

    res.json({ message: "Rejected", approval });
});

// Send email endpoint (for testing)
router.post("/send-email", async (req, res) => {
    const { to, subject, body } = req.body;
    
    try {
        const result = await sendEmail(to, subject, body);
        if (result) {
            res.json({ message: "Email sent successfully" });
        } else {
            res.status(500).json({ error: "Failed to send email" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to send email", details: error.message });
    }
});


// GET all employees
router.get("/employees", (req, res) => {
    res.json(employees);
});

module.exports = router;