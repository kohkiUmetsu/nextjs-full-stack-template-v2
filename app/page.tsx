export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your App
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A full-stack Next.js template with authentication and database integration.
          </p>
          
          <div className="space-x-4">
            <a
              href="/register"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Authentication</h3>
            <p className="text-gray-600">
              Complete user authentication system with Supabase integration.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7c0-2.21-1.79-4-4-4H8c-2.21 0-4 1.79-4 4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Database</h3>
            <p className="text-gray-600">
              Drizzle ORM with PostgreSQL and type-safe database operations.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">tRPC API</h3>
            <p className="text-gray-600">
              Type-safe API endpoints with full-stack TypeScript integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}