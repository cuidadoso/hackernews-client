import { OrderedMap, Map } from 'immutable';

function timeDifference(current, previous) {
  const milliSecondsPerMinute = 60 * 1000;
  const milliSecondsPerHour = milliSecondsPerMinute * 60;
  const milliSecondsPerDay = milliSecondsPerHour * 24;
  const milliSecondsPerMonth = milliSecondsPerDay * 30;
  const milliSecondsPerYear = milliSecondsPerDay * 365;

  const elapsed = current - previous;

  if (elapsed < milliSecondsPerMinute / 3) {
    return 'just now';
  }

  if (elapsed < milliSecondsPerMinute) {
    return 'less than 1 min ago';
  } else if (elapsed < milliSecondsPerHour) {
    return Math.round(elapsed / milliSecondsPerMinute) + ' min ago';
  } else if (elapsed < milliSecondsPerDay) {
    return Math.round(elapsed / milliSecondsPerHour) + ' h ago';
  } else if (elapsed < milliSecondsPerMonth) {
    return Math.round(elapsed / milliSecondsPerDay) + ' days ago';
  } else if (elapsed < milliSecondsPerYear) {
    return Math.round(elapsed / milliSecondsPerMonth) + ' mo ago';
  } else {
    return Math.round(elapsed / milliSecondsPerYear) + ' years ago';
  }
}

export function timeDifferenceForDate(date) {
  const now = new Date().getTime();
  const updated = new Date(date).getTime();
  return timeDifference(now, updated);
}

export function generateId() {
  return Date.now();
}

export function fbDataToEntities(data, RecordModel = Map) {
  return new OrderedMap(data).mapEntries(([uid, value]) => [
    uid,
    new RecordModel(value).set('uid', uid)
  ]);
}

export function arrToMap(arr, DataRecord = Map) {
  return arr.reduce(
    (acc, item) => acc.set(item.id, new DataRecord(item)),
    new OrderedMap({})
  );
}

export function mapToArr(obj) {
  return obj.valueSeq().toArray();
}
