import FeatureGrid from "./FeatureGrid";

export default function Hero() {
  return (
    <section className="flex flex-col lg:flex-row items-center gap-12 px-14 py-16">
      <div className="flex-1 space-y-6">
        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-semi-bold leading-[1.1] tracking-tight">
          <span className="bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent sm:text-6xl lg:text-6xl font-bold">
            Welcome to Sky Bank Middleware
          </span>{" "}
          <br></br>
          <span className="text-gray-900  font-semi-bold">
            Onboarding Platform
          </span>
        </h1>
        <p className="text-gray-500 text-base leading-relaxed max-w-lg">
          Experience seamless banking operations, secure transactions, and
          intelligent financial management. Join us in revolutionizing the
          banking experience.
        </p>

        <div className="flex items-center gap-4 pt-2">
          <a
            href="#register"
            className="px-6 py-3 bg-orange-500 text-white text-sm font-medium rounded-full hover:bg-orange-600 transition-colors"
          >
            Register your company
          </a>
          <a
            href="#login"
            className="px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
          >
            Login
          </a>
        </div>

        {/* <div className="flex items-center gap-4 pt-6">
          <div className="flex -space-x-3">
            <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white text-xs font-bold border-2 border-white z-30">
              AN
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white z-20">
              SK
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white z-10">
              MD
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
              <span className="text-orange-500">&#8593;</span> 25 Million +
            </div>
            <p className="text-xs text-gray-400">
              Empowering your financial future with innovative solutions.
            </p>
          </div>
        </div> */}
      </div>

      <div className="flex-1 w-full">
        <FeatureGrid />
      </div>
    </section>
  );
}
