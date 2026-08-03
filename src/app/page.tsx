"use client";

import Link from "next/link";
import Image from "next/image";
import { useProperties } from "@/hooks/useProperties";
import { PropertyCard } from "@/components/PropertyCard";
import { Skeleton } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { 
  Search, 
  ArrowRight, 
  Home, 
  Building, 
  Shield, 
  Clock,
  MapPin,
  Receipt,
  TreePine,
  ParkingCircle,
  Phone,
  Mail,
  Download,
  Check
} from "lucide-react";

export default function HomePage() {
  const { data, isLoading, isError } = useProperties({ limit: 6 });

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[90vh] flex items-center bg-cover bg-center bg-no-repeat" 
        style={{ 
          backgroundImage: 'url(/images/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 w-full">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              <span className="block">Find Your Dream</span>
              <span className="block text-brand-400">Rental Property</span>
            </h1>
            <p className="mt-6 text-lg text-white/80 sm:text-xl max-w-2xl">
              Browse verified listings, submit rental requests, and pay securely 
              all in one intelligent platform designed for modern living.
            </p>
            
            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row">
              <Link href="/properties">
                <Button size="lg" className="group bg-brand-600 hover:bg-brand-700 text-white">
                  <Search className="mr-2 h-5 w-5" />
                  Explore Properties
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { icon: Building, label: "500+", sub: "Active Listings" },
                { icon: Shield, label: "99.9%", sub: "Verified Properties" },
                { icon: Clock, label: "24/7", sub: "Customer Support" },
                { icon: Search, label: "4.9★", sub: "Average Rating" },
              ].map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center text-white">
                  <stat.icon className="h-6 w-6 text-brand-400" />
                  <span className="mt-2 text-lg font-bold">{stat.label}</span>
                  <span className="text-sm text-white/70">{stat.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Us</h2>
            <p className="mt-2 text-gray-600">Everything you need for a perfect rental experience</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: MapPin,
                title: "Excellent Location",
                desc: "Find properties in prime locations with easy access to amenities and transportation."
              },
              {
                icon: Receipt,
                title: "Best Prices",
                desc: "Get the best value for your money with transparent pricing and no hidden fees."
              },
              {
                icon: TreePine,
                title: "Green Neighborhood",
                desc: "Enjoy living in environmentally friendly communities with parks and green spaces."
              },
              {
                icon: ParkingCircle,
                title: "Parking Available",
                desc: "Convenient parking options included with most properties for your peace of mind."
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Properties
            </h2>
            <p className="mt-2 text-gray-600">
              Handpicked listings just for you
            </p>
          </div>
          
          <Link href="/properties">
            <Button variant="ghost" className="group">
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl bg-white shadow-sm">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="mb-2 h-4 w-3/4" />
                  <Skeleton className="mb-2 h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center backdrop-blur-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-sm font-medium text-red-800">
              Couldn&apos;t load properties right now
            </p>
            <p className="mt-1 text-sm text-red-600">
              Please try again shortly or refresh the page.
            </p>
            <Button 
              variant="outline" 
              className="mt-4 border-red-300 text-red-700 hover:bg-red-100"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </div>
        )}

        {/* Empty State */}
        {data && data.properties.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Home className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No properties available</h3>
            <p className="mt-1 text-gray-600">Check back soon for new listings</p>
          </div>
        )}

        {/* Properties Grid */}
        {data && data.properties.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.properties.map((property) => (
              <div key={property.id} className="group transition-all duration-300 hover:-translate-y-1">
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-brand-600 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold mb-4">Interested in Renting?</h2>
              <p className="text-white/80 mb-6">
                Schedule a visit to your dream property today. Our team will help you 
                find the perfect home that matches your needs and budget.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-brand-300" />
                  <span>+8801779-933459</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-brand-300" />
                  <span>info@rentnest.com</span>
                </div>
              </div>
            </div>
            <div>
              <form className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input 
                    type="text" 
                    placeholder="Name*" 
                    className="px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                  <input 
                    type="email" 
                    placeholder="Email*" 
                    className="px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone" 
                    className="px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="broker" defaultChecked className="accent-brand-400" />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="broker" className="accent-brand-400" />
                      <span>No</span>
                    </label>
                    <span className="text-sm text-white/60">Are you a broker?</span>
                  </div>
                  <textarea 
                    placeholder="Message" 
                    rows={2}
                    className="sm:col-span-2 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-400"
                  ></textarea>
                  <Button className="sm:col-span-2 bg-white text-brand-600 hover:bg-white/90">
                    Send Inquiry
                  </Button>
                </div>
                <p className="mt-2 text-xs text-white/60">Fields marked with * are required.</p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}