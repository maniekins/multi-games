import pkg from '../package.json';
import 'jest-extended';

describe('test setup', () => {
  it('is defined correctly', () => {
    expect(pkg.name).toEqual('multi-games');
  });

  it('uses jest-extended toBeEmptyObject', () => {
    expect({}).toBeEmptyObject();
  });

  it('uses jest-extended toBeFunction', () => {
    expect(() => '').toBeFunction();
  });
});
