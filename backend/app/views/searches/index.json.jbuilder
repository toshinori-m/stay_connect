json.array! @recruitments do |recruitment|
  json.extract! recruitment, :id, :name, :area, :sex, :number, :start_date, :end_date, :purpose_body
  json.sports_discipline_name recruitment.sports_disciplines, :id, :name
  json.target_age_name recruitment.target_ages, :id, :name
  json.prefecture_name recruitment.prefecture.name
  json.sports_type_name recruitment.sports_type&.name
end
