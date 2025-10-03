import React from "react";

const detailInfo = {
  name: "John Carter",
  email: "john@example.com",
  nationality: "American",
  dob: "05 May 1990",
  bloodGroup: "O positive",
  phone: "+1 56598 98956",
  website: "www.focustechnology.com",
  social: "@johncarter",
};

export default function DetailTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white shadow p-4 rounded">
        <h3 className="font-semibold text-lg mb-2">{detailInfo.name}</h3>
        <p>Email: {detailInfo.email}</p>
        <p>Nationality: {detailInfo.nationality}</p>
        <p>Date of Birth: {detailInfo.dob}</p>
        <p>Blood Group: {detailInfo.bloodGroup}</p>
      </div>
      <div className="bg-white shadow p-4 rounded">
        <h3 className="font-semibold text-lg mb-2">Contact Details</h3>
        <p>Phone: {detailInfo.phone}</p>
        <p>Website: {detailInfo.website}</p>
        <p>Social: {detailInfo.social}</p>
      </div>
    </div>
  );
}
