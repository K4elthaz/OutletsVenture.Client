import { useState, useEffect } from "react";
import { DineData, ServiceData, ShopData } from "@/utils/Types";

export const useDineSuggestions = (
  dineData: DineData[],
  searchTerm: string
) => {
  const [suggestions, setSuggestions] = useState<DineData[]>([]);
  useEffect(() => {
    const filteredData = dineData
      .filter((dine) => {
        const lowerTerm = searchTerm.toLowerCase();
        return (
          dine.title.toLowerCase().includes(lowerTerm) ||
          dine.description.toLowerCase().includes(lowerTerm) ||
          dine.location.toLowerCase().includes(lowerTerm)
        );
      })
      .sort((a, b) => {
        // Sort by a combination of relevance and popularity
        const relevanceA =
          (a.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 2 : 0) +
          (a.description.toLowerCase().includes(searchTerm.toLowerCase())
            ? 1
            : 0);
        const relevanceB =
          (b.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 2 : 0) +
          (b.description.toLowerCase().includes(searchTerm.toLowerCase())
            ? 1
            : 0);

        // Sort by relevance first, then popularity
        if (relevanceA !== relevanceB) return relevanceB - relevanceA;
        return b.searchs + b.clicks - (a.searchs + a.clicks);
      });

    setSuggestions(filteredData.slice(0, 10)); // Return top 10 suggestions
  }, [dineData, searchTerm]);

  return suggestions;
};

export const useServiceData = (
  serviceData: ServiceData[],
  searchTerm: string
) => {
  const [suggestions, setSuggestions] = useState<DineData[]>([]);

  useEffect(() => {
    const filteredData = serviceData
      .filter((dine) => {
        const lowerTerm = searchTerm.toLowerCase();
        return (
          dine.title.toLowerCase().includes(lowerTerm) ||
          dine.description.toLowerCase().includes(lowerTerm) ||
          dine.location.toLowerCase().includes(lowerTerm)
        );
      })
      .sort((a, b) => {
        // Sort by a combination of relevance and popularity
        const relevanceA =
          (a.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 2 : 0) +
          (a.description.toLowerCase().includes(searchTerm.toLowerCase())
            ? 1
            : 0);
        const relevanceB =
          (b.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 2 : 0) +
          (b.description.toLowerCase().includes(searchTerm.toLowerCase())
            ? 1
            : 0);

        // Sort by relevance first, then popularity
        if (relevanceA !== relevanceB) return relevanceB - relevanceA;
        return b.searchs + b.clicks - (a.searchs + a.clicks);
      });

    setSuggestions(filteredData.slice(0, 10)); // Return top 10 suggestions
  }, [serviceData, searchTerm]);

  return suggestions;
};

export const useShopData = (shopData: ShopData[], searchTerm: string) => {
  const [suggestions, setSuggestions] = useState<DineData[]>([]);

  useEffect(() => {
    const filteredData = shopData
      .filter((dine) => {
        const lowerTerm = searchTerm.toLowerCase();
        return (
          dine.title.toLowerCase().includes(lowerTerm) ||
          dine.description.toLowerCase().includes(lowerTerm) ||
          dine.location.toLowerCase().includes(lowerTerm)
        );
      })
      .sort((a, b) => {
        // Sort by a combination of relevance and popularity
        const relevanceA =
          (a.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 2 : 0) +
          (a.description.toLowerCase().includes(searchTerm.toLowerCase())
            ? 1
            : 0);
        const relevanceB =
          (b.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 2 : 0) +
          (b.description.toLowerCase().includes(searchTerm.toLowerCase())
            ? 1
            : 0);

        // Sort by relevance first, then popularity
        if (relevanceA !== relevanceB) return relevanceB - relevanceA;
        return b.searchs + b.clicks - (a.searchs + a.clicks);
      });

    setSuggestions(filteredData.slice(0, 10)); // Return top 10 suggestions
  }, [shopData, searchTerm]);

  return suggestions;
};
