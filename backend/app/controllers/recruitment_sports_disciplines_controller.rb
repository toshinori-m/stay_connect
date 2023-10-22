class RecruitmentSportsDisciplinesController < ApplicationController
  def index
    if params[:recruitment_id]
      recruitment_sports_disciplines = RecruitmentSportsDiscipline.where(recruitment_id: params[:recruitment_id])
    else
      recruitment_sports_disciplines = RecruitmentSportsDiscipline.all
    end
    render json: recruitment_sports_disciplines
  end
end
