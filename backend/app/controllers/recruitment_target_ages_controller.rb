class RecruitmentTargetAgesController < ApplicationController
  def index
    if params[:recruitment_id]
      recruitment_target_ages = RecruitmentTargetAge.where(recruitment_id: params[:recruitment_id])
    else
      recruitment_target_ages = RecruitmentTargetAge.all
    end
    render json: recruitment_target_ages
  end
end
