require('dotenv').config({ path: '../.env' });
const puppeteer = require('puppeteer');

const facilityOneScrape = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  if (process.env.FACILITY_1_URL === undefined) {
    throw Error('Env variable is undefined');
  }
  await page.goto(process.env.FACILITY_1_URL);

  let data = await page.evaluate(() => {
    let items = Array.from(document.querySelectorAll('.unit-item'));
    const results = items.map((item) => {
      return {
        dimensions: item
          .querySelector('.card-unit-size-title')
          ?.textContent?.match(/[+-]?([0-9]*[.])?[0-9]+/g),
        start_price: item
          .querySelector('del')
          ?.textContent?.replace(/,|\$/g, ''),
        price: item
          .querySelector('.price-bold')
          ?.textContent?.replace(/,|\$/g, ''),
        climate: item
          .querySelector('.card-text')
          ?.firstChild?.textContent?.trim()
          .split(', ')
          .includes('Climate Controlled'),
        description: item
          .querySelector('.card-text')
          ?.firstChild?.textContent?.trim()
          .split(', '),
        promotion: item.querySelector('.card-text-promo')?.textContent?.trim(),
        amount_left: item
          .querySelector('.card-text-promo')
          ?.textContent?.trim(),
        size: item.getAttribute('data-size'),
        type:
          item.getAttribute('data-size') === 'parking'
            ? 'parking'
            : 'self-storage',
      };
    });

    return results;
  });

  console.log(data);
  await browser.close();
  return data;
};

module.exports = facilityOneScrape;
export {};
