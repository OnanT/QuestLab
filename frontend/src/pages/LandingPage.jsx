import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { BookOpen, Gamepad2, Trophy, Users, ChevronRight, Star, Zap, Target } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF5]">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-orange-500/10" />
        
        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12 lg:px-20">
          <div className="flex items-center gap-2">
            <img
              src="/questlab-logo.png"
              alt="QuestLab Logo"
              className="h-[38px] w-auto md:h-[44px] lg:h-[48px]"
            />
            <span className="text-2xl font-bold font-heading text-slate-800">QuestLab</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-slate-700 hover:text-teal-600" data-testid="login-btn">
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-6" data-testid="register-btn">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 px-6 py-16 md:px-12 lg:px-20 md:py-24">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium">
                <Star className="w-4 h-4" />
                Caribbean Learning Adventure
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-slate-900 leading-tight">
                Learn Through
                <span className="text-teal-600"> Play</span>,
                <br />
                Grow With
                <span className="text-orange-500"> Fun</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
                QuestLab makes learning exciting for Caribbean students with interactive lessons, 
                engaging games, and rewarding achievements. Join thousands of learners on their educational adventure!
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8 py-6 text-lg font-accent shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-shadow" data-testid="hero-get-started-btn">
                    Start Learning Free
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="rounded-full px-8 py-6 text-lg border-2 border-slate-300 hover:border-teal-500 hover:text-teal-600" data-testid="hero-login-btn">
                    I Have an Account
                  </Button>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold font-heading text-slate-900">29+</div>
                  <div className="text-sm text-slate-500">Caribbean Islands</div>
                </div>
                <div>
                  <div className="text-3xl font-bold font-heading text-slate-900">4</div>
                  <div className="text-sm text-slate-500">Game Types</div>
                </div>
                <div>
                  <div className="text-3xl font-bold font-heading text-slate-900">100%</div>
                  <div className="text-sm text-slate-500">Free to Start</div>
                </div>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-orange-400/20 rounded-3xl transform rotate-3" />
              <img
              src="https://onan.shop/assets/images/gallery/questlab-landing.png"
              alt="Students learning"
              className="relative rounded-3xl shadow-2xl shadow-teal-500/20 w-full object-cover aspect-[4/3]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23f0fdf4'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='%230d9488' text-anchor='middle'%3EQuestLab Learning%3C/text%3E%3C/svg%3E";
              }}
            />
              
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Achievement</div>
                    <div className="font-bold text-slate-800">Quiz Master!</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Points Earned</div>
                    <div className="font-bold text-slate-800 font-accent">+250 pts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="px-6 py-20 md:px-12 lg:px-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-4">
              Everything You Need to Learn
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              QuestLab combines the best teaching methods with fun gaming elements to make learning irresistible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="group p-6 rounded-3xl bg-gradient-to-br from-teal-50 to-white border border-teal-100 hover:shadow-xl hover:shadow-teal-500/10 transition-shadow">
              <div className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-900 mb-3">Interactive Lessons</h3>
              <p className="text-slate-600">Engaging content tailored to Caribbean curriculum with rich multimedia.</p>
            </div>

            {/* Feature 2 */}
            <div className="group p-6 rounded-3xl bg-gradient-to-br from-orange-50 to-white border border-orange-100 hover:shadow-xl hover:shadow-orange-500/10 transition-shadow">
              <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Gamepad2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-900 mb-3">4 Game Types</h3>
              <p className="text-slate-600">Skill Builder, Quiz Battle, Story Quest, and Map Challenge await!</p>
            </div>

            {/* Feature 3 */}
            <div className="group p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-white border border-amber-100 hover:shadow-xl hover:shadow-amber-500/10 transition-shadow">
              <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-900 mb-3">Earn Rewards</h3>
              <p className="text-slate-600">Collect points, unlock badges, and climb the leaderboard!</p>
            </div>

            {/* Feature 4 */}
            <div className="group p-6 rounded-3xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 hover:shadow-xl hover:shadow-purple-500/10 transition-shadow">
              <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-900 mb-3">Family Friendly</h3>
              <p className="text-slate-600">Parents and teachers can track progress and guide learning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Game Types Section */}
      <section className="px-6 py-20 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-4">
              Four Ways to Play & Learn
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Each game type is designed to strengthen different skills while keeping you entertained.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="game-card p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heading text-slate-900 mb-2">Skill Builder</h3>
                  <p className="text-slate-600 mb-4">Practice makes perfect! Build your skills with quick drills and exercises.</p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Math</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">English</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="game-card p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heading text-slate-900 mb-2">Quiz Battle</h3>
                  <p className="text-slate-600 mb-4">Race against the clock! Answer questions fast to earn maximum points.</p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">Timed</span>
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">Competitive</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="game-card p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heading text-slate-900 mb-2">Story Quest</h3>
                  <p className="text-slate-600 mb-4">Choose your own adventure! Your decisions shape the story outcome.</p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Narrative</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Choices</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="game-card p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heading text-slate-900 mb-2">Map Challenge</h3>
                  <p className="text-slate-600 mb-4">Explore the Caribbean! Locate islands and learn geography.</p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Geography</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Visual</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-12 md:p-16 shadow-2xl shadow-teal-500/30">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-6">
            Ready to Start Your Learning Adventure?
          </h2>
          <p className="text-teal-100 text-lg mb-8 max-w-2xl mx-auto">
            Join QuestLab today and discover a fun new way to learn. It's free to get started!
          </p>
          <Link to="/register">
            <Button className="bg-white text-teal-600 hover:bg-teal-50 rounded-full px-10 py-6 text-lg font-accent shadow-lg" data-testid="cta-register-btn">
              Create Free Account
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 lg:px-20 border-t border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold font-accent">Q</span>
            </div>
            <span className="text-lg font-bold font-heading text-slate-800">QuestLab</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2024 QuestLab Caribbean Learning Platform. Made with love for Caribbean students.
          </p>
        </div>
      </footer>
    </div>
  );
}

