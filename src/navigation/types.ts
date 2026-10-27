export type RootStackParamList = {
  Home: undefined;
  SearchFields: undefined;
  FieldsList: {
    query: string;
    sport: string;
    area: string;
    maxPrice: number | null;
  };
  FieldDetails: {
    fieldId: string;
  };
  Booking: {
    fieldId: string;
  };
  BookingConfirmation: {
    bookingId: string;
  };
  MyBookings: undefined;
  Reviews: { fieldId?: string } | undefined;
  Profile: undefined;
};
