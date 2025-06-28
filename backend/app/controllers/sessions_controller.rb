class SessionsController < ApplicationController
  def create
    uid = params[:uid]
    user = User.find_by(uid: uid)

    if user
      response.set_header('access-token', SecureRandom.hex(16))
      response.set_header('client', SecureRandom.hex(8))
      response.set_header('uid', uid)

      render json: { message: 'ログイン成功' }, status: :ok
    else
      render json: { error: 'ユーザーが存在しません' }, status: :unauthorized
    end
  end
end
