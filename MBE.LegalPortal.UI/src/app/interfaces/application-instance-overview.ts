export interface IApplicationInstanceOverview {
  id: number;
  name: string;
  application: {
    id: number;
    name: string;
  };
  account: {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
  };
  tenants: {
    id: number;
    name: string;
  }[];
};
