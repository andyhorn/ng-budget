export class EditTransactionDialogData {
  id: number;
  isNew: boolean;
  isExpense: boolean;

  constructor(id: number, isNew: boolean, isExpense: boolean) {
    this.id = id;
    this.isNew = isNew;
    this.isExpense = isExpense;
  }
}
