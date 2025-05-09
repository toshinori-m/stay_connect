json.data do
  json.id @recruitment.id
  json.user_id @recruitment.user_id
  json.image @recruitment.image
  json.name @recruitment.name
  json.area @recruitment.area
  json.sex @recruitment.sex
  json.number @recruitment.number
  json.start_date @recruitment.start_date
  json.end_date @recruitment.end_date
  json.purpose_body @recruitment.purpose_body
  json.other_body @recruitment.other_body
  json.sports_type_id @recruitment.sports_type_id
  json.sports_type_name @recruitment.sports_type&.name
  json.prefecture_id @recruitment.prefecture_id
  json.prefecture_name @recruitment.prefecture&.name

  json.sports_disciplines do
    json.array! @recruitment.sports_disciplines, :id, :name
  end
  json.target_ages do
    json.array! @recruitment.target_ages, :id, :name
  end
end
