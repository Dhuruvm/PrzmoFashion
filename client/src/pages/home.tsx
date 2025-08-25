import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import DropsSection from "@/components/drops-section";
import Footer from "@/components/footer";

// New sections for a complete ecommerce experience
function FeaturedSection() {
  const featuredProducts = [
    {
      id: 5,
      title: "PRZMO Performance Elite",
      subtitle: "The Future of Athletic Wear", 
      description: "Revolutionary fabric technology meets precision engineering",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop",
      price: "₹ 4,995",
      cta: "Explore Elite"
    },
    {
      id: 6,
      title: "PRZMO Street Collection",
      subtitle: "Where Sport Meets Style",
      description: "Elevated streetwear for the modern athlete",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
      price: "₹ 2,495",
      cta: "Shop Street"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4">FEATURED</h2>
          <p className="text-lg text-gray-600">Premium collections designed for champions</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h3 className="text-3xl font-black mb-2">{product.title}</h3>
                <p className="text-lg font-light mb-2">{product.subtitle}</p>
                <p className="text-sm mb-4 opacity-90">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{product.price}</span>
                  <button className="bg-white text-black px-6 py-3 font-semibold hover:bg-gray-100 transition-colors">
                    {product.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  const categories = [
    {
      name: "Performance",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop",
      count: "24 Products"
    },
    {
      name: "Lifestyle", 
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=500&fit=crop",
      count: "18 Products"
    },
    {
      name: "Training",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop", 
      count: "32 Products"
    },
    {
      name: "Street",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
      count: "15 Products"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4">SHOP BY CATEGORY</h2>
          <p className="text-lg text-gray-600">Find your perfect athletic lifestyle match</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div key={category.name} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl aspect-[3/4] mb-4">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandStorySection() {
  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              MORE THAN ATHLETIC WEAR
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              PRZMO represents the fusion of performance and lifestyle. We don't just create athletic wear; 
              we craft experiences that empower athletes to push beyond their limits.
            </p>
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="text-2xl font-bold mb-2">2024</h4>
                <p className="text-gray-400">Founded</p>
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-2">50K+</h4>
                <p className="text-gray-400">Athletes Trust Us</p>
              </div>
            </div>
            <button className="bg-white text-black px-8 py-4 font-semibold hover:bg-gray-100 transition-colors">
              Our Story
            </button>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&h=700&fit=crop" 
              alt="PRZMO Brand Story"
              className="rounded-2xl w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <FeaturedSection />
      <DropsSection />
      <CategoriesSection />
      <BrandStorySection />
      <Footer />
    </div>
  );
}