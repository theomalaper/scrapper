const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://www.zocdoc.com/search?address=New%20York%2C%20NY&insurance_carrier=&day_filter=AnyDay&filters=%7B%7D&gender=-1&language=-1&offset=0&insurance_plan=-1&reason_visit=75&sees_children=false&after_5pm=false&before_10am=false&sort_type=Default&dr_specialty=153&ip=64.18.150.214');
  await page.screenshot({path: './test.png'});

  const pages = await page.evaluate(() => { 
    return Array.from(document.querySelectorAll('[data-test="search-results-pagination-control"]')).map(link => link.href)
  })

  console.log(pages)

  const data = await page.evaluate(() => {
    return Array
      .from(document.querySelectorAll('[data-test="search-result-item"]'))
      .map(doctor => {
        return { 
          firstName: doctor.querySelector('[itemprop="name"]').firstChild.data,
          lastName: doctor.querySelector('[itemprop="name"]').lastChild.data,
          jobTitle: doctor.querySelector('[itemprop="jobTitle"]').textContent,
          location: doctor.querySelector('[itemprop="workLocation"]').textContent
        }
      })
  });

  const overallData = {...data};

  // await pages.forEach(page => {
  //   if (pageNumber.indexOf(page) !== pageNumber.length - 1) {
  //     page.click(`[data-pagination-control-target-index="${pageNumber.indexOf(page) + 1}"]`)
  //   }
  // })
  
  console.log(overallData);

  await browser.close();
})();