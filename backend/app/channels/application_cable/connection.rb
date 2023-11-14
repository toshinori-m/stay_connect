module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      user = User.find_by(uid: request.params[:uid])
      if user && user.valid_token?(request.params[:'access-token'], request.params[:client])
        user
      else
        reject_unauthorized_connection
      end
    end
  end
end
