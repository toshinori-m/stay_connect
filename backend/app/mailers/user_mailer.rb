class UserMailer < ApplicationMailer
  default from: ENV['EMAIL_ADDRESS']

  def new_message_notification
    @user_name = params[:user_name]
    @user_message = params[:user_message]
    @recipient_name = params[:recipient_name] 
    @recipient_email = params[:recipient_email]
    mail(to: @recipient_email, subject: '新しいメッセージの通知')
  end
end
