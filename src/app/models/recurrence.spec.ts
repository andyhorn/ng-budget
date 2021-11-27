import { Recurrence } from './recurrence';

describe('Recurrence', () => {
  it('should create an instance', () => {
    expect(new Recurrence()).toBeTruthy();
  });

  it('should default to today\'s date', () => {
    const today = new Date();
    const recurrence = new Recurrence();

    expect(recurrence.startDate.getFullYear()).toEqual(today.getFullYear());
    expect(recurrence.startDate.getMonth()).toEqual(today.getMonth());
    expect(recurrence.startDate.getDate()).toEqual(today.getDate());
  });

  it('should zero out the time values on default date', () => {
    const recurrence = new Recurrence();

    expect(recurrence.startDate.getHours()).toEqual(0);
    expect(recurrence.startDate.getMinutes()).toEqual(0);
    expect(recurrence.startDate.getSeconds()).toEqual(0);
    expect(recurrence.startDate.getMilliseconds()).toEqual(0);
  });

  it('should zero the time values when setting a new date', () => {
    const recurrence = new Recurrence();
    recurrence.startDate = new Date();

    expect(recurrence.startDate.getHours()).toEqual(0);
    expect(recurrence.startDate.getMinutes()).toEqual(0);
    expect(recurrence.startDate.getSeconds()).toEqual(0);
    expect(recurrence.startDate.getMilliseconds()).toEqual(0);
  });

  it('should throw an error for invalid interval values', () => {
    const recurrence = new Recurrence();

    expect(() => recurrence.interval = 0).toThrow();
    expect(() => recurrence.interval = -1).toThrow();
    expect(() => recurrence.interval = 1).not.toThrowError();
  });
});
