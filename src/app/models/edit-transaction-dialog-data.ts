export class EditTransactionDialogData {
  public id: number;
  public isNew: boolean;
  public isExpense: boolean;

  constructor(id: number, isNew: boolean, isExpense: boolean) {
    this.id = id;
    this.isNew = isNew;
    this.isExpense = isExpense;
  }
}
