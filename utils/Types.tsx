export type PhotoData = {
  url: string;
  name: string;
};

export type ShopData = {
  id: number;
  title: string;
  description: string;
  contactInformation: string;
  email: string;
  location: string;
  openingHour: string;
  closingHour: string;
  photo: string;
  searchs: number;
  clicks: number;
  cloudPanoSceneID: string;
};

export type ServiceData = {
  id: number;
  title: string;
  description: string;
  contactInformation: string;
  email: string;
  location: string;
  openingHour: string;
  closingHour: string;
  photo: string;
  searchs: number;
  clicks: number;
  cloudPanoSceneID: string;
};

export type DineData = {
  id: number;
  title: string;
  description: string;
  contactInformation: string;
  email: string;
  location: string;
  openingHour: string;
  closingHour: string;
  photo: string;
  searchs: number;
  clicks: number;
  cloudPanoSceneID: string;
};

export type EventData = {
  id: number;
  title: string;
  description: string;
  location: string;
  contactInformation: string;
  email: string;
  startDate: number;
  endDate: number;
  photo: string;
  clicks: number;
  featured: boolean;
  guests: GuestData[];
};

export type GuestData = {
  name: string;
  photo: string;
};

export type PromoData = {
  id: number;
  title: string;
  description: string;
  location: string;
  contactInformation: string;
  email: string;
  startDate: number;
  endDate: number;
  photo: string;
  clicks: number;
  featured: boolean;
};

export type AboitizPitchData = {
  id: number;
  title: string;
  description: string;
  photo: string;
  subData: AboitizPitchSubData[];
};

export type AboitizPitchSubData = {
  id: number;
  title: string;
  essay: string;
  photo: string;
};

export type MapData = {
  id: number;
  storeName: string;
  map2D: string;
  map360: string;
  mapRoute: string;
  clicks: number;
  searches: number;
  cloudPanoSceneID: string;
  logo?: string;
};

export type ActivityData = {
  id: number;
  title: string;
  photo: string;
  subData: ActivitySubData[];
};

export type ActivitySubData = {
  id: number;
  title: string;
  essay: string;
  photo: string;
};
