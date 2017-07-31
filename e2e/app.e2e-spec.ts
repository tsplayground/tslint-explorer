import { TslintPage } from './app.po';

describe('tslint App', () => {
  let page: TslintPage;

  beforeEach(() => {
    page = new TslintPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
