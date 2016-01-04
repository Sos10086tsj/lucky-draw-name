/**
 * @fileOverview The file has the business logic of the application
 * @version 1.0.1
 * Date: 2013-1-23
 */

/**
* @description The status of the drawing system
* @property {number} Init The application is initialized
* @property {number} EngineStarted The drawing engine has been started
* @property {number} DrawStarted A certain drawing process has been started, e.g. The third grade prize drawing has been started.
*/
var DrawStatus = {
	Init: 0,
	EngineStarted: 1,
	DrawStarted: 2
};

/**
 * @namespace Hold the logic layer of the application
 */
var App = {
	// Draw Status
	GetDrawStatus: function() {
		return this.mDrawStatus;
	},
	SetDrawStatus: function(status) {
		this.mDrawStatus = status;
	},
	// Drawing state
	GetDrawing: function() {
		return this.mIsDrawing;
	},
	SetDrawing: function(flag) {
		this.mIsDrawing = flag;
	},
	// Current prize grade
	GetCurPrizeGrade: function() {
		return this.mCurPrizeGrade;
	},
	SetCurPrizeGrade: function(grade) {
		this.mCurPrizeGrade = grade;
	},
	// Current candidate index
	GetSingleCandidateIndex: function() {
		return this.mSingleCandidateIndex;
	},
	SetSingleCandidateIndex: function(index) {
		this.mSingleCandidateIndex = index;
	},

	// data variables
	mDrawStatus: DrawStatus.Init,
	mIsDrawing: 1,
	mCurPrizeGrade: -1,
	mSingleCandidateIndex: 0,
	// The display candidates list
	CandidateDspList: [],
	// The candidates who won prize were put here
	PrizeList: [],
	DrawProcessTimer: {},
	SingleCandidateTimer: {},
	// lock of stop drawing
	StopsFlag: false,
	IsRedrawing: false,
	ShowResult: false,
	// lock of next group drawing
	CandidateDrawingLock: false
};

/**
 * @function Start the drawing engine
 */
App.StartDrawEngine = function() {
	// check the configuration
	for (var i in PrizeSettings) {
	    if (!PrizeSettings[i].count) {
	        alert(PrizeSettings[i].name + InfoResource.PrizeNumError);
	        return false;
	    }
	};

	// draw process is finished, show the result page.
	if ((PrizeSettings.length - 1) == App.GetCurPrizeGrade()) {
		$(UIResourceSelector.NextGroupBtn).live("click", function() {
		    App.NavToResultPage();
		})
		return;
	};

	// update the counter
	App.SetCurPrizeGrade((App.GetCurPrizeGrade() < 0) ? 0 : App.GetCurPrizeGrade() + 1);
	
	// bind events to operation buttons
	if (App.GetCurPrizeGrade() == 0) {
		$(UIResourceSelector.StartBtn).click(function() {
		    App.Starts();
		});
		$(UIResourceSelector.StopBtn).click(function() {
			if (!App.StopsFlag) {
				App.StopsFlag = true;
				setTimeout(function() {	
					App.Stops();
					App.StopsFlag = false;
				}, Config.DrawingDelay);
			}
   	 	});
	    $(UIResourceSelector.NextGroupBtn).click(function() {
			if (App.GetDrawing() && !App.IsRedrawing && !App.CandidateDrawingLock) {
				App.StartDrawEngine();
			}
			if (App.ShowResult) {
				App.NavToResultPage();
			}
	    });
	    window.res = App.PrizeList.length;
	};

	// set the prize title
	var prizeInfo = PrizeSettings[App.GetCurPrizeGrade()];
	$(UIResourceSelector.PrizeTitle).html(prizeInfo.name);

	// enable the user to redraw prize
	var inputText = "";
	if (PrizeSettings.length > 0) {
		var prizeCount = PrizeSettings[App.GetCurPrizeGrade()].count;
	    for (var i = 0; i < prizeCount; ++i) {
	        inputText += UITemplate.UserNameInput;
	    }
	}
	$(UIResourceSelector.CandidateList).html(inputText);
	
	App._UpdateCandidateCountInfo();
	$(UIResourceSelector.CandidateCountInfo).show();

	// set the class of the user name input elements
	if (PrizeSettings[App.GetCurPrizeGrade()].style) {
	    if (PrizeSettings[App.GetCurPrizeGrade()].style.indexOf(':') < 0)
	        $(UIResourceSelector.CandidateListItems).addClass(PrizeSettings[App.GetCurPrizeGrade()].style);
	    else
	        $(UIResourceSelector.CandidateListItems).attr("style", PrizeSettings[App.GetCurPrizeGrade()].style)
	}

	// set the status of each operation buttons
	$(UIResourceSelector.StartBtn).removeAttr("disabled");
	//Logger.Log("App.StartDrawEngine, disable stop button");
	$(UIResourceSelector.StopBtn).attr("disabled", "disabled");
	$(UIResourceSelector.NextGroupBtn).attr("disabled", "disabled");

	App.SetDrawStatus(DrawStatus.EngineStarted);
	App.SetDrawing(false);

	App.SetSingleCandidateIndex(0);
};

