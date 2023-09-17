class Auth::PasswordsController < DeviseTokenAuth::PasswordsController

private
  def resource_params
    params.permit(:email, :reset_password_token, :config, :redirect_url)
  end

  def redirect_options
    {
      allow_other_host: true
    }
  end
end
