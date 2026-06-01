"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { login, signup, loading, error, clearError, user } = useAuthStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [booted, setBooted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (user) router.push("/menu");
  }, [user, router]);

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 400);
    return () => clearTimeout(t);
  }, []);

  // Hex grid background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const hexRadius = 28;
    const hexH = hexRadius * Math.sqrt(3);
    const hexW = hexRadius * 2;
    const cols = Math.ceil(canvas.width / (hexW * 0.75)) + 2;
    const rows = Math.ceil(canvas.height / hexH) + 2;

    let frame = 0;
    let animId: number;

    function hexPath(x: number, y: number, r: number) {
      ctx!.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const px = x + r * Math.cos(angle);
        const py = y + r * Math.sin(angle);
        if (i === 0) ctx!.moveTo(px, py);
        else ctx!.lineTo(px, py);
      }
      ctx!.closePath();
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      for (let col = -1; col < cols; col++) {
        for (let row = -1; row < rows; row++) {
          const x = col * hexW * 0.75;
          const y = row * hexH + (col % 2 === 0 ? 0 : hexH / 2);
          const dist = Math.sqrt((x - canvas.width / 2) ** 2 + (y - canvas.height / 2) ** 2);
          const phase = (frame * 0.008 + dist * 0.003) % (Math.PI * 2);
          const alpha = (Math.sin(phase) * 0.5 + 0.5) * 0.06 + 0.01;

          hexPath(x, y, hexRadius - 1);
          ctx.strokeStyle = `rgba(200, 164, 93, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      animId = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    if (!username.trim() || !password.trim()) {
      setLocalError("All fields are required.");
      return;
    }

    if (mode === "register") {
      if (password !== confirmPassword) {
        setLocalError("Access codes do not match.");
        return;
      }
      await signup(username, password);
    } else {
      await login(username, password);
    }
  };

  const displayError = localError || error;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-obsidian">
      {/* Hex background */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(11,14,18,0.85) 100%)",
        }}
      />

      {/* Ward rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="ward-circle"
          style={{ width: 600, height: 600, opacity: 0.12, border: "1px solid #C8A45D" }}
        />
        <div
          className="ward-circle absolute"
          style={{ width: 400, height: 400, opacity: 0.08, border: "1px solid #5FD7D1" }}
        />
      </div>

      {/* Main panel */}
      <div
        className={`relative z-10 w-full max-w-md mx-4 transition-all duration-500 ${
          booted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Title block */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-aegis-gold opacity-30" />
            <div
              className="w-8 h-8 border border-aegis-gold opacity-60 rotate-45"
              style={{ background: "rgba(200,164,93,0.05)" }}
            />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-aegis-gold opacity-30" />
          </div>

          <h1
            className="font-cinzel text-4xl font-bold tracking-wider text-bone mb-1"
            style={{ textShadow: "0 0 40px rgba(200,164,93,0.2)" }}
          >
            AEGIS
          </h1>
          <h1
            className="font-cinzel text-2xl font-semibold tracking-[0.4em] text-aegis-gold mb-3"
            style={{ textShadow: "0 0 20px rgba(200,164,93,0.3)" }}
          >
            DEFENSE
          </h1>
          <p className="font-rajdhani text-xs tracking-[0.2em] text-ash uppercase">
            {mode === "login"
              ? "— Operational Command Interface —"
              : "— Operative Enlistment Terminal —"}
          </p>
        </div>

        {/* Boot line */}
        {booted && (
          <div className="boot-line mb-6 mx-auto" style={{ maxWidth: "60%" }} />
        )}

        {/* Auth panel */}
        <div className="aegis-panel aegis-panel-gold rounded-none p-6">
          {/* Mode toggle */}
          <div className="flex mb-6 border border-gunmetal">
            <button
              type="button"
              onClick={() => { setMode("login"); clearError(); setLocalError(""); }}
              className={`flex-1 py-2.5 font-rajdhani font-700 text-xs tracking-widest uppercase transition-all ${
                mode === "login"
                  ? "bg-aegis-gold/10 text-aegis-gold border-r border-gunmetal"
                  : "text-ash hover:text-bone border-r border-gunmetal"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); clearError(); setLocalError(""); }}
              className={`flex-1 py-2.5 font-rajdhani font-700 text-xs tracking-widest uppercase transition-all ${
                mode === "register"
                  ? "bg-aegis-gold/10 text-aegis-gold"
                  : "text-ash hover:text-bone"
              }`}
            >
              Enlist
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Username */}
            <div>
              <label className="block font-rajdhani text-xs tracking-widest uppercase text-ash mb-1.5">
                Operative Callsign
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. bastion_seven"
                autoComplete="username"
                spellCheck={false}
                maxLength={20}
                className="aegis-input"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-rajdhani text-xs tracking-widest uppercase text-ash mb-1.5">
                Access Code
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="aegis-input"
                disabled={loading}
              />
            </div>

            {/* Confirm password (register only) */}
            {mode === "register" && (
              <div>
                <label className="block font-rajdhani text-xs tracking-widest uppercase text-ash mb-1.5">
                  Confirm Access Code
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="aegis-input"
                  disabled={loading}
                />
              </div>
            )}

            {/* Error display */}
            {displayError && (
              <div className="flex items-start gap-2 p-3 border border-ember/30 bg-ember/5">
                <span className="text-ember font-rajdhani text-xs mt-0.5">⚠</span>
                <p className="text-ember font-rajdhani text-xs leading-relaxed">{displayError}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="scan-pulse">
                  {mode === "login" ? "Authenticating..." : "Processing..."}
                </span>
              ) : mode === "login" ? (
                "Initiate Session"
              ) : (
                "Enlist Operative"
              )}
            </button>
          </form>

          {/* Register note */}
          {mode === "register" && (
            <p className="mt-4 text-center font-inter text-xs text-ash opacity-60">
              Callsign must be 3–20 characters: letters, numbers, underscores.
            </p>
          )}
        </div>

        {/* Footer tagline */}
        <p className="text-center mt-6 font-rajdhani text-xs tracking-widest uppercase text-ash opacity-30">
          Defend the Fortress. Command the Towers.
        </p>
      </div>
    </div>
  );
}