App._UpdateCandidateCountInfo = function() {
	if (Config.EnableRepetition == 1)
		return;
	
	$(UIResourceSelector.CandidateCountInfoValue).html(CandidateList.length - App.PrizeList.length);
};

/**
 * @function start prize drawing
 * @param {HTMLInputElement} candidateElement If the user want to redraw a specified input, the parameter candidateElement will be the input element
 */
App.Starts = function(candidateElement) {
	if (App.IsRedrawing)
		return;
	
    // check candidates left
	if (!Config.EnableRepetition & (App.PrizeList.length > (CandidateList.length - 1))) {
        alert(InfoResource.LackOfCandidate);
        return false;
    };
	
	window.ipt = null;
	// if a specified input is set to be redrawn
    if (candidateElement) {
        candidateElement.blur();

        if (App.GetDrawStatus() == DrawStatus.EngineStarted | App.GetDrawStatus() == DrawStatus.DrawStarted) {
            alert(InfoResource.DrawSingleCandidateErrorTip);
            return false;
        }
        
        if (!confirm(InfoResource.DrawSingleCandidatePrompt))
            return false;
		App.IsRedrawing = true;
		
		App._UpdateCandidateCountInfo();
		
        var n = $(candidateElement).val();
        if (confirm("“" + n + InfoResource.DrawSingleCandidateChoice)) {
            App.PrizeList.push((CandidateList.length > 0) ? $(candidateElement).attr("lang") : n)
        }

        var candidateElement = candidateElement;
        window.ipt = candidateElement;
    }
    
	App.SetDrawStatus(DrawStatus.DrawStarted);
	
	// set the status of each operation buttons
	//Logger.Log("App.Starts, enable stop button");
    $(UIResourceSelector.StopBtn).removeAttr("disabled");
    $(UIResourceSelector.StartBtn).attr("disabled", "disabled");
    $(UIResourceSelector.NextGroupBtn).attr("disabled", "disabled");
	
	// start drawing process
    App.DrawProcessTimer = setInterval((candidateElement) ? "App.StartRolling(window.ipt);" : "App.StartRolling();", Config.CandidateNameDspTime)
}

/**
 * @description Calculate a random candidate index
 * The Math.random() will calculate a random floating number in [0, 1)
 */
App.CalculateRandomIndex = function() {
	var randomIndex = parseInt(Math.random() * CandidateList.length);
    return randomIndex;
}

/**
 * @function start candidate name rolling
 * @param {HTMLInputElement} candidateElement If the user want to redraw a specified input, the parameter candidateElement will be the input element
 */
App.StartRolling = function(candidateElement) {
    window.ok = 0;
    App.CandidateDspList = [];
	// for a specified candidate
    if (candidateElement) {
        while (true) {
            var num = App.CalculateRandomIndex();
            if (!App.IsInPrizeList(num)) {
                window.ok = 1;
                break;
            }
        }

        $(candidateElement).val(num);
        if (CandidateList.length > 0) {
            $(candidateElement).attr("lang", num);
            $(candidateElement).val(CandidateList[num])
        }
    } else { // for all candidates
        for (var i = (PrizeSettings[App.GetCurPrizeGrade()].count - (App.GetSingleCandidateIndex() + 1)); i >= 0; i--) {
		    while (true) {
                var num = App.CalculateRandomIndex();
                if (!App.IsInPrizeList(num)) {
                    App.CandidateDspList.push(num);
                    break;
                }
            };
			// set the calculated names onto the input elements
			$(UIResourceSelector.CandidateInputs).eq(PrizeSettings[App.GetCurPrizeGrade()].count - (i + 1)).attr("lang", num);
			$(UIResourceSelector.CandidateInputs).eq(PrizeSettings[App.GetCurPrizeGrade()].count - (i + 1)).val(CandidateList[num]);
			
			if (Config.DrawSingleOrGroupCandidate == 1 && !Config.ItemRollingTogether)
            	break;
        };
        window.ok = 1;
    }
}

