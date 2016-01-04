/**
 * @fileOverview The file has the configurations of the application. e.g. prize settings and drawing settings.
 * @version 1.0.1
 * Date: 2013-1-23
 */

 /**
 * @description Prize settings
 * name: the title of current group of prize
 * count: the count of current group of prize
 * style: default class name of the group of prize
 */
var PrizeSettings = [
	{ name:"三等奖", count:5, style:"ipt5" },
	{ name:"二等奖", count:2, style:"ipt2" },
	{ name:"一等奖", count:1, style:"ipt1" },
	{ name:"特等奖", count:1, style:"ipt1" }
];

/**
 * @description Configuration of drawing process
 */
 var Config = {
	// whether to enable candidate repetition
	EnableRepetition: 0,
	// Draw a single candidate (1) or a group of candidates each time (0)
	DrawSingleOrGroupCandidate: 1,
	// Display time range of each candidate in the rolling animation, the unit is ms
	CandidateNameDspTime: 100,
	// Delay for a while when the user stops the drawing process, the unit is ms
	DrawingDelay: 500,
	// Candidate who won the prize could be prompted for a short while, the unit is ms
	ResultTipDspTime: 800,
	// Rolling the candidates one by one, or together
	ItemRollingTogether: false
};

/**
 * @description The name list of all candidates
 */
var CandidateList = [
	"a", "b", "c", "d", "e","f","g",
	"h","i","j","k","l","m","n",
	"o","p","q","r","s","t",
	"u","v","w","x","y","z"
];

