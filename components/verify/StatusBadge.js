import React from "react";

const StatusBadge = ({ passwordCount, isRegistered, isProtected }) => {
  const getStatusText = () => {
    if (isProtected) {
      if (passwordCount === 1) {
        return "사전 등록됨";
      } else if (passwordCount >= 2) {
        return "등록됨";
      }
    } else {
      if (isRegistered && passwordCount >= 1) {
        return "등록됨";
      }
    }
    if (!isRegistered) {
      return "미등록";
    }
    return "미등록";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "사전 등록됨":
        return "bg-[#FEF3C7] text-[#92400E]";
      case "등록됨":
        return "bg-[#F0FDF4] text-[#166534]";
      case "미등록":
        return "bg-[#E5E7EB] text-[#64748B]";
      default:
        return "bg-[#E5E7EB] text-[#64748B]";
    }
  };

  const statusText = getStatusText();
  const statusColor = getStatusColor(statusText);

  return (
    <span
      className={`px-2 py-1 text-sm md:text-base font-bold rounded-full ${statusColor}`}
    >
      {statusText}
    </span>
  );
};

export default StatusBadge;
