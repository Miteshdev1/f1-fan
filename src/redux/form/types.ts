export interface Driver {
  driverId?: string;
  permanentNumber?: string;
  code?: string;
  url?: string;
  givenName?: string;
  familyName?: string;
  dateOfBirth?: string;
  nationality?: string;
}

export interface DriverStanding {
  position: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructors: [
    {
      constructorId: string;
      name: string;
      nationality: string;
    }
  ];
}
export interface FormState {
  step: number;
  userDetails: { name: string; email: string; selectedDriver: Driver | null };
  driversList: Driver[] | [];
  driverStandings: DriverStanding[] | null;
  loading: boolean;
  error: string | null;
  validationError: validationErrorObject;
}
export interface validationErrorObject {
  [key: string]: string | undefined;
  name?: string;
  email?: string;
  selectDriver?: string;
}
export interface ErrorResponse {
  response: {
    data: {
      detail: string;
    };
  };
}
