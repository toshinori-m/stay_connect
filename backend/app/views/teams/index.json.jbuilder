json.array! @teams do |team|
  json.id team.id
  json.name team.name
  json.area team.area
  json.sex team.sex
  json.track_record team.track_record
  json.other_body team.other_body
  json.sports_type_id team.sports_type_id
  json.prefecture_id team.prefecture_id

  json.sports_disciplines team.sports_disciplines.ids
  json.target_ages team.target_ages.ids
end
