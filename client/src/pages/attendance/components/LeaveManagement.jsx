// import { useState, useEffect } from "react";
// import LeaveModal from "./LeaveModal";

// export default function LeaveManagement() {
//   console.log("LeaveManagement component has mounted.");

//   const [showLeaveModal, setShowLeaveModal] = useState(false);

//   // This will log every time the state changes
//   useEffect(() => {
//     console.log("showLeaveModal state is now:", showLeaveModal);
//   }, [showLeaveModal]);

//   const handleButtonClick = () => {
//     console.log("Button was clicked! ✅");
//     alert("Button was clicked! Check the console.");
//     setShowLeaveModal(true);
//   };

//   return (
//     <div style={{ padding: "20px", border: "2px solid red" }}>
//       <h3>Minimalist Leave Management for Debugging</h3>
//       <p>Current state of showLeaveModal: {showLeaveModal.toString()}</p>

//       <button
//         onClick={handleButtonClick}
//         style={{
//           padding: "10px 20px",
//           fontSize: "16px",
//           backgroundColor: "#007bff",
//           color: "white",
//           border: "none",
//           cursor: "pointer",
//         }}
//       >
//         Apply Leave (Debug Button)
//       </button>

//       {/* This is a visual test. If you see this text appear, the state is changing. */}
//       {showLeaveModal && (
//         <p style={{ marginTop: "20px", color: "green" }}>
//           Modal should be visible now.
//         </p>
//       )}

//       {/* We are still trying to render the modal */}
//       {showLeaveModal && (
//         <LeaveModal
//           setShowLeaveModal={setShowLeaveModal}
//           fetchLeaves={() => console.log("fetchLeaves called")}
//         />
//       )}
//     </div>
//   );
// }