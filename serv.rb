require 'rubygems'
require 'sinatra'

set :public, 'test'


get '/astar.js' do
  [200, {"Content-Type" => "text/javascript"}, File.read("astar.js")]
end
get '/graph.js' do
  [200, {"Content-Type" => "text/javascript"}, File.read("graph.js")]
end
