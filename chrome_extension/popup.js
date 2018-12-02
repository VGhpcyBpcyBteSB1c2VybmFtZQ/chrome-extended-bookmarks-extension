function save()
{
	chrome.storage.local.set({"key": "value"}, function(){});
}
function load()
{
	chrome.storage.local.get(["key"], function(result){
		alert("Value is "+result.key);
	});
}

document.getElementById("button1").addEventListener("click", save);
document.getElementById("button2").addEventListener("click", load);