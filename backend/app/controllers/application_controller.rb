class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken
  # rescue_from ActionController::Redirecting::UnsafeRedirectError, with: :redirect_judgment

  # private

  # # メールリンクのリダイレクトURLのドメインが、許可されていないドメインだったら例外をコールする
  # # 許可されているドメインの指定は環境変数: MY_APP_FRONT_DOMAINで指定する
  # def redirect_judgment
  #   redirect_url = @_request.query_parameters[:redirect_url]
  #   uri = URI.parse(redirect_url)
  #   # binding.pry
  #   redirect_to "http://localhost:3001/auth/password/edit?config=default&redirect_url=password&reset_password_token=#{@_request.query_parameters[:reset_password_token]}", allow_other_host: true
  # end
end
