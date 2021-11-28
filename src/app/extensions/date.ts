declare global {
  interface Date {
    isSameDate(otherDate: Date): boolean;
  }
}

Date.prototype.isSameDate = function(otherDate: Date): boolean {
  return this.getFullYear() === otherDate.getFullYear() &&
    this.getMonth() === otherDate.getMonth() &&
    this.getDate() === otherDate.getDate();
}

export {}
