class RecruitmentTargetAgesController < ApplicationController
  def index
    recruitment_target_ages = RecruitmentTargetAge.where(recruitment_id: params[:recruitment_id])
    render json: recruitment_target_ages
  end
end
