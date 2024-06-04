export const CreateSuccessfully: string = 'A New {entity} has Created Successfully';
export const UpdateSuccessfully: string = 'The {entity} has Updated Successfully';
export const DeleteSuccessfully: string = 'The {entity} has Deleted Successfully';
export const DeleteFailed: string = 'An error occurred while deleting the {entity}.';

export function GetCreateSuccessfullyMessage(entity: string): string {
  return CreateSuccessfully.replace('{entity}', entity);
}

export function GetUpdateSuccessfullyMessage(entity: string): string {
  return UpdateSuccessfully.replace('{entity}', entity);
}

export function GetDeleteSuccessfullyMessage(entity: string): string {
  return DeleteSuccessfully.replace('{entity}', entity);
}

export function GetDeleteFailedMessage(entity: string): string {
  return DeleteSuccessfully.replace('{entity}', entity);
}
