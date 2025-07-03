import React, { useState } from 'react';
import { User, LogIn, AlertCircle, Moon, Sun, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.username = 'يرجى إدخال اسم المستخدم';
    }

    if (!password.trim()) {
      newErrors.password = 'يرجى إدخال كلمة المرور';
    } else if (!/^\d+$/.test(password)) {
      newErrors.password = 'كلمة المرور يجب أن تحتوي على أرقام فقط';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      // محاكاة تأخير تسجيل الدخول
      setTimeout(() => {
        onLogin(username, password);
        setIsLoading(false);
      }, 1000);
    }
  };

  const isFormValid = username.trim() !== '' && password.trim() !== '' && /^\d+$/.test(password);

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 transition-all duration-500" dir="rtl">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-500">
        {/* Floating Shapes */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-blue-400/20 dark:bg-blue-600/20 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-32 left-20 w-16 h-16 bg-purple-400/20 dark:bg-purple-600/20 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-20 right-32 w-24 h-24 bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        <div className="absolute bottom-32 left-10 w-12 h-12 bg-pink-400/20 dark:bg-pink-600/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
        
        {/* Animated Waves */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-transparent dark:from-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/30 to-transparent dark:from-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-transparent dark:from-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '6s' }}></div>
        </div>

        {/* Geometric Patterns */}
        <div className="absolute top-20 left-1/4 w-8 h-8 border-2 border-blue-400/30 dark:border-blue-600/30 rotate-45 animate-spin" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-40 right-1/4 w-6 h-6 border-2 border-purple-400/30 dark:border-purple-600/30 rotate-45 animate-spin" style={{ animationDelay: '2s', animationDuration: '10s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-indigo-400/30 dark:bg-indigo-600/30 rotate-45 animate-ping" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 left-6 p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 z-20 border border-white/20 dark:border-gray-700/20"
      >
        {isDarkMode ? (
          <Sun className="h-6 w-6 text-yellow-500 animate-spin" style={{ animationDuration: '8s' }} />
        ) : (
          <Moon className="h-6 w-6 text-gray-700" />
        )}
      </button>

      <div className="relative max-w-md w-full space-y-8 z-10">
        {/* Login Card */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30 dark:border-gray-700/30 transform hover:scale-105 transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl mb-6 transform hover:scale-110 transition-all duration-300 animate-pulse">
              <User className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent animate-fade-in">
              تسجيل الدخول
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium text-lg">
              نظام إدارة الطلاب المتطور
            </p>
            <div className="mt-2 h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto animate-pulse"></div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                اسم المستخدم
              </label>
              <div className="relative group">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-4 py-4 bg-white/70 dark:bg-gray-700/70 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 text-right placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white backdrop-blur-sm group-hover:bg-white/80 dark:group-hover:bg-gray-700/80 ${
                    errors.username 
                      ? 'border-red-300 dark:border-red-500 bg-red-50/70 dark:bg-red-900/30 animate-shake' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                  }`}
                  placeholder="أدخل اسم المستخدم"
                  dir="auto"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-hover:scale-110">
                  <User className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500" />
                </div>
              </div>
              {errors.username && (
                <div className="flex items-center text-red-600 dark:text-red-400 text-sm mt-2 animate-fade-in">
                  <AlertCircle className="h-4 w-4 ml-1 animate-bounce" />
                  {errors.username}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                كلمة المرور
              </label>
              <div className="relative group">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-4 bg-white/70 dark:bg-gray-700/70 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 text-right placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white backdrop-blur-sm group-hover:bg-white/80 dark:group-hover:bg-gray-700/80 ${
                    errors.password 
                      ? 'border-red-300 dark:border-red-500 bg-red-50/70 dark:bg-red-900/30 animate-shake' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                  }`}
                  placeholder="أدخل الأرقام فقط"
                  pattern="[0-9]*"
                  inputMode="numeric"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-300 transition-all duration-300 hover:scale-110"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center text-red-600 dark:text-red-400 text-sm mt-2 animate-fade-in">
                  <AlertCircle className="h-4 w-4 ml-1 animate-bounce" />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl text-base font-bold text-white transition-all duration-300 transform ${
                isFormValid && !isLoading
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 hover:scale-105 shadow-xl hover:shadow-2xl focus:ring-4 focus:ring-blue-500/50 animate-pulse'
                  : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-60'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white ml-2"></div>
                  جاري تسجيل الدخول...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 ml-2" />
                  تسجيل الدخول
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-3">
                🔑 بيانات التجربة
              </p>
              <div className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">اسم المستخدم:</span>
                  <span className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded font-mono">admin</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">كلمة المرور:</span>
                  <span className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded font-mono">123456</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 rounded-lg p-3">
            © 2025 نظام إدارة الطلاب. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;