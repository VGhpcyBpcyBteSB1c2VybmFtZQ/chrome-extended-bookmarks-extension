
// function to save/edit bookmark from add bookmark page
function save_edit()
{
	var link = document.getElementById("display-link").innerText;   // get all the values from html elements
	var title = document.getElementById("save-title").value;
	var desc = document.getElementById("save-description").value;

	chrome.storage.local.get({"bookmarks":null}, function(result){        //get the local storage bookmarks

		var toggle = document.getElementById("save-btn").getAttribute("data-toggle");
		var index = document.getElementById("save-btn").getAttribute("data-index");
		var date = new Date();                                              //get Date/time and create the new entery
		var newBookmark = {"title":title, "link":link, "desc":desc, "date":date.getDate(), "year":date.getFullYear(), "month":date.getMonth()+1, "hour":date.getHours(), "minute":date.getMinutes()};

		if (toggle == "save")   //check if button is in save mode (the current doesn't already exist)
		{
			if (result.bookmarks != null)                                  //check if anything was saved already before pushing
			{
				result.bookmarks.push(newBookmark);
				chrome.storage.local.set({"bookmarks": result.bookmarks}, function(){window.close();});
			}
			else
			{
				var arr = [newBookmark];
				chrome.storage.local.set({"bookmarks": arr}, function(){window.close();});
			}
		}
		else if(toggle == "edit") //check if button is in edit mode (the current link already exists)
		{
			result.bookmarks[index] = newBookmark;
			chrome.storage.local.set({"bookmarks": result.bookmarks}, function(){window.close();});
		}

	});

}

//function to search the locally stored bookmarks by link (if elementID is provided it will get the link from the value of element, if  link is provided it will use that link
//if nothing is provided it will get the current tab link and search for that
//the index of the element if found will be passed to callback otherwise -1 will be passed
function searchByLink(elementID, link, callback)
{
	var searchLink;
	var returnVal = -1;

	if (elementID != null)
	{
		searchLink = document.getElementById(elementID).value;
		chrome.storage.local.get({"bookmarks":null}, function(result){        //get the local storage bookmarks

			if (result.bookmarks != null)                                  //check if anything was saved already
			{
				for (var i = 0; i < result.bookmarks.length; i++)
				{
					if (result.bookmarks[i].link == searchLink)
					{
						returnVal = i;
						break;
					}
				}
			}

			callback(returnVal);
		});
	}
	else if (link != null)
	{
		searchLink = link;
		chrome.storage.local.get({"bookmarks":null}, function(result){        //get the local storage bookmarks

			if (result.bookmarks != null)                                  //check if anything was saved already
			{
				for (var i = 0; i < result.bookmarks.length; i++)
				{
					if (result.bookmarks[i].link == searchLink)
					{
						returnVal = i;
						break;
					}
				}
			}

			callback(returnVal);
		});
	}
	else
	{
		chrome.tabs.query({"active":true, "lastFocusedWindow":true}, function(tabs){   // get active link and title
			searchLink = tabs[0].url;
			chrome.storage.local.get({"bookmarks":null}, function(result){        //get the local storage bookmarks

				if (result.bookmarks != null)                                  //check if anything was saved already
				{
					for (var i = 0; i < result.bookmarks.length; i++)
					{
						if (result.bookmarks[i].link == searchLink)
						{
							returnVal = i;
							break;
						}
					}
				}

				callback(returnVal);
			});
		});

	}
}

// test function for debuugging
function display()
{
	chrome.storage.local.get({"bookmarks":null}, function(result){
		if (result.bookmarks != null)
		{
			alert("Total: "+result.bookmarks.length+"\nMonth: "+result.bookmarks[0].month+"\nDate: "+result.bookmarks[0].date+"\nYear: "+result.bookmarks[0].year+"\nHour: "+result.bookmarks[0].hour+"\nMinute: "+result.bookmarks[0].minute);
		}
		else
		{
			alert("it was null!");
		}
	});
}

//function for setting up add bookmark page
function set_up_add_bookmark()
{
	//get active link and title to display in the add bookmark page
	chrome.tabs.query({"active":true, "lastFocusedWindow":true}, function(tabs){
		document.getElementById("display-link").innerText = tabs[0].url;
		document.getElementById("save-title").value = tabs[0].title;
		searchByLink(null, tabs[0].url, function(index){
			if (index == -1)
			{
				document.getElementById("del-btn").classList.add("d-none");
				document.getElementById("save-btn").setAttribute("data-toggle", "save");
				document.getElementById("save-btn").setAttribute("data-index", index);
				//alert("Was NOT found");
			}
			else
			{
				document.getElementById("save-btn").innerText = "Save";	
				document.getElementById("save-btn").setAttribute("data-toggle", "edit");
				document.getElementById("save-btn").setAttribute("data-index", index);
				chrome.storage.local.get({"bookmarks":null}, function(result){            //set the description of the page if already saved
					document.getElementById("save-description").value = result.bookmarks[index].desc;
					//alert("Was found at index "+index);
				});
			}
		});
	});
}

////////////////////////////////////////////////////////////////////////// MAIN ////////////////////////////////////////////////////////////////////////////

set_up_add_bookmark();


// add event listeners
document.getElementById("save-btn").addEventListener("click", save_edit);

//chrome.storage.local.clear();