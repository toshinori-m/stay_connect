json.data do
  json.id @user.id
  json.name @user.name
  json.email @user.email
  json.image_url @user.image_url
  json.birthday @user.birthday
  json.sex @user.sex
  json.self_introduction @user.self_introduction
end
