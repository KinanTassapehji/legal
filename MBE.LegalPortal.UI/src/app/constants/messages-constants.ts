export const CreateSuccessfully: string = 'A New {entity} has created successfully';
export const UpdateSuccessfully: string = 'The {entity} has updated successfully';
export const DeleteSuccessfully: string = 'The {entity} has deleted successfully';
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
