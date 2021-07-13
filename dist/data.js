var dat = {
	"tests": [
		{
		"desc": "Leave your policy file empty and press the submit button to observe deny-by-default behaviour.",
		"query": ["_","_","_"],
		"expected": false
		}
	]
}
document.getElementById('eg').setAttribute('context', JSON.stringify(dat));
