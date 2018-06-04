'use strict'; // necessary for es6 output in node

import { browser, element, by, ElementFinder, ElementArrayFinder } from 'protractor';
import { promise } from 'selenium-webdriver';

const expectedH1 = 'Tour of Cryptos';
const expectedTitle = `${expectedH1}`;
const targetCrypto = { id: 15, name: 'Magneta' };
const targetCryptoDashboardIndex = 3;
const nameSuffix = 'X';
const newCryptoName = targetCrypto.name + nameSuffix;

class Crypto {
  id: number;
  name: string;

  // Factory methods

  // Crypto from string formatted as '<id> <name>'.
  static fromString(s: string): Crypto {
    return {
      id: +s.substr(0, s.indexOf(' ')),
      name: s.substr(s.indexOf(' ') + 1),
    };
  }

  // Crypto from crypto list <li> element.
  static async fromLi(li: ElementFinder): Promise<Crypto> {
      let stringsFromA = await li.all(by.css('a')).getText();
      let strings = stringsFromA[0].split(' ');
      return { id: +strings[0], name: strings[1] };
  }

  // Crypto id and name from the given detail element.
  static async fromDetail(detail: ElementFinder): Promise<Crypto> {
    // Get crypto id from the first <div>
    let _id = await detail.all(by.css('div')).first().getText();
    // Get name from the h2
    let _name = await detail.element(by.css('h2')).getText();
    return {
        id: +_id.substr(_id.indexOf(' ') + 1),
        name: _name.substr(0, _name.lastIndexOf(' '))
    };
  }
}

