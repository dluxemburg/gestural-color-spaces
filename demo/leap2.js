var Leap = require('leapjs')

Leap.loop(function(frame){
  console.log(frame.hands.map(function(hand) {
    return hand.stabilizedPalmPosition
  }))
})