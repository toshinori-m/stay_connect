json.array! @team_target_ages do |target_age|
  json.extract! target_age, :id, :target_age_id, :team_id
end
