import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle, Sparkles, Users, Briefcase, ArrowRight } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@abacco.com");
  const [password, setPassword] = useState("admin1234");
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const response = await login(email, password);
      
      // Determine role - adjust based on your auth response structure
      const role = response?.role || response?.user?.role || "employee";
      setUserRole(role.toLowerCase());
      
      // Set welcome message based on role
      let message = "";
      const roleLower = role.toLowerCase();
      if (roleLower === "admin") {
        message = "Welcome Admin!";
      } else if (roleLower === "manager") {
        message = "Welcome Manager!";
      } else {
        message = "Welcome Employee!";
      }
      
      setWelcomeMessage(message);
      setShowWelcome(true);

      // Redirect after showing welcome message
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (e) {
      setErr(e?.response?.data?.error || "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float-1 top-0 -left-4"></div>
        <div className="absolute w-96 h-96 bg-violet-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float-2 top-0 right-0"></div>
        <div className="absolute w-96 h-96 bg-fuchsia-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float-3 bottom-0 left-20"></div>
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Welcome Overlay - Full Screen with New Animation */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-600 via-violet-600 to-fuchsia-600 animate-gradient-shift">
          <div className="text-center">
            {/* Ripple Effect Background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-white/10 rounded-full animate-ripple-1"></div>
              <div className="w-64 h-64 bg-white/10 rounded-full absolute animate-ripple-2"></div>
              <div className="w-64 h-64 bg-white/10 rounded-full absolute animate-ripple-3"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 animate-zoom-in">
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  {/* Rotating Border */}
                  <div className="w-40 h-40 border-4 border-white/30 border-t-white rounded-full animate-spin-slow absolute inset-0"></div>
                  
                  {/* Icon Container */}
                  <div className="w-40 h-40 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-float-icon">
                    {userRole === "admin" ? (
                      <Briefcase className="w-20 h-20 text-white animate-icon-pop" />
                    ) : userRole === "manager" ? (
                      <Users className="w-20 h-20 text-white animate-icon-pop" />
                    ) : (
                      <Users className="w-20 h-20 text-white animate-icon-pop" />
                    )}
                  </div>
                  
                  {/* Success Check */}
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 animate-check-pop">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  
                  {/* Sparkles */}
                  <Sparkles className="w-8 h-8 text-yellow-300 absolute -top-4 -right-4 animate-twinkle-1" />
                  <Sparkles className="w-6 h-6 text-yellow-300 absolute -bottom-4 -left-4 animate-twinkle-2" />
                </div>
              </div>
              
              {/* Text with Slide Animation */}
              <div className="overflow-hidden mb-3">
                <h2 className="text-6xl md:text-7xl font-bold text-white animate-slide-in-top">
                  Success!
                </h2>
              </div>
              
              <div className="overflow-hidden mb-8">
                <p className="text-3xl md:text-4xl text-white/95 font-medium animate-slide-in-bottom">
                  {welcomeMessage}
                </p>
              </div>

              {/* Loading Bar */}
              <div className="w-64 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-white rounded-full animate-loading-bar"></div>
              </div>
              
              {/* Redirecting Text */}
              <p className="text-white/80 text-sm mt-4 flex items-center justify-center gap-2 animate-fade-in-delayed">
                Redirecting you now <ArrowRight className="w-4 h-4 animate-arrow-move" />
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Users className="w-10 h-10" style={{ color: '#7F27FF' }} />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ 
              backgroundImage: 'linear-gradient(to right, #7F27FF, #9D4EDD, #C77DFF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Abacco HR CRM
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-600 font-light">
            Human Resource Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md animate-slide-up">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border-2 border-gray-100">
            <h2 className="text-3xl font-bold mb-2 text-center" style={{ 
              backgroundImage: 'linear-gradient(to right, #7F27FF, #9D4EDD)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Welcome Back
            </h2>
            <p className="text-gray-500 text-center mb-6">Sign in to continue</p>
            
            {err && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border-2 border-red-200 animate-shake">
                <p className="font-medium text-center">{err}</p>
              </div>
            )}

            <form onSubmit={submit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  style={{ '--tw-ring-color': '#7F27FF' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all pr-12"
                    style={{ '--tw-ring-color': '#7F27FF' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl mt-6"
                style={{ 
                  backgroundImage: 'linear-gradient(to right, #7F27FF, #9D4EDD)',
                }}
                disabled={loading || showWelcome}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Tip */}
            <p className="text-xs text-gray-500 text-center mt-6 bg-gray-50 p-3 rounded-lg">
              💡 Tip: Use seeded credentials admin@abacco.com / admin1234
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm animate-fade-in">
          <p>© 2024 Abacco HR CRM. All rights reserved.</p>
        </div>
      </div>
      <style>{`
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(30px, -30px) scale(1.1) rotate(120deg); }
          66% { transform: translate(-20px, 20px) scale(0.9) rotate(240deg); }
        }

        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(-30px, 30px) scale(1.05) rotate(-120deg); }
          66% { transform: translate(20px, -20px) scale(0.95) rotate(-240deg); }
        }

        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(40px, 40px) scale(1.08) rotate(90deg); }
          66% { transform: translate(-30px, -30px) scale(0.92) rotate(180deg); }
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes ripple-1 {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        @keyframes ripple-2 {
          0% { transform: scale(0.8); opacity: 0.4; }
          100% { transform: scale(3); opacity: 0; }
        }

        @keyframes ripple-3 {
          0% { transform: scale(0.8); opacity: 0.2; }
          100% { transform: scale(3.5); opacity: 0; }
        }

        @keyframes zoom-in {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes float-icon {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes icon-pop {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        @keyframes check-pop {
          0% { transform: scale(0) rotate(-180deg); }
          60% { transform: scale(1.2) rotate(10deg); }
          100% { transform: scale(1) rotate(0deg); }
        }

        @keyframes twinkle-1 {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.3) rotate(180deg); opacity: 0.5; }
        }

        @keyframes twinkle-2 {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(0.7) rotate(-180deg); opacity: 0.3; }
        }

        @keyframes slide-in-top {
          0% { transform: translateY(-100px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes slide-in-bottom {
          0% { transform: translateY(100px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes loading-bar {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        @keyframes arrow-move {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }

        @keyframes fade-in-delayed {
          0% { opacity: 0; }
          70% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .animate-float-1 { animation: float-1 8s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 10s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 12s ease-in-out infinite; }
        .animate-gradient-shift { 
          animation: gradient-shift 3s ease infinite;
          background-size: 200% 200%;
        }
        .animate-ripple-1 { animation: ripple-1 2s ease-out infinite; }
        .animate-ripple-2 { animation: ripple-2 2s ease-out 0.3s infinite; }
        .animate-ripple-3 { animation: ripple-3 2s ease-out 0.6s infinite; }
        .animate-zoom-in { animation: zoom-in 0.6s ease-out; }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
        .animate-float-icon { animation: float-icon 2s ease-in-out infinite; }
        .animate-icon-pop { animation: icon-pop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .animate-check-pop { animation: check-pop 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.3s backwards; }
        .animate-twinkle-1 { animation: twinkle-1 1.5s ease-in-out infinite; }
        .animate-twinkle-2 { animation: twinkle-2 2s ease-in-out infinite; }
        .animate-slide-in-top { animation: slide-in-top 0.8s ease-out 0.2s backwards; }
        .animate-slide-in-bottom { animation: slide-in-bottom 0.8s ease-out 0.4s backwards; }
        .animate-loading-bar { animation: loading-bar 3s ease-out; }
        .animate-arrow-move { animation: arrow-move 1s ease-in-out infinite; }
        .animate-fade-in-delayed { animation: fade-in-delayed 2s ease-out; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-shake { animation: shake 0.3s ease-in-out; }

        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        input:focus {
          outline: 2px solid #7F27FF;
        }
      `}</style>
    </div>
  );
}