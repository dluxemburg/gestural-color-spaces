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
  args = raw.split(/,| /)
  space = args.first.to_sym
  args = args.slice(1,3).map(&:to_f)
  if [:hsl,:hsv].include?(space)
    args = [args[0],args[2],args[1]]
  end
  args.unshift(space)
  color = LIFX::Color.send(*args)
  # rescue block left out of
  # presentation for brevity
  begin
    client.lights.set_color(color)
  rescue
  end
end
