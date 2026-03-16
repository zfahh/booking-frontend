export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Concert Booking</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
