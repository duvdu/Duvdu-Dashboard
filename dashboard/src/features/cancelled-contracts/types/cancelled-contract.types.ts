export type CancelledContract = {
  _id: string;
  contract: {
    _id: string;
    customer: {
      _id: string;
      name: string;
      username: string;
      isOnline: boolean;
      profileImage: string;
      faceRecognition: string;
      email: string;
      phoneNumber: {
        number: string;
        key?: string | null;
      };
    };
    sp: {
      _id: string;
      name: string;
      username: string;
      isOnline: boolean;
      profileImage: string;
      faceRecognition: string;
      phoneNumber: {
        number: string;
        key?: string | null;
      };
    };
    contract: {
      _id: string;
      sp: string;
      customer: string;
      project: string;
      tools: any[];
      functions: any[];
      details: string;
      location: {
        lat: number;
        lng: number;
      };
      address: string;
      attachments: any[];
      projectScale: {
        unit: string;
        numberOfUnits: number;
        unitPrice: number;
      };
      appointmentDate: string;
      totalPrice: number;
      deadline: string;
      startDate: string;
      stageExpiration: number;
      firstPaymentAmount: number;
      secondPaymentAmount: number;
      status: string;
      rejectedBy: string | null;
      duration: number;
      equipmentPrice: number;
      submitFiles: any[];
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
    ref: string;
    cycle: string;
    hasReview: boolean;
  };
  cancelReason: string;
  user: {
    username: string;
    phoneNumber: {
      key?: string | null;
      number: string;
    };
    _id: string;
    profileImage: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
};
