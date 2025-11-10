import React from "react";
import { Megaphone, UserCheck } from "lucide-react";

export default function AnnouncementsAndInterviews({ data = {} }) {
  const { announcements = [], upcomingInterviews = [] } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* 📢 Announcements Section */}
      <div className="bg-white shadow rounded-2xl p-5">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-orange-500" /> Company Announcements
        </h2>

        {announcements.length ? (
          <ul className="space-y-2">
            {announcements.map((a, idx) => (
              <li key={a.id || idx} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">
                  {a.title || "Untitled Announcement"}
                </p>
                <p className="text-sm text-gray-600">
                  {a.desc || "No description available."}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No announcements yet.</p>
        )}
      </div>

      {/* 👥 Upcoming Interviews Section */}
      <div className="bg-white shadow rounded-2xl p-5">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-green-500" /> Upcoming Interviews
        </h2>

        {upcomingInterviews.length ? (
          <ul className="space-y-2">
            {upcomingInterviews.map((i, idx) => (
              <li key={i.id || idx} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">
                  {i.candidate || "Candidate name not available"}
                </p>
                <p className="text-sm text-gray-600">
                  {(i.position || "Unknown Position") +
                    " — " +
                    (i.department || "No Department")}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {i.time
                    ? i.time
                    : "Time TBD"}{" "}
                  •{" "}
                  {i.date
                    ? new Date(i.date).toLocaleDateString()
                    : "Date not set"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No interviews scheduled.</p>
        )}
      </div>
    </div>
  );
}








// import React from "react";
// import { Bell, Calendar, Clock } from "lucide-react";

// export default function AnnouncementsAndInterviews({ data }) {
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//       {/* Announcements */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-lg font-bold text-gray-900">Announcements</h2>
//         </div>
//         <div className="space-y-4">
//           {data.announcements.map((announcement) => (
//             <div key={announcement.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
//               <div className={`p-2 rounded-lg ${
//                 announcement.priority === 'high' ? 'bg-red-100' :
//                 announcement.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
//               }`}>
//                 <Bell className={`w-5 h-5 ${
//                   announcement.priority === 'high' ? 'text-red-600' :
//                   announcement.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
//                 }`} />
//               </div>
//               <div className="flex-1">
//                 <h3 className="font-semibold text-gray-900 mb-1">{announcement.title}</h3>
//                 <p className="text-sm text-gray-600 mb-2">{announcement.desc}</p>
//                 <p className="text-xs text-gray-500">{announcement.date}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Upcoming Interviews */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-lg font-bold text-gray-900">Upcoming Interviews</h2>
//         </div>
//         <div className="space-y-4">
//           {data.upcomingInterviews.map((interview) => (
//             <div key={interview.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
//               <div className="p-2 bg-blue-100 rounded-lg">
//                 <Calendar className="w-5 h-5 text-blue-600" />
//               </div>
//               <div className="flex-1">
//                 <div className="flex items-start justify-between mb-2">
//                   <div>
//                     <h3 className="font-semibold text-gray-900">{interview.candidate}</h3>
//                     <p className="text-sm text-gray-600">{interview.position}</p>
//                   </div>
//                   <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">{interview.type}</span>
//                 </div>
//                 <div className="flex items-center gap-4 text-xs text-gray-500">
//                   <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{interview.time}</span>
//                   <span>•</span>
//                   <span>{interview.department}</span>
//                   <span>•</span>
//                   <span>Interviewer: {interview.interviewer}</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
