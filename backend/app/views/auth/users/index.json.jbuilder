if @current_user
  json.data do
    json.id @current_user.id
    json.name @current_user.name
    json.email @current_user.email
    json.image @current_user.image
    json.birthday @current_user.birthday
    json.sex @current_user.sex
    json.self_introduction @current_user.self_introduction
  end
end
