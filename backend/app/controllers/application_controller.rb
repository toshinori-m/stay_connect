class ApplicationController < ActionController::API
        include DeviseTokenAuth::Concerns::SetUserByToken

        private

        def authenticate_user
          unless logged_in?
            flash[:error] = "このセクションにアクセスするにはログインが必要です"
            redirect_to new_login_url # リクエストサイクルを停止する
          end
        end
end
