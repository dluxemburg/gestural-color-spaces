var Stream = require('stream'),
    Leap = require('leapjs'),
    child_process= require('child_process')

var getLeapStream = function(){

  var max = [0, 0, 0]
  var min = [0, 0, 0]

  var leapStream = new Stream.Readable()

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
   leapStream.push(color)

  })

  leapStream._read = function(){}

  return leapStream

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

var rotate = new Stream.Transform()
rotate._transform = function(data, encoding, callback) {
  data = data.toString()
  data = data.split(/,| /)
  data[1] = (data[1] + 60) % 360
  this.push(data.join(','))
  callback()
}

var lights = {
  left: child_process.spawn('ruby', ['lib/ruby/lifx3.rb', 'Left']),
  right: child_process.spawn('ruby', ['lib/ruby/lifx3.rb', 'Right']),
  center: child_process.spawn('ruby', ['lib/ruby/lifx3.rb', 'Middle'])
}

getLeapStream()
.pipe(skipper)

skipper.pipe(lights.left.stdin)

skipper.pipe(rotate)
.pipe(lights.right.stdin)

skipper.pipe(rotate)
.pipe(rotate)
.pipe(lights.center.stdin)


