module Session

  def authenticate
    head :unauthorized if current_user.blank? 
  end

  def current_user
    @current_user ||= User.find_by(uid: params[:uid])
  end
end
