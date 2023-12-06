json.data do
  json.id @user.id
  json.name @user.name
  json.email @user.email
  json.image @user.image
  json.birthday @user.birthday
  json.sex @user.sex
  json.self_introduction @user.self_introduction
  json.email_notification @user.email_notification
end
