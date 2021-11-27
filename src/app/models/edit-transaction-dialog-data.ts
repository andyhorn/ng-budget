import { TransactionTypes } from "./transaction";

export class EditTransactionDialogData {
  public id: number;
  public dialogType: EditTransactionDialogTypes;
  public type: TransactionTypes;

  constructor(id: number, dialogType: EditTransactionDialogTypes, type: TransactionTypes) {
    this.id = id;
    this.dialogType = dialogType;
    this.type = type;
  }
}

export enum EditTransactionDialogTypes {
  New,
  Edit,
};
