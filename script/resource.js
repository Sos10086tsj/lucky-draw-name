/**
 * @fileOverview The file has the resources of user interface.
 * @version 1.0.1
 * Date: 2013-1-23
 */
/**
 * @description The selectors to locate specified user interface
 */
var UIResourceSelector = {
	DrawContent: ".Top",
	PrizeTitle: '.title',
	StartBtn: "#start",
	StopBtn: "#end",
	NextGroupBtn: "#nextGroup",
	CandidateList: ".input",
	CandidateListItems: ".input>input",
	CandidateInputs: '.ipt',
	ResultTab: '#tableOUT',
	ResultTabContent: "#tableOUT>*",
	SpecifiedCandidate: ".oneOut",
	SpecifiedCandidateContent: ".oneOut>div",
	SpecifiedCandidateResult: "#tableOUT>li:first-child>span",
	CandidateCountInfo: "#candidate-count-info",
	CandidateCountInfoValue: "#candidate-count-info-value",
	ResultPage: ".End",
	ResultPageContent: ".End>ul",
	ExitBtn: ".OFF"
};

/**
 * @description The text information resources
 */
var UITemplate = {
	UserNameInput: '<input type="text" value="888" class="ipt" ondblclick="App.Starts(this,true);" title="双击可以对我单独重抽" readonly />',
	ResultTabItemTitlePrefix: '<li><span class="oTitle">',
	ResultTabItemContentPrefix:' <span class="oMain">',
	SpanPostfix: '</span>',
	LiPostfix: '</li>',
	BodyBkgImg: "url('style/images/result-page.jpg')"
};

/**
 * @description The text information resources
 */
var InfoResource = {
	PrizeNumError: "奖项的数量配置有问题，请重新配置！",
	LackOfCandidate: "参与人员过少或过滤太多无法抽取,请更改参数再来！",
	DrawSingleCandidateErrorTip: "还未抽奖或者正在忙碌，暂时不能这样操作！",
	DrawSingleCandidatePrompt: "您确定要单独抽取这个对象吗?",
	DrawSingleCandidateChoice: "”在以后的环节内将不再出现！\n 如果为其保留机会，请选择“取消”！",
	DrawEndInfo: "抽奖结束，谢谢大家！",
	ShowResult: "查看结果(回车)",
	ExitAppTip: "您确定要关闭程序吗?"
};
