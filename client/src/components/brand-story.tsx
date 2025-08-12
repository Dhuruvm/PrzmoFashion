import { ArrowUpRight, Zap, Shield, Sparkles } from "lucide-react";

export default function BrandStory() {
  return (
    <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="animate-slide-up space-y-8">
            <div>
              <span className="inline-block border border-przmo-red rounded-full px-4 py-2 text-sm font-medium uppercase tracking-widest text-przmo-red mb-6">
                Innovation Story
              </span>
              <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Innovation in 
                </span>
                <br />
                <span className="text-przmo-red">Motion</span>
              </h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-xl text-gray-300 leading-relaxed">
                PRZMO represents the intersection of cutting-edge technology and street-inspired design.
                Every piece is engineered for the modern athlete who demands both performance and style.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                From our signature moisture-wicking fabrics to our revolutionary fit technology,
                we're redefining what athletic wear can be. Join the movement of athletes who refuse to compromise.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8">
              <div className="text-center group">
                <div className="bg-przmo-red/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-przmo-red/20 transition-colors duration-300">
                  <Zap className="w-8 h-8 text-przmo-red mx-auto" />
                </div>
                <h4 className="font-bold text-white mb-2">Performance</h4>
                <p className="text-sm text-gray-400">Advanced materials</p>
              </div>
              
              <div className="text-center group">
                <div className="bg-przmo-red/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-przmo-red/20 transition-colors duration-300">
                  <Shield className="w-8 h-8 text-przmo-red mx-auto" />
                </div>
                <h4 className="font-bold text-white mb-2">Durability</h4>
                <p className="text-sm text-gray-400">Built to last</p>
              </div>
              
              <div className="text-center group">
                <div className="bg-przmo-red/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-przmo-red/20 transition-colors duration-300">
                  <Sparkles className="w-8 h-8 text-przmo-red mx-auto" />
                </div>
                <h4 className="font-bold text-white mb-2">Style</h4>
                <p className="text-sm text-gray-400">Street-inspired</p>
              </div>
            </div>

            <button className="group inline-flex items-center space-x-3 bg-gradient-to-r from-przmo-red to-red-600 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-xl">
              <span>Learn Our Story</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Image */}
          <div className="animate-slide-up relative">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Athletic design innovation process"
                className="w-full h-96 object-cover rounded-3xl shadow-2xl"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-przmo-red/20 via-transparent to-white/10 rounded-3xl"></div>
              
              {/* Floating stats */}
              <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
                <div className="text-center">
                  <div className="text-3xl font-black text-black">50K+</div>
                  <div className="text-sm text-gray-600 font-medium">Athletes Trust Us</div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-przmo-red rounded-2xl p-6 shadow-2xl">
                <div className="text-center">
                  <div className="text-3xl font-black text-white">99%</div>
                  <div className="text-sm text-white/90 font-medium">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
