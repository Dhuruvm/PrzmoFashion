import { useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  alt: string;
  colors: number;
}

export default function DropsSection() {
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "PRZMO Sportswear Chill Poplin",
      description: "Women's Striped Boxy Top",
      price: "₹ 2,995.00",
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      alt: "PRZMO Women's striped boxy top",
      colors: 2
    },
    {
      id: 2,
      name: "PRZMO Sportswear",
      description: "Women's T-shirt",
      price: "₹ 2,195.00",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      alt: "PRZMO Women's black t-shirt",
      colors: 3
    },
    {
      id: 3,
      name: "PRZMO Performance Hoodie",
      description: "Unisex Athletic Wear",
      price: "₹ 3,495.00",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      alt: "PRZMO Performance hoodie",
      colors: 3
    },
    {
      id: 4,
      name: "PRZMO Training Shorts",
      description: "Men's Athletic Shorts",
      price: "₹ 1,795.00",
      image: "https://images.unsplash.com/photo-1506629905607-d405b8fc7aab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      alt: "PRZMO Training shorts",
      colors: 3
    }
  ]);

  return (
    <section id="drops" className="py-8 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="text-sm text-gray-600 mb-4">
          <span>New Releases</span> / <span>Clothing</span> / <span className="text-black">Tops & T-Shirts</span>
        </div>

        {/* Section Header - Nike Style */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-medium text-black mb-4">
            New Tops & T-Shirts
          </h1>
          
          {/* Category Filters */}
          <div className="flex gap-4 md:gap-8 mb-4 overflow-x-auto">
            <button className="text-sm md:text-base font-medium text-black border-b-2 border-black pb-1 whitespace-nowrap">
              Graphic T-Shirts
            </button>
            <button className="text-sm md:text-base text-gray-600 hover:text-black transition-colors whitespace-nowrap">
              Long Sleeve Shirts
            </button>
            <button className="text-sm md:text-base text-gray-600 hover:text-black transition-colors whitespace-nowrap">
              Short Sleeve
            </button>
          </div>

          {/* Results and Filter */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-sm md:text-base">
              {products.length} Results
            </p>
            <button className="flex items-center gap-2 text-sm md:text-base font-medium text-black hover:text-gray-600 transition-colors border border-gray-300 px-4 py-2 rounded-full" data-testid="button-filter">
              Filter
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Product Grid - Nike Double Card Style */}
        <div className="grid grid-cols-2 gap-1 md:gap-3">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer" data-testid={`product-card-${product.id}`}>
              {/* Product Image */}
              <div className="relative w-full aspect-square mb-2 md:mb-3 overflow-hidden bg-gray-50">
                <img
                  src={product.image}
                  alt={product.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  data-testid={`product-image-${product.id}`}
                />
                
                {/* Just In Badge */}
                <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4">
                  <span className="text-orange-600 text-xs md:text-sm font-medium">
                    Just In
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-0.5 md:space-y-1 px-1">
                {/* Product Name */}
                <h3 className="text-black font-medium text-sm md:text-base leading-tight" data-testid={`product-name-${product.id}`}>
                  {product.name}
                </h3>
                
                {/* Category */}
                <p className="text-gray-600 text-xs md:text-sm" data-testid={`product-description-${product.id}`}>
                  {product.description}
                </p>

                {/* Colors Count */}
                <p className="text-gray-600 text-xs md:text-sm" data-testid={`product-colors-${product.id}`}>
                  {product.colors} Colour{product.colors > 1 ? 's' : ''}
                </p>

                {/* Price */}
                <div className="pt-1 md:pt-2">
                  <span className="text-black font-medium text-sm md:text-base" data-testid={`product-price-${product.id}`}>
                    MRP : {product.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Don't Miss Section */}
        <div className="mt-12 md:mt-16">
          <h2 className="text-xl md:text-2xl font-medium text-black mb-6 md:mb-8">
            Don't Miss
          </h2>
          
          {/* Large Feature Product */}
          <div className="relative w-full h-64 md:h-[500px] mb-8 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="Athletic training gear"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 text-white">
              <h3 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4 leading-tight">
                TRAIN LIKE
                <br />
                A CHAMPION
              </h3>
              <button className="bg-white text-black px-4 py-2 md:px-6 md:py-3 font-medium hover:bg-gray-100 transition-colors text-sm md:text-base">
                Shop Training
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}