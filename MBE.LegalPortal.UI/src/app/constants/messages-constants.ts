export const CreateSuccessfully: string = 'A New {entity} has created successfully';
export const CreateFailed: string = 'An error occurred while creating the {entity}.';
export const UpdateSuccessfully: string = 'The {entity} has updated successfully';
export const UpdateFailed: string = 'An error occurred while updating the {entity}.';
export const DeleteSuccessfully: string = 'The {entity} has deleted successfully';
export const DeleteFailed: string = 'An error occurred while deleting the {entity}.';

export const ConflictMessage: string = 'This {entity} has already existed.';

export function GetCreateSuccessfullyMessage(entity: string): string {
  return CreateSuccessfully.replace('{entity}', entity);
}

export function GetCreateFailedMessage(entity: string): string {
  return CreateFailed.replace('{entity}', entity);
}

export function GetUpdateSuccessfullyMessage(entity: string): string {
  return UpdateSuccessfully.replace('{entity}', entity);
}

export function GetUpdateFailedMessage(entity: string): string {
  return UpdateFailed.replace('{entity}', entity);
}

export function GetDeleteSuccessfullyMessage(entity: string): string {
  return DeleteSuccessfully.replace('{entity}', entity);
}

export function GetDeleteFailedMessage(entity: string): string {
  return DeleteFailed.replace('{entity}', entity);
}

export function GetConflictMessage(entity: string): string {
  return ConflictMessage.replace('{entity}', entity);
}
