const moment = require('moment');

exports.module = function(){

  let t = moment().format('h:mm');
  let a = ( moment().format('a').toLowerCase() == "am" ) ? "morning" : ( t.split(":")[0] < 5 ) ? "afternoon" : "evening";
  let dow = moment().format('dddd');
  let day = moment().format('D');
  let mon = moment().format('MMMM');

  return "<p>Aha, here I see it is " + t + " on a relatively nice " + dow + " " + a + ".</p><img src='/calendar.jpg' class='narrow-image h-centered' alt='This is an image of three dots representing yesterday, today and tomorrow.' /><p>" + mon + " the " + (day - 1) +
   " ... or maybe the " + day + ".";

}
/*

Where we are it's 7 pm on a nice Sunday evening. What ... May 27th?

Same for you?

Now ... what was it we were talking about?

*/
