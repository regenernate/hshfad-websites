const moment = require('moment');


exports.module = function(){

  let the_time = moment();
  let t = the_time.format('h:mm', 'EST');
  let a = ( the_time.format('a').toLowerCase() == "am" ) ? "morning" : ( t.split(":")[0] < 5 ) ? "afternoon" : "evening";
  let dow = the_time.format('dddd');
  let day = the_time.format('D');
  let mon = the_time.format('MMMM');

  let d_text;
  if( day < 10 ) d_text = "early " + mon;
  else if( day , 20 ) d_text = "mid " + mon;
  else d_text = "late" + mon;

  return "<p>Aha, here I see it is " + t + " on a relatively nice " + dow + " " + a + ".</p><img src='/calendar.jpg' class='narrow-image h-centered' alt='This is an image of three dots representing yesterday, today and tomorrow.' /><p>Sometime in " + d_text + ".";

}
/*

Where we are it's 7 pm on a nice Sunday evening. What ... May 27th?

Same for you?

Now ... what was it we were talking about?

*/
