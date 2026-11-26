const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
  for (const v of (process.argv[2]||'court,entrance,aerial').split(',')) {
    const p = await b.newPage({ viewport:{width:1280,height:800}, deviceScaleFactor: Number(process.env.DSF||1) });
    const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>m.type()==='error'&&errs.push(m.text().slice(0,200)));
    await p.goto(`http://localhost:3040/${process.env.PAGE||""}?v=${v}`);
    try { await p.waitForFunction(()=>document.body.dataset.ready==='1',{timeout:240000}); } catch(e){ errs.push('timeout') }
    await p.screenshot({timeout:180000, path:`${process.env.OUT}/${process.env.PREFIX||"r"}-${v.replace(/[&=]/g,"_")}.png`});
    console.log(v, errs.slice(0,4));
    await p.close();
  }
  await b.close();
})();
