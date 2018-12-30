const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  return [year, month, day].map(formatNumber).join('.')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getNumberSuffix(num) {
  if (num == null)
    return ""

  var remainder = num%10
  switch (remainder)
  {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function getBadge(firstName, lastName) {
  var badge = "";
  if (firstName != null && firstName.length > 0) {
    badge = firstName.substr(0, 1);
  }

  if (lastName != null && lastName.length > 0) {
    badge += lastName.substr(0, 1);
  }

  return badge.length > 0 ? badge : "--";
}

function cloneArray(sourceArray) {
  if (sourceArray == null) {
    return [];
  }

  var resArray = [];
  for (var i = 0; i < sourceArray.length; ++i) {
    resArray.push(sourceArray[i]);
  }

  return resArray;
}

function extend(obj1, obj2) {  
  return Object.assign({}, obj1, obj2);
}

module.exports = {
  formatTime: formatTime,
  getNumberSuffix: getNumberSuffix,
  getBadge: getBadge,
  cloneArray: cloneArray,  
  extend: extend
}
