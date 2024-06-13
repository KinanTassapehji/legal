export interface IApplicationConstraint {
  id?: number,
  key: string,
  label: string,
  value?: number,
  defaultAction: string,
  enabled?: boolean,
  unlimited?: boolean
}
