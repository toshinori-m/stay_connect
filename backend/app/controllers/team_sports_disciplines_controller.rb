class TeamSportsDisciplinesController < ApplicationController
  def index
    @team_sports_disciplines = TeamSportsDiscipline.where(team_id: params[:team_id])
  end
end
