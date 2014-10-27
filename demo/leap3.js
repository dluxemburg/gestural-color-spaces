var Leap = require('leapjs')

var max = [0, 0, 0]
var min = [0, 0, 0]

Leap.loop(function(frame){
  if (!frame.hands[0]) return
  var spp = frame.hands[0].stabilizedPalmPosition
  spp.forEach(function(pos, i){
    if (pos > max[i]) max[i] = pos
    if (pos < min[i]) min[i] = pos
  })
  console.log(spp.map(function(pos, i){
    return (pos - min[i])/(max[i] - min[i])
  }))
})