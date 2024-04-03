import { IApplicationInstance } from "./application-instance";

export interface IApplicationDetails {
  id: number,
  name: string,
  image: string,
  applicationInstances: IApplicationInstance[]
}
