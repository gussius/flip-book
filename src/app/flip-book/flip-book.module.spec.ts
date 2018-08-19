import { FlipBookModule } from './flip-book.module';

describe('FlipBookModule', () => {
  let flipBookModule: FlipBookModule;

  beforeEach(() => {
    flipBookModule = new FlipBookModule();
  });

  it('should create an instance', () => {
    expect(flipBookModule).toBeTruthy();
  });
});
