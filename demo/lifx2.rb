require 'lifx'

client = LIFX::Client.lan
client.discover

while client.lights.count < 1
  sleep(1)
end

client.lights.turn_on

Signal.trap("INT") do
  client.lights.set_color(LIFX::Color.rgb(0,0,0))
  client.lights.turn_off
  exit
end

$stdout.write("ready")
$stdout.flush

while raw = $stdin.gets
  numbers = raw.split(',').map(&:to_i)
  color = LIFX::Color.rgb(*numbers)
  client.lights.set_color(color)
end