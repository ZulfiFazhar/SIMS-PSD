import React from "react";
import { StartupStatus } from "../types";

export const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}
  >
    {children}
  </div>
);

export const Button = ({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger" | "success";
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}) => {
  const baseStyle =
    "px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    outline: "border border-slate-300 text-slate-600 hover:bg-slate-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    success: "bg-green-600 text-white hover:bg-green-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input = ({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    <input
      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      {...props}
    />
  </div>
);

export const Select = ({
  label,
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: string[];
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    <select
      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      {...props}
    >
      <option value="">Pilih...</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export const Badge = ({ status }: { status: StartupStatus }) => {
  const styles = {
    [StartupStatus.DRAFT]: "bg-gray-100 text-gray-700",
    [StartupStatus.SUBMITTED]: "bg-yellow-100 text-yellow-700",
    [StartupStatus.VERIFIED]: "bg-blue-100 text-blue-700",
    [StartupStatus.REJECTED]: "bg-red-100 text-red-700",
    [StartupStatus.GRADED]: "bg-green-100 text-green-700",
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
};