describe('Tutorial part 6', () => {

  beforeAll(() => browser.get(''));

  function getPageElts() {
    let navElts = element.all(by.css('app-root nav a'));

    return {
      navElts: navElts,

      appDashboardHref: navElts.get(0),
      appDashboard: element(by.css('app-root app-dashboard')),
      topCryptos: element.all(by.css('app-root app-dashboard > div h4')),

      appCryptosHref: navElts.get(1),
      appCryptos: element(by.css('app-root app-cryptos')),
      allCryptos: element.all(by.css('app-root app-cryptos li')),
      selectedCryptoSubview: element(by.css('app-root app-cryptos > div:last-child')),

      cryptoDetail: element(by.css('app-root app-crypto-detail > div')),

      searchBox: element(by.css('#search-box')),
      searchResults: element.all(by.css('.search-result li'))
    };
  }

  describe('Initial page', () => {

    it(`has title '${expectedTitle}'`, () => {
      expect(browser.getTitle()).toEqual(expectedTitle);
    });

    it(`has h1 '${expectedH1}'`, () => {
        expectHeading(1, expectedH1);
    });

    const expectedViewNames = ['Dashboard', 'Cryptos'];
    it(`has views ${expectedViewNames}`, () => {
      let viewNames = getPageElts().navElts.map((el: ElementFinder) => el.getText());
      expect(viewNames).toEqual(expectedViewNames);
    });

    it('has dashboard as the active view', () => {
      let page = getPageElts();
      expect(page.appDashboard.isPresent()).toBeTruthy();
    });

  });

  describe('Dashboard tests', () => {

    beforeAll(() => browser.get(''));

    it('has top cryptos', () => {
      let page = getPageElts();
      expect(page.topCryptos.count()).toEqual(4);
    });

    it(`selects and routes to ${targetCrypto.name} details`, dashboardSelectTargetCrypto);

    it(`updates crypto name (${newCryptoName}) in details view`, updateCryptoNameInDetailView);

    it(`cancels and shows ${targetCrypto.name} in Dashboard`, () => {
      element(by.buttonText('go back')).click();
      browser.waitForAngular();

      let targetCryptoElt = getPageElts().topCryptos.get(targetCryptoDashboardIndex);
      expect(targetCryptoElt.getText()).toEqual(targetCrypto.name);
    });

    it(`selects and routes to ${targetCrypto.name} details`, dashboardSelectTargetCrypto);

    it(`updates crypto name (${newCryptoName}) in details view`, updateCryptoNameInDetailView);

    it(`saves and shows ${newCryptoName} in Dashboard`, () => {
      element(by.buttonText('save')).click();
      browser.waitForAngular();

      let targetCryptoElt = getPageElts().topCryptos.get(targetCryptoDashboardIndex);
      expect(targetCryptoElt.getText()).toEqual(newCryptoName);
    });

  });

  describe('Cryptos tests', () => {

    beforeAll(() => browser.get(''));

    it('can switch to Cryptos view', () => {
      getPageElts().appCryptosHref.click();
      let page = getPageElts();
      expect(page.appCryptos.isPresent()).toBeTruthy();
      expect(page.allCryptos.count()).toEqual(10, 'number of cryptos');
    });

    it('can route to crypto details', async () => {
      getCryptoLiEltById(targetCrypto.id).click();

      let page = getPageElts();
      expect(page.cryptoDetail.isPresent()).toBeTruthy('shows crypto detail');
      let crypto = await Crypto.fromDetail(page.cryptoDetail);
      expect(crypto.id).toEqual(targetCrypto.id);
      expect(crypto.name).toEqual(targetCrypto.name.toUpperCase());
    });

    it(`updates crypto name (${newCryptoName}) in details view`, updateCryptoNameInDetailView);

    it(`shows ${newCryptoName} in Cryptos list`, () => {
      element(by.buttonText('save')).click();
      browser.waitForAngular();
      let expectedText = `${targetCrypto.id} ${newCryptoName}`;
      expect(getCryptoAEltById(targetCrypto.id).getText()).toEqual(expectedText);
    });

    it(`deletes ${newCryptoName} from Cryptos list`, async () => {
      const cryptosBefore = await toCryptoArray(getPageElts().allCryptos);
      const li = getCryptoLiEltById(targetCrypto.id);
      li.element(by.buttonText('x')).click();

      const page = getPageElts();
      expect(page.appCryptos.isPresent()).toBeTruthy();
      expect(page.allCryptos.count()).toEqual(9, 'number of cryptos');
      const cryptosAfter = await toCryptoArray(page.allCryptos);
      // console.log(await Crypto.fromLi(page.allCryptos[0]));
      const expectedCryptos =  cryptosBefore.filter(h => h.name !== newCryptoName);
      expect(cryptosAfter).toEqual(expectedCryptos);
      // expect(page.selectedCryptoSubview.isPresent()).toBeFalsy();
    });

    it(`adds back ${targetCrypto.name}`, async () => {
      const newCryptoName = 'Alice';
      const cryptosBefore = await toCryptoArray(getPageElts().allCryptos);
      const numCryptos = cryptosBefore.length;

      element(by.css('input')).sendKeys(newCryptoName);
      element(by.buttonText('add')).click();

      let page = getPageElts();
      let cryptosAfter = await toCryptoArray(page.allCryptos);
      expect(cryptosAfter.length).toEqual(numCryptos + 1, 'number of cryptos');

      expect(cryptosAfter.slice(0, numCryptos)).toEqual(cryptosBefore, 'Old cryptos are still there');

      const maxId = cryptosBefore[cryptosBefore.length - 1].id;
      expect(cryptosAfter[numCryptos]).toEqual({id: maxId + 1, name: newCryptoName});
    });

    it('displays correctly styled buttons', async () => {
      element.all(by.buttonText('x')).then(buttons => {
        for (const button of buttons) {
          // Inherited styles from styles.css
          expect(button.getCssValue('font-family')).toBe('Arial');
          expect(button.getCssValue('border')).toContain('none');
          expect(button.getCssValue('padding')).toBe('5px 10px');
          expect(button.getCssValue('border-radius')).toBe('4px');
          // Styles defined in cryptos.component.css
          expect(button.getCssValue('left')).toBe('194px');
          expect(button.getCssValue('top')).toBe('-32px');
        }
      });

      const addButton = element(by.buttonText('add'));
      // Inherited styles from styles.css
      expect(addButton.getCssValue('font-family')).toBe('Arial');
      expect(addButton.getCssValue('border')).toContain('none');
      expect(addButton.getCssValue('padding')).toBe('5px 10px');
      expect(addButton.getCssValue('border-radius')).toBe('4px');
    });

  });

  describe('Progressive crypto search', () => {

    beforeAll(() => browser.get(''));

    it(`searches for 'Ma'`, async () => {
      getPageElts().searchBox.sendKeys('Ma');
      browser.sleep(1000);

      expect(getPageElts().searchResults.count()).toBe(4);
    });

    it(`continues search with 'g'`, async () => {
      getPageElts().searchBox.sendKeys('g');
      browser.sleep(1000);
      expect(getPageElts().searchResults.count()).toBe(2);
    });

    it(`continues search with 'e' and gets ${targetCrypto.name}`, async () => {
      getPageElts().searchBox.sendKeys('n');
      browser.sleep(1000);
      let page = getPageElts();
      expect(page.searchResults.count()).toBe(1);
      let crypto = page.searchResults.get(0);
      expect(crypto.getText()).toEqual(targetCrypto.name);
    });

    it(`navigates to ${targetCrypto.name} details view`, async () => {
      let crypto = getPageElts().searchResults.get(0);
      expect(crypto.getText()).toEqual(targetCrypto.name);
      crypto.click();

      let page = getPageElts();
      expect(page.cryptoDetail.isPresent()).toBeTruthy('shows crypto detail');
      let crypto2 = await Crypto.fromDetail(page.cryptoDetail);
      expect(crypto2.id).toEqual(targetCrypto.id);
      expect(crypto2.name).toEqual(targetCrypto.name.toUpperCase());
    });
  });

  async function dashboardSelectTargetCrypto() {
    let targetCryptoElt = getPageElts().topCryptos.get(targetCryptoDashboardIndex);
    expect(targetCryptoElt.getText()).toEqual(targetCrypto.name);
    targetCryptoElt.click();
    browser.waitForAngular();

    let page = getPageElts();
    expect(page.cryptoDetail.isPresent()).toBeTruthy('shows crypto detail');
    let crypto = await Crypto.fromDetail(page.cryptoDetail);
    expect(crypto.id).toEqual(targetCrypto.id);
    expect(crypto.name).toEqual(targetCrypto.name.toUpperCase());
  }

  async function updateCryptoNameInDetailView() {
    // Assumes that the current view is the crypto details view.
    addToCryptoName(nameSuffix);

    let page = getPageElts();
    let crypto = await Crypto.fromDetail(page.cryptoDetail);
    expect(crypto.id).toEqual(targetCrypto.id);
    expect(crypto.name).toEqual(newCryptoName.toUpperCase());
  }

});

function addToCryptoName(text: string): promise.Promise<void> {
  let input = element(by.css('input'));
  return input.sendKeys(text);
}

function expectHeading(hLevel: number, expectedText: string): void {
    let hTag = `h${hLevel}`;
    let hText = element(by.css(hTag)).getText();
    expect(hText).toEqual(expectedText, hTag);
};

function getCryptoAEltById(id: number): ElementFinder {
  let spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('..'));
}

function getCryptoLiEltById(id: number): ElementFinder {
  let spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('../..'));
}

async function toCryptoArray(allCryptos: ElementArrayFinder): Promise<Crypto[]> {
  let promisedCryptos = await allCryptos.map(Crypto.fromLi);
  // The cast is necessary to get around issuing with the signature of Promise.all()
  return <Promise<any>> Promise.all(promisedCryptos);
}
