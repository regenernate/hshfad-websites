
const header_start = "<head><meta charset = 'utf-8'><title>";
const header_end = "</title><link rel='author' href='/humans.txt' /><style>@import url('/main.css');</style></head>";

module.exports.start_tag = "<headerme>";
module.exports.end_tag = "</headerme>";
module.exports.makeHeader = function(title){
  return header_start + title + header_end;
}
