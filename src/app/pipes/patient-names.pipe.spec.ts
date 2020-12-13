import { PatientNamesPipe } from './patient-names.pipe';

describe('PatientNamesPipe', () => {
  it('create an instance', () => {
    const pipe = new PatientNamesPipe();
    expect(pipe).toBeTruthy();
  });
});
