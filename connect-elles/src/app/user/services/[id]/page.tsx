"use client";
import React from "react";
import { useParams } from "next/navigation";
import ServiceDetail from "@/components/ServiceDetail";

const ServiceDetailPage = () => {
  const params = useParams();
  const serviceId = params.id as string;

  return <ServiceDetail serviceId={serviceId} />;
};

export default ServiceDetailPage;
