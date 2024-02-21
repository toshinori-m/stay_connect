json.array! @teams do |team|
  json.id team.id
  json.user_id team.user_id
  json.name team.name
  json.area team.area
  json.sex team.sex
  json.track_record team.track_record
  json.other_body team.other_body
  json.sports_type_id team.sports_type_id
  json.prefecture_id team.prefecture_id

  json.sports_disciplines do
    json.array! team.sports_disciplines, :id, :name
  end

  json.target_ages do
    json.array! team.target_ages, :id, :name
  end
end
