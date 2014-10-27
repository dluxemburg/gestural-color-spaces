var Stream = require('stream'),
    Leap = require('leapjs'),
    child_process= require('child_process')

var getLeapStream = function(){

  var max = [0, 0, 0]
  var min = [0, 0, 0]
  var lastFrameTime = 0
  var queue = []

  var stream = new Stream.Readable()

  Leap.loop(function(frame){
    if (!frame.hands[0]) return

    var spp = frame.hands[0].stabilizedPalmPosition
    spp.forEach(function(pos, i){
      if (pos > max[i]) max[i] = pos
      if (pos < min[i]) min[i] = pos
    })

     var color ='hsv '+spp.map(function(pos, i){
       var v = (pos - min[i])/(max[i] - min[i])
       if (i==0) v = Math.round(v*360)
       return v
     }).join(',')
     stream.push(color)
  })

  stream._read = function(){}

  return stream

}

var skipper = new Stream.Transform()
skipper._transform = function(data, encoding, callback) {
  this.lastChunkTime || (this.lastChunkTime = 1)
  if (Date.now() - this.lastChunkTime > 250) {
    this.lastChunkTime = Date.now()
    console.log(data.toString())
    this.push(data.toString()+"\n")
  }
  callback()
}

// getLeapStream().pipe(process.stdout)
var lifx = child_process.spawn('ruby', ['lib/ruby/lifx2.rb'])
getLeapStream().pipe(skipper).pipe(lifx.stdin)