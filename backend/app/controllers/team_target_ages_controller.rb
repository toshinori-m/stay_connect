class TeamTargetAgesController < ApplicationController
  def index
    @team_target_ages = TeamTargetAge.where(team_id: params[:team_id])
  end
end
