require_relative "boot"

require "rails/all"

Bundler.require(*Rails.groups)

module Myapp
  class Application < Rails::Application
    config.load_defaults 7.0
    config.api_only = true
    config.session_store :cookie_store, key: '_interslice_session'
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use config.session_store, config.session_options
    config.generators do |g|
      g.test_framework false
    end
    config.action_controller.raise_on_open_redirects = false
    config.active_job.queue_adapter = :async
  end
end
