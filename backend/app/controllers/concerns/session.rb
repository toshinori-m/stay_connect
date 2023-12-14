module Session

  def authenticate
    head :unauthorized if current_user.blank? 
  end

  def current_user
    uid = request.headers['uid']
    @_current_user ||= User.find_by(uid: uid)
  end
end
