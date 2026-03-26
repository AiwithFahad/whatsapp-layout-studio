import { useState } from "react";
import { MessageCircle, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const result = login(identifier, password);
      setLoading(false);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.error || "Login failed");
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[45%] bg-gs-green" />
      <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-background" />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 gs-card-shadow">
            <MessageCircle className="w-10 h-10 text-gs-green" />
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground tracking-tight">GhupShup</h1>
          <p className="text-primary-foreground/70 text-sm mt-1">Premium Messaging Experience</p>
        </div>

        <div className="bg-card rounded-2xl p-8 gs-card-shadow">
          <h2 className="text-xl font-bold text-gs-text-primary mb-1">Welcome back</h2>
          <p className="text-sm text-gs-text-secondary mb-6">Sign in to continue your conversations</p>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-xl mb-4 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gs-text-secondary uppercase tracking-wider mb-1.5 block">
                Username, Email or Phone
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your username"
                className="w-full bg-gs-search rounded-xl px-4 py-3 text-sm text-gs-text-primary placeholder:text-gs-text-secondary outline-none gs-input-shadow focus:ring-2 focus:ring-gs-green/30 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gs-text-secondary uppercase tracking-wider mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-gs-search rounded-xl px-4 py-3 pr-12 text-sm text-gs-text-primary placeholder:text-gs-text-secondary outline-none gs-input-shadow focus:ring-2 focus:ring-gs-green/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gs-text-secondary hover:text-gs-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-xs text-gs-green hover:text-gs-green-dark font-semibold transition-colors">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gs-green text-primary-foreground py-3.5 rounded-xl font-semibold text-sm hover:bg-gs-green-dark transition-all duration-200 gs-send-shadow flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gs-divider text-center">
            <p className="text-xs text-gs-text-secondary">
              Demo credentials: <span className="font-semibold text-gs-text-primary">rehan</span> / <span className="font-semibold text-gs-text-primary">ghupshup123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
