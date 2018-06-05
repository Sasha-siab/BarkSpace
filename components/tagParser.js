// Get array of unique tag values to display on tag search page from list of many repeat tags


const gt = require('./getTags.js')

function tagParser(rows,query) {
  // Set element takes only unique values
  query =  new RegExp(query,'i');
  let uniques = new Set();
  for (let row of rows) {
    // for each datapoint run our getTags function to retrieve tags matching
    // user defined search
    let relevantTag = gt.getTags(row.dataValues.tags);
    if (relevantTag.includes(',')) {
      // if the tag includes a comma it must be an array because of our global
      // regexp seach parameter

      var relevantTags = relevantTag.split(',');

      for (let tag of relevantTags) {
        // add each tag in array to set
        if ( tag.match(query) ) {
          uniques.add(tag);
        }
      }
    } else {
      // single tag identified from the post, add to set
      if ( relevantTag.match(query) ) {
        uniques.add(relevantTag);
      }
    }
  }
  // return array of unique tags (sets need to be spread to be used as an array)
  let res =[...uniques];
  return res;

}


module.exports = {tagParser:tagParser}
