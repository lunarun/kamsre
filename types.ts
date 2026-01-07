
export enum ServiceType {
  FOOD_DELIVERY = 'Food Delivery',
  HOUSE_CLEANING = 'House Cleaning',
  SHOPPING = 'Grocery Shopping',
  CLINIC_ESCORT = 'Clinic Escort'
}

export enum ServiceStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  DELETED = 'Deleted',
  DB_ERROR = 'DB_ERROR'
}

export interface Service {
  id: string;
  type: ServiceType;
  title: string;
  description: string;
  price: number;
  image: string;
  status: ServiceStatus;
}

export enum BookingStatus {
  PENDING = 'Pending',
  ASSIGNED = 'Assigned',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  PAYMENT_FAILED = 'Payment Failed'
}

export interface Booking {
  id: string;
  serviceId: string;
  userId: string;
  workerId?: string;
  status: BookingStatus;
  date: string;
  time: string;
  fullName: string;
  phone: string;
  address: string;
  totalPrice: number;
  trackingLocation?: { lat: number; lng: number };
}

export interface Worker {
  id: string;
  name: string;
  rating: number;
  status: 'available' | 'busy' | 'offline';
  photo: string;
}

export enum TabType {
  HOME = 'home',
  ORDERS = 'orders',
  WORKER = 'worker',
  PROFILE = 'profile'
}
