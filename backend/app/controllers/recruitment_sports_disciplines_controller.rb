class RecruitmentSportsDisciplinesController < ApplicationController
  def index
    recruitment_sports_disciplines = RecruitmentSportsDiscipline.where(recruitment_id: params[:recruitment_id])
    render json: recruitment_sports_disciplines
  end
end
