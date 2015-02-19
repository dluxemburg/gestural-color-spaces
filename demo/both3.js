var Leap = require('leapjs'),
    child_process = require('child_process')

var max = [0, 0, 0]
var min = [0, 0, 0]

var lifxReady = false
var lifx = child_process.spawn('ruby', ['demo/lifx3.rb'])

lifx.stdout.on('data', function (data) {
  if (data.toString().match(/ready/)) lifxReady = true
});

var lastFrameTime = 0
Leap.loop(function(frame){
  if (Date.now() - lastFrameTime < 250) return
  lastFrameTime = Date.now()
  if (!frame.hands[0]) return
  var spp = frame.hands[0].stabilizedPalmPosition
  spp.forEach(function(pos, i){
    if (pos > max[i]) max[i] = pos
    if (pos < min[i]) min[i] = pos
  })
  var color ='hsv '+spp.map(function(pos, i){
    var v = (pos - min[i])/(max[i] - min[i])
    if (i == 0) v = Math.round(v*360)
    return v
  }).join(',')
  if (lifxReady) {
    console.log(color)
    lifx.stdin.write(color+"\n")
  }
})