/**
 * @function stop the drawing process
 * @parameter {boolean} flag The single candidate drawing will use this flag to stop the process
 */
App.Stops = function(flag) {
	//Logger.Log("App.Stops, disable stop button 1");
	App.CandidateDrawingLock = true;
    $(UIResourceSelector.StopBtn).attr("disabled", "disabled");
	if (!window.ok) {
        if (!flag)
            App.SingleCandidateTimer = setInterval("App.Stops(true);", 1);
        return false;
    }
	
	// draw one candidate each time
    if (Config.DrawSingleOrGroupCandidate) {
		if (App.GetSingleCandidateIndex() < (PrizeSettings[App.GetCurPrizeGrade()].count)) {
			App.SetSingleCandidateIndex(App.GetSingleCandidateIndex()+1);
			
			App.DrawOneCandidate();
            
			if (App.GetSingleCandidateIndex() < (PrizeSettings[App.GetCurPrizeGrade()].count)) {
                return false;
            }
			
			App.SetDrawStatus(DrawStatus.Init);
        }
    }
    
    clearInterval(App.SingleCandidateTimer);
    clearInterval(App.DrawProcessTimer);
	
	// set the status of elements
	App.SetDrawing(true);
    $(UIResourceSelector.NextGroupBtn).removeAttr("disabled");
    App.SetDrawStatus(DrawStatus.Init);
	//Logger.Log("App.Stops, disable stop button 2");
    $(UIResourceSelector.StopBtn).attr("disabled", "disabled");
    $(UIResourceSelector.StartBtn).attr("disabled", "disabled");
	
	// for all candidates
    if (window.ipt == null) {
        window.res += (App.GetCurPrizeGrade()) ? PrizeSettings[App.GetCurPrizeGrade() - 1].count : 0;
        var s = "";
        for (var i = 0; i < PrizeSettings[App.GetCurPrizeGrade()].count; i++) {
            var q = $(UIResourceSelector.CandidateInputs).eq(i).val();
            if (CandidateList.length > 0) {
                q = $(UIResourceSelector.CandidateInputs).eq(i).attr("lang");
                if (!Config.EnableRepetition & !Config.DrawSingleOrGroupCandidate)
                    App.PrizeList.push(q);
                $(UIResourceSelector.CandidateInputs).eq(i).val(q = CandidateList[q])
            } else if (!Config.EnableRepetition)
                App.PrizeList.push(q);
            s += UITemplate.ResultTabItemContentPrefix + q + UITemplate.SpanPostfix;
        }
        
		// output the result
        $(UIResourceSelector.ResultTabContent).eq(0).before(UITemplate.ResultTabItemTitlePrefix + PrizeSettings[App.GetCurPrizeGrade()].name + UITemplate.SpanPostfix + s + UITemplate.LiPostfix);
        if (Config.DrawSingleOrGroupCandidate == 0)
			App.CandidateDrawingLock = false;
		// TODO, please refine the logic
		App._UpdateCandidateCountInfo();
    } else { // for a specified candidate
        if (!Config.EnableRepetition) {
            App.PrizeList[window.res + $(window.ipt).index()] = (CandidateList.length > 0) 
            ? $(window.ipt).attr("lang") 
            : $(window.ipt).val();
		}
		App._UpdateCandidateCountInfo();
		$(UIResourceSelector.SpecifiedCandidateResult).eq($(window.ipt).index() + 1).text($(window.ipt).val());
		$(UIResourceSelector.SpecifiedCandidateContent).html($(window.ipt).val());
		$(UIResourceSelector.SpecifiedCandidate).show();
		setTimeout(function() {
			$(UIResourceSelector.SpecifiedCandidate).fadeOut("slow");
			App.CandidateDrawingLock = false;
		}, Config.ResultTipDspTime);
		
		App.IsRedrawing = false;
    }
    
	// set the status of result button
    if ((PrizeSettings.length - 1) == App.GetCurPrizeGrade()) {
		App.SetDrawing(false);
        $(UIResourceSelector.NextGroupBtn).val(InfoResource.ShowResult);
		App.ShowResult = true;
		//$(UIResourceSelector.CandidateCountInfo).html(InfoResource.DrawEndInfo);
    }
}

