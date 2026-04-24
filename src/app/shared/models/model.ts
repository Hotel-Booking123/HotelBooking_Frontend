export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: Date;
}

export interface Hotel {
  id: number;
  name: string;
  location: string;
  description: string;
  amenities: string;
  averageRating: number;
}

export interface Room {
  id: number;
  roomNumber: string;
  type: string;
  pricePerNight: number;
  maxOccupancy: number;
  hotelId: number;
  hotel?: Hotel;
}

export interface Booking {
  id: number;
  bookingReference: string;
  hotelName: string;
  roomNumber: string;
  roomType: string;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: number;
  status: string;
  bookingDate: Date;
  discountCode?: string;
  // User info
  userName?: string;      // ✅ Add this
  userEmail?: string;     // ✅ Add this
  // Optional nested objects
  userId?: number;
  roomId?: number;
  room?: Room;
  user?: User;
}

export interface Promotion {
  id: number;
  code: string;
  discountType: string;
  discountValue: number;
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  fullName: string;
}