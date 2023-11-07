json.array! @team_sports_disciplines do |team_sports_discipline|
  json.extract! team_sports_discipline, :id, :sports_discipline_id, :team_id
end
