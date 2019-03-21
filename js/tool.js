function getValue(data,attrStr) {
  const attrs = attrStr.split(".");
  let val = data;
  attrs.forEach(attr => {
    val = val[attr]
  })
  return val;
}