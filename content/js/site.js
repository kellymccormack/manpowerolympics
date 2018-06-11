
// matchMedia helper
var supportsMatchMedia = function () {
        return (typeof window.matchMedia != 'undefined' || typeof window.msMatchMedia != 'undefined');
    },	
    isMaxWidth = function (val) {
		return supportsMatchMedia() && window.matchMedia('(max-width: ' + val + 'px)').matches;
	},
	isMinWidth = function (val) {
		return supportsMatchMedia() && window.matchMedia('(min-width: ' + val + 'px)').matches;
	},
    isMaxHeight = function (val) {
		return supportsMatchMedia() && window.matchMedia('(max-height: ' + val + 'px)').matches;
	},
	isMinHeight = function (val) {
		return supportsMatchMedia() && window.matchMedia('(min-height: ' + val + 'px)').matches;
	};

//vars for slide bg images
var img1 = $('#slide-img-1'),
    img2 = $('#slide-img-2'),
    img3 = $('#slide-img-3'),
    src1 = img1.data('src'),
    src2 = img2.data('src'),
    src3 = img3.data('src'),
    src1dark = img1.data('srcdark'),
    src2dark = img2.data('srcdark'),
    src3dark = img3.data('srcdark');

//if small screen, use dark images, otherwise use normal images
if (isMaxWidth(1024) && isMaxHeight(1024)) {
    img1.attr('src', src1dark);
    img2.attr('src', src2dark);
    img3.attr('src', src3dark);
} else {
    img1.attr('src', src1);
    img2.attr('src', src2);
    img3.attr('src', src3);
}

//run boxesFX BG tile plugin
new BoxesFx( document.getElementById('boxgallery'));

// random heading fade effect using GSAP splitText plugin. 
function revealText(textEl) {
    var mySplitText = new SplitText(textEl, {type:"chars, words"}),
        tl = new TimelineMax(),
        numChars = mySplitText.chars.length;

    for(var i = 0; i < numChars; i++){
        //random value used as position parameter
        //OG-KM      tl.from(mySplitText.chars[i], 2, {opacity:0}, Math.random() * 2);
        tl.from(mySplitText.chars[i], 3, {opacity:0}, Math.random() * 2);
    }
}

//RESULTS SCENE 4 countup and GSAP timeline vars
//start COUNTUP
var easingFn = function (t, b, c, d) {
    var ts = (t /= d) * t;
    var tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
};
var optionsSeparator = {	
    useEasing: true,
    easingFn: easingFn,
    useGrouping: true,
    separator: ',',
    decimal: '',
    prefix: '',
    suffix: ''
};
var countup1 = new CountUp("countUp1", 0, 195000, 0, 1, optionsSeparator); // 195,000
var countup2 = new CountUp("countUp2", 0, 5505, 0, 2, optionsSeparator); // 5,505
var countup3 = new CountUp("countUp3", 0, 4000, 0, 3, optionsSeparator); // 4,000
var countup4 = new CountUp("countUp4", 0, 59400, 0, 1, optionsSeparator); // 59,400 
var countup5 = new CountUp("countUp5", 0, 20000, 0, 2, optionsSeparator); // 20,000 
var countup6 = new CountUp("countUp6", 0, 8000, 0, 3, optionsSeparator); // 8,000

//END countup

//GSAP timeline for results scene 4
var tl4 = new TimelineMax();

//Animation sequence function for scene4
function resultsScene() {
        
    //reset timeline and countup instances if already playing
    tl4.pause(0, true).clear();
    countup1.reset();
    countup2.reset();
    countup3.reset();
    countup4.reset();
    countup5.reset();
    countup6.reset();
    
    //1st row
    tl4.fromTo($('.list-stats-1'), 1, {autoAlpha: 0}, {autoAlpha: 1}, 1.5)
        .add(countup1.start)
        .add(countup2.start)
        .add(countup3.start)
        .add('rowbreak')
    //2nd row
        .fromTo($('.scene-4-h2-second, .scene-4-p-second'), 1, {autoAlpha: 0}, {autoAlpha: 1}, 'rowbreak+=3.25')
        .fromTo($('.list-stats-2'), 1, {autoAlpha: 0}, {autoAlpha: 1})
        .add(countup4.start)
        .add(countup5.start)
        .add(countup6.start);
    
    //play timeline
    tl4.play();
}