/**
 * @description Draw prize for a specified candidate
 * @parameter {boolean} flag The single candidate drawing will use this flag to stop the process
 */
App.DrawOneCandidate = function(flag) {
    if (flag) {
        App.SetDrawStatus(DrawStatus.DrawStarted);
        $(UIResourceSelector.SpecifiedCandidate).fadeOut("slow");
        if (!(App.GetSingleCandidateIndex() < (PrizeSettings[App.GetCurPrizeGrade()].count)))
            App.SetDrawStatus(DrawStatus.Init);
        else {
			//Logger.Log("App.DrawOneCandidate, enable stop button");
            $(UIResourceSelector.StopBtn).removeAttr("disabled");
		}
		
		App.CandidateDrawingLock = false;
		
        return true;
    }
    
	App.SetDrawStatus(DrawStatus.Init);
    var num = (CandidateList.length > 0) 
		? $(UIResourceSelector.CandidateInputs).eq(App.GetSingleCandidateIndex() - 1).attr("lang") 
		: $(UIResourceSelector.CandidateInputs).eq(App.GetSingleCandidateIndex() - 1).val();
    App.PrizeList.push(num);
	App._UpdateCandidateCountInfo();
    $(UIResourceSelector.SpecifiedCandidateContent).html((CandidateList.length > 0) ? CandidateList[num] : num);
    $(UIResourceSelector.SpecifiedCandidate).show();
    setTimeout("App.DrawOneCandidate(true);", Config.ResultTipDspTime);
}

/**
 * @description Check whether the candidate has won the prize
 */
App.IsInPrizeList = function(item) {
	// check the rolling candidate list
    for (var i = 0, count = App.CandidateDspList.length; i < count; i++) {
        if (App.CandidateDspList[i] == item)
            return true;
    }

	// check the prize list
    for (var i = 0, count = App.PrizeList.length; i < count; i++) {
        if (App.PrizeList[i] == item)
            return true;
    }

    return false;
}

/**
 * @description Copy the drawing result and show the result page
 */
App.NavToResultPage = function() {
	App.SetDrawStatus(DrawStatus.Init);
	App.SetDrawing(false);
	$(UIResourceSelector.ResultPageContent).html($(UIResourceSelector.ResultTab).html());
	$(UIResourceSelector.DrawContent).hide();
	$(UIResourceSelector.ResultPage).slideDown("slow");
	$('body').css("background-image", UITemplate.BodyBkgImg);
}

/**
 * @description Enum of key down events
 */
var KeyDownEventCode = {
	Space: "32",
	Enter: "13"
};

/**
 * @description Process the key down events
 */
App.ProcessKeyDownEvents = function(e) {
	// use pressed space key
    if (e.keyCode == KeyDownEventCode.Space & App.GetDrawStatus() != DrawStatus.Init) {
		if (App.GetDrawStatus() == DrawStatus.EngineStarted) {
			App.Starts();
		} else {
			if (!App.StopsFlag) {
				App.StopsFlag = true;
				setTimeout(function() {
					App.Stops();
					App.StopsFlag = false;
				}, Config.DrawingDelay);
			}
		}
    }
    
	// user pressed enter key
    if (e.keyCode == KeyDownEventCode.Enter) {
		if (App.GetDrawing() && !App.IsRedrawing && !App.CandidateDrawingLock) {
			App.StartDrawEngine();
		}
		if (App.ShowResult) {
			App.NavToResultPage();
		}
    }
}

// Bind keydown events
$(function() {
    if (window.ActiveXObject) {
        $(document).keydown(function(event) {
            App.ProcessKeyDownEvents(event);
        });
	} else {
        $(window).keydown(function(event) {
            App.ProcessKeyDownEvents(event);
        });
		
		if (window.screen) {
            window.moveTo(0, 0);
            window.resizeTo(screen.availWidth, screen.availHeight)
			//$("body").css("height", document.body.clientHeight);
        }
    }
});

// Bind event to close the application
$(function() {
    $(UIResourceSelector.ExitBtn).click(function() {
        if (confirm(InfoResource.ExitAppTip)) {
            window.top.close();
        }
    });
});

