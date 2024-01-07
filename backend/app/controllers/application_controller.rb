class ApplicationController < ActionController::API
  # include DeviseTokenAuth::Concerns::SetUserByToken
  include Session
  
end
