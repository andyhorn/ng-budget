import { Occurrence } from './occurrence';

describe('Occurence', () => {
  it('should create an instance', () => {
    expect(new Occurrence(new Date(), [])).toBeTruthy();
  });
});
