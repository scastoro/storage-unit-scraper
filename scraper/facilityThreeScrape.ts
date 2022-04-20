import puppeteer from 'puppeteer';
import './config';

const facilityThreeScrape = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  if (process.env.FACILITY_3_URL === undefined) {
    throw Error('Env variable is undefined');
  }
  await page.goto(process.env.FACILITY_3_URL);

  let data = await page.evaluate(() => {
    let items = Array.from(document.querySelectorAll('div[itemprop="item"]'));

    const results = items.map((item) => {
      return {
        dimensions: {
          length: item
            .querySelector('.lvu-unit-size')
            ?.textContent?.match(/[+-]?([0-9]*[.])?[0-9]+/g)[0],
          width: item
            .querySelector('.lvu-unit-size')
            ?.textContent?.match(/[+-]?([0-9]*[.])?[0-9]+/g)[1],
        },
        start_price: item
          .querySelector('del')
          ?.textContent?.replace(/,|\$/g, ''),
        price: item
          .querySelector('p.unit-rate.price')
          ?.textContent?.replace(/,|\$/g, '')
          .trim(),
        climate: Array.from(
          item.querySelectorAll('ul.lvu-v3-amenities-descriptions li')
        )
          ?.map((listItem) => listItem.textContent?.trim())
          .includes('Climate Controlled'),
        description: Array.from(
          item.querySelectorAll('ul.lvu-v3-amenities-descriptions li')
        )?.map((listItem) => listItem.textContent?.trim()),
        amount_left: item.classList.contains('parking')
          ? document.querySelector('span.label')?.textContent?.trim()
          : item.querySelector('.lvu-v3-remainder span')?.textContent?.trim(),
        promotion: null,
        size: item.classList.contains('sm')
          ? 'small'
          : item.classList.contains('md')
          ? 'medium'
          : item.classList.contains('lg')
          ? 'large'
          : item.classList.contains('xl')
          ? 'extra large'
          : null,
        type: item.classList.contains('parking') ? 'parking' : 'self storage',
      };
    });

    return results;
  });

  console.log(data);
  await browser.close();
  return data;
};

export default facilityThreeScrape();
