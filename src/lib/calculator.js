/** @param {string|number} input */
function count(input) {
  const text = String(input);
  if (!/^\d+$/.test(text) || Number(text) > 1_000_000_000) throw new Error('count');
  return BigInt(text);
}

/** Parse a decimal without floating point. @param {string|number} input */
function money(input) {
  const text = String(input);
  if (!/^\d{1,7}(\.\d{1,4})?$/.test(text)) throw new Error('money');
  const [whole, fraction = ''] = text.split('.');
  return BigInt(whole) * 10000n + BigInt(fraction.padEnd(4, '0'));
}

/** @typedef {{mode:'landing'|'direct',visitors:string|number,accounts:string|number,intent:string|number,engaged:string|number,reengaged:string|number,monthly:string, includedAccounts:string|number,extraAccount:string,uvCredit:string,eventCredit:string,visitorRate:string,intentRate:string,engagedRate:string,reengagedRate:string}} EstimateInput */
/** @param {EstimateInput} input */
export function estimate(input) {
  if (!['landing', 'direct'].includes(input.mode)) throw new Error('mode');
  const accounts = count(input.accounts), intent = count(input.intent), engaged = count(input.engaged);
  if (engaged > intent) throw new Error('funnel');
  const positive = (/** @type {bigint} */ n) => n > 0n ? n : 0n;
  const cents = (/** @type {bigint} */ n) => Number((n + 50n) / 100n);
  const monthly = cents(money(input.monthly));
  const account = cents(positive(accounts - count(input.includedAccounts)) * money(input.extraAccount));
  const visitorRate = input.mode === 'direct' ? 0n : money(input.visitorRate);
  const visitor = input.mode === 'direct' ? 0 : cents(positive(count(input.visitors) * visitorRate - money(input.uvCredit)));
  // 落地页事件扣除对应 UV 单价；同一联系人只按最深阶段收费，重新互动另计。
  const event = cents(positive((intent - engaged) * positive(money(input.intentRate) - visitorRate) + engaged * positive(money(input.engagedRate) - visitorRate) + count(input.reengaged) * money(input.reengagedRate) - money(input.eventCredit)));
  const total = monthly + account + visitor + event;
  if (![monthly, account, visitor, event, total].every(Number.isSafeInteger)) throw new Error('overflow');
  return { monthly, account, visitor, event, total };
}
