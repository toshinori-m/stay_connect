json.data do
  json.id @team.id
  json.name @team.name
  json.email @team.email
  json.image @team.image
  json.birthday @team.birthday
  json.sex @team.sex
  json.self_introduction @team.self_introduction

  json.sports_disciplines @team.sports_disciplines.map(&:id)
  json.target_ages @team.target_ages.map(&:id)
end
