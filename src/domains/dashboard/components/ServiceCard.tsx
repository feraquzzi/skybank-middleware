interface ServiceCardProps {
  title: string;
  description: string;
  method: string;
  endpoint: string;
  buttonText: string;
  buttonColor?: "orange" | "gray";
  icon: React.ReactNode;
  defaultLabel?: string;
}

export default function ServiceCard({
  title,
  description,
  method,
  endpoint,
  buttonText,
  buttonColor = "orange",
  icon,
  defaultLabel,
}: ServiceCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
          {icon}
        </div>

        <div className="flex items-center gap-3">
          {/* Default pill - only for ROLE_CLIENT */}
          {defaultLabel ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-gray-100 text-gray-600 text-xs font-medium">
              <span className="w-1 h-1 rounded-full bg-gray-400" />
              {defaultLabel}
            </span>
          ) : (
            ""
          )}

          {/* Active pill - always shown */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-green-100 text-green-600 text-xs font-medium">
            <span className="w-1 h-1 rounded-full bg-green-400" />
            Active
          </span>
        </div>
      </div>

      <h4 className="text-base font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-3">{description}</p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">{method}</span>
          <span className="text-xs text-gray-400 font-mono">{endpoint}</span>
        </div>
        <button className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
          buttonColor === "orange"
            ? "bg-orange-500 text-white hover:bg-orange-600"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}