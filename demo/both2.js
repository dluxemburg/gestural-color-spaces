var Leap = require('leapjs'),
    child_process= require('child_process')

var max = [0, 0, 0]
var min = [0, 0, 0]
var lastFrameTime = 0

var lifxReady = false
var lifx = child_process.spawn('ruby', ['lib/ruby/lifx1.rb'])


lifx.stdout.on('data', function (data) {
  if (data.toString().match(/ready/)) lifxReady = true
});

Leap.loop(function(frame){
  if (Date.now() - lastFrameTime < 250) return
  lastFrameTime = Date.now()
  if (!frame.hands[0]) return
  var spp = frame.hands[0].stabilizedPalmPosition
  spp.forEach(function(pos, i){
    if (pos > max[i]) max[i] = pos
    if (pos < min[i]) min[i] = pos
  })
  var color = spp.map(function(pos, i){
    return Math.round((pos - min[i])/(max[i] - min[i])*255)
  }).join(',')
  if (lifxReady) {
    console.log(color)
    lifx.stdin.write(color+"\n")
  }
})