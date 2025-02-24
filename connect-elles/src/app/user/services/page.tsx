"use client";
import React, { useState, useEffect } from "react";
import { ArrowRight, Clock, Tag, Users, Calendar, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Service } from "@/app/utils/interface";

const ServiceList = () => {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const fetchServices = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/services", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/categories", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    Promise.all([fetchCategories(), fetchServices()]);
  }, []);
  const filteredServices = services.filter((service) => {
    const searchMatch = service.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const categoryMatch =
      selectedCategory === "" || service.category?._id === selectedCategory;
    const priceMatch =
      (!minPrice || service.price >= parseFloat(minPrice)) &&
      (!maxPrice || service.price <= parseFloat(maxPrice));
    return searchMatch && categoryMatch && priceMatch;
  });
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
            Our Services
          </span>
          <h1 className="text-4xl font-bold text-slate-800">
            Available Services
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Explore our range of professional services designed to meet your
            needs
          </p>
          <div className="max-w-3xl mx-auto mt-8 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-emerald-100 focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition-colors duration-200"
              />
            </div>

            <div className="relative w-full md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="custom-scroll w-full px-4 py-3 rounded-xl border border-emerald-100 focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition-colors duration-200 appearance-none bg-white overflow-y-auto"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.title}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Tag className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center mt-4">
            <div className="w-full md:w-48">
              <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-emerald-100 focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition-colors duration-200"
              />
            </div>
            <div className="w-full md:w-48">
              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-emerald-100 focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition-colors duration-200"
              />
            </div>
          </div>
        </div>

        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600">
              {searchTerm || selectedCategory || minPrice || maxPrice
                ? "No Services found matching your filters"
                : " No services available at the moment."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl shadow-emerald-100/50 hover:shadow-emerald-200/50 transition-all duration-300 border border-emerald-100 flex flex-col h-full"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      service.serviceImage
                        ? `http://localhost:4000${service.serviceImage}`
                        : "/api/placeholder/400/320"
                    }
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <span className="absolute top-4 right-4 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-emerald-600 text-sm font-medium shadow-lg">
                    {service.status}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-emerald-600 transition-colors">
                    {service.title}
                  </h3>

                  {service.category && (
                    <div className="flex items-center text-slate-500 text-sm mb-3">
                      <Tag className="w-4 h-4 mr-2" />
                      {service.category.title}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-slate-600">
                      <Clock className="w-4 h-4 mr-2 text-emerald-500" />
                      {service.duration} Days
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Users className="w-4 h-4 mr-2 text-emerald-500" />
                      {service.numberOfPlaces} Places
                    </div>
                  </div>

                  <div className="text-lg font-bold text-emerald-600 mb-4">
                    ${service.price}
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center text-slate-500 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(service.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <button
                    onClick={() => router.push(`/user/services/${service._id}`)}
                    className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transform hover:-translate-y-1 transition-all duration-300 mt-4 self-start"
                  >
                    More Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceList;
