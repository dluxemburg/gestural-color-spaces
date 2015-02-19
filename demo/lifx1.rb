require 'lifx'

client = LIFX::Client.lan
client.discover

while client.lights.count < 1
  sleep(1)
end

client.lights.turn_on

client.lights.set_color(LIFX::Color.rgb(255,255,255))

Signal.trap("INT") do
  client.lights.set_color(LIFX::Color.rgb(0,0,0))
  client.lights.turn_off
  exit
end