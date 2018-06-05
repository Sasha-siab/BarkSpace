// Parses tags from the description by creating an array of all words
// after a '#', pushes array back as string for postgres storage in posts.

function getTags(str) {
	let re = /(#)\w+/g;
	var found = str.match(re);
	if (found) {
		return found.toString();
	}
}


module.exports = {getTags: getTags}
