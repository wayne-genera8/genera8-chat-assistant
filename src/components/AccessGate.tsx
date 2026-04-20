import { useState, useEffect, FormEvent } from "react";

const ACCESS_CODE = "lotmanager2026@genera8";
const STORAGE_KEY = "lm_access_granted";

interface AccessGateProps {
  children: React.ReactNode;
}

const AccessGate = ({ children }: AccessGateProps) => {
  const [granted, setGranted] = useState(false);
  const [checked, setChecked] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") {
      setGranted(true);
    }
    setChecked(true);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (code === ACCESS_CODE) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setGranted(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!checked) return null;
  if (granted) return <>{children}</>;

  return (
    <div
      className="flex flex-col items-center justify-center h-dvh px-6"
      style={{ background: "#141414" }}
    >
      <div className="w-full max-w-[360px]">
        <div className="flex items-center justify-center mb-8">
          <span className="text-2xl mr-1.5">⚡</span>
          <span className="font-bold text-lg" style={{ color: "#36F085" }}>
            LotManager
          </span>
          <span className="ml-1.5 text-sm" style={{ color: "#888" }}>
            by Genera8
          </span>
        </div>

        <h1 className="text-xl font-semibold text-center mb-2" style={{ color: "#f0f0f0" }}>
          Enter access code
        </h1>
        <p className="text-sm text-center mb-6" style={{ color: "#888" }}>
          This chat is private. Enter the code to continue.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            autoFocus
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (error) setError(false);
            }}
            placeholder="Access code"
            className="text-[15px] outline-none px-4 py-3 transition-colors"
            style={{
              background: "#1a1a1a",
              border: `1px solid ${error ? "#e85d3a" : "#2a2a2a"}`,
              borderRadius: 12,
              color: "#f0f0f0",
            }}
            onFocus={(e) => {
              if (!error) e.target.style.borderColor = "#36F085";
            }}
            onBlur={(e) => {
              if (!error) e.target.style.borderColor = "#2a2a2a";
            }}
          />
          {error && (
            <p className="text-[13px]" style={{ color: "#e85d3a" }}>
              Incorrect code. Please try again.
            </p>
          )}
          <button
            type="submit"
            disabled={!code.trim()}
            className="text-[15px] font-semibold px-5 py-3 transition-opacity"
            style={{
              background: "#36F085",
              color: "#141414",
              borderRadius: 12,
              opacity: !code.trim() ? 0.5 : 1,
            }}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccessGate;
