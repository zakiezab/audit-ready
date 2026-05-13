const msItems = [
  { name: "Azure",                dot: "#0078D4" },
  { name: "Microsoft Entra ID",   dot: "#00B4F0" },
  { name: "Power Platform",       dot: "#742774" },
  { name: "Cognitive Search",     dot: "#00A2E8" },
];

function MicrosoftLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 23 23"
      width={18}
      height={18}
      aria-hidden
    >
      <path fill="#f25022" d="M1 1h10v10H1z" />
      <path fill="#7fba00" d="M12 1h10v10H12z" />
      <path fill="#00a4ef" d="M1 12h10v10H1z" />
      <path fill="#ffb900" d="M12 12h10v10H12z" />
    </svg>
  );
}

export function MicrosoftBar() {
  return (
    <div className="audit-card flex items-center px-5 py-3 gap-0">
      <div className="mr-5 flex flex-shrink-0 items-center gap-2">
        <MicrosoftLogo className="flex-shrink-0" />
        <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-secondary-300">
          Microsoft Ecosystem
        </p>
      </div>
      <div className="flex flex-1 flex-wrap">
        {msItems.map((item, i) => (
          <div
            key={item.name}
            className={`flex items-center gap-2 px-4 py-1 text-xs text-secondary-300 ${
              i < msItems.length - 1 ? "border-r border-[rgba(255,255,255,0.06)]" : ""
            } ${i === 0 ? "pl-0" : ""}`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: item.dot }}
            />
            {item.name}
          </div>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-1.5 text-[10px] font-semibold text-risk-low whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-risk-low" />
        All Connected
      </div>
    </div>
  );
